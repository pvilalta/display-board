<template>
  <div class="display-board">
    <div class="display-controller">
      <div class="form">
        <h2>Planning form</h2>
        <div class="form-group">
          <label for="startDate">Start date: </label>
          <input
            type="time"
            id="startDate"
            placeholder="Enter the start date"
            pattern="^([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$"
            required
            v-model="startDate"
          />
        </div>
        <div class="form-group">
          <label for="endDate">End date: </label>
          <input
            type="time"
            id="endDate"
            placeholder="Enter the end date"
            pattern="^([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$"
            required
            v-model="endDate"
          />
        </div>
        <div class="form-group">
          <label for="message">Messages</label>
          <select
            id="message"
            v-if="messages"
            v-model="selectedMessage"
          >
            <option
              value=""
              disabled
              selected
              style="color: black"
            >Choose message</option>
            <option
              v-for="message in messages"
              :key="message"
              :value="message.displayId"
            >
              {{ message.displayId }}
            </option>
          </select>
        </div>
        <button
          class="submit-button"
          :disabled="notSubmittable"
          @click="submitForm"
        >Submit</button>
        <span class="error-message">{{ errorMessage }}</span>
      </div>
      <div class="planned-messages">
        <h2>Planned messages</h2>
        <div class="planned-messages-list">
          <ul>
            <li
              v-for="mess in plannedMessages"
              :key="mess.id"
            >
              {{ mess.displayId }} - {{ mess.startDate }} - {{ mess.endDate }}
              <button @click="() => removePlan(mess.displayId, mess.id)">x</button>

            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="display-streamer">
      <h2>Display streamer</h2>
      <div class="square">
        <div
          v-if="messageToDisplay"
          :class="['motion', messageToDisplay.motion]"
          :style="{ backgroundColor: messageToDisplay.color }"
        ><span>{{messageToDisplay.text}}</span></div>

      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeMount, onBeforeUnmount } from 'vue'
import { getMessages, submitPlan, deletePlan } from '../api.js'

export default {
  setup() {
    const timer = ref(null)
    const messages = ref(null)
    const messageToDisplay = ref(null)

    const endDate = ref('')
    const startDate = ref('')
    const errorMessage = ref('')
    const selectedMessage = ref('')

    const notSubmittable = computed(() => {
      return (
        endDate.value.trim() === '' ||
        startDate.value.trim() === '' ||
        selectedMessage.value.trim() === ''
      )
    })

    const plannedMessages = computed(() => {
      const messagesToDisplay = []
      messages.value?.forEach((message) => {
        message.timing?.forEach((time) => {
          messagesToDisplay.push({
            id: time.id,
            text: message.text,
            color: message.color,
            endDate: time.endDate,
            motion: message.motion,
            startDate: time.startDate,
            displayId: message.displayId
          })
        })
      })
      return messagesToDisplay.sort((a, b) => (a.endDate > b.endDate ? 1 : -1))
    })

    const submitForm = async () => {
      const submittedPlan = await submitPlan({
        startDate: startDate.value,
        endDate: endDate.value,
        displayId: selectedMessage.value
      })

      if (submittedPlan.status === 201) {
        messages.value = (await getMessages()).data
      } else {
        errorMessage.value = submittedPlan.data
        setTimeout(() => {
          errorMessage.value = ''
        }, 4000)
      }
    }

    const removePlan = async (displayId, planId) => {
      if (confirm('Are you sure to delete this planned message ?')) {
        await deletePlan(displayId, planId)
        messages.value = (await getMessages()).data
      }
    }

    const onMinuteStart = async () => {
      const date = new Date()
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const currentTime = `${hours}:${minutes}`

      if (currentTime === messageToDisplay.value?.endDate) {
        await deletePlan(messageToDisplay.value.displayId, messageToDisplay.value.id)
        messages.value = (await getMessages()).data
        messageToDisplay.value = null
      }
      const hasPlanifiedMessage = plannedMessages.value.find(
        (message) => message.startDate === currentTime
      )

      if (hasPlanifiedMessage) messageToDisplay.value = hasPlanifiedMessage
    }

    const startListeningToMinuteChange = () => {
      const now = new Date()
      const delay = (60 - now.getSeconds()) * 1000 - now.getMilliseconds()

      setTimeout(() => {
        onMinuteStart()
        timer.value = setInterval(onMinuteStart, 60 * 1000)
      }, delay)
    }

    onBeforeMount(async () => (messages.value = (await getMessages()).data))
    onMounted(startListeningToMinuteChange)
    onBeforeUnmount(() => clearInterval(timer.value))

    return {
      endDate,
      messages,
      startDate,
      removePlan,
      submitForm,
      errorMessage,
      notSubmittable,
      selectedMessage,
      plannedMessages,
      messageToDisplay
    }
  }
}
</script>

<style lang="scss" scoped>
.display-board {
  display: flex;
  justify-content: space-around;
  .display-controller {
    .form {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: grey;
      padding: 24px;
      border-radius: 10px;
      width: 250px;
      height: 290px;
      .form-group {
        display: flex;
        flex-direction: column;
        width: 130px;
      }
      .submit-button {
        margin-top: 24px;
      }
      .error-message {
        margin-top: 12px;
        height: 10px;
        font-size: 10px;
      }
    }

    .planned-messages {
      display: flex;
      background: grey;
      align-items: center;
      flex-direction: column;
      width: 250px;
      height: 290px;
      padding: 24px;
      margin-top: 30px;
      border-radius: 10px;

      .planned-messages-list {
        overflow-y: scroll;
        width: 250px;
        padding: 12px 24px;
        ul {
          list-style-type: none;
          padding: 0;
          margin-top: 12px;
          li {
            display: flex;
            justify-content: space-between;
            margin: 6px 0;
          }
        }
      }
    }
  }

  .display-streamer {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    background-color: grey;
    width: 500px;
    padding: 24px;
    border-radius: 10px;
    .square {
      margin: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 80%;
      height: 80%;

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      .motion {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 250px;
        height: 250px;
        border-radius: 10px;
      }

      .spin {
        animation: spin 2s linear infinite;
      }

      @keyframes shake {
        0% {
          transform: translate(0, 0) rotate(0);
        }
        10% {
          transform: translate(-2px, 2px) rotate(-1deg);
        }
        20% {
          transform: translate(2px, 0) rotate(1deg);
        }
        30% {
          transform: translate(-2px, 2px) rotate(0);
        }
        40% {
          transform: translate(2px, 2px) rotate(-1deg);
        }
        50% {
          transform: translate(-2px, -2px) rotate(1deg);
        }
        60% {
          transform: translate(2px, 0) rotate(0);
        }
        70% {
          transform: translate(-2px, 2px) rotate(-1deg);
        }
        80% {
          transform: translate(2px, -2px) rotate(1deg);
        }
        90% {
          transform: translate(-2px, 0) rotate(0);
        }
        100% {
          transform: translate(0, -2px) rotate(-1deg);
        }
      }

      .shake {
        animation: shake 0.5s infinite;
      }
    }
  }
}
</style>
