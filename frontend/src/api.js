const apiUri = import.meta.env.VITE_API_URI

export const getMessages = () => {
  return fetch(apiUri + '/getMessages')
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => console.log('error', error))
}

export const submitPlan = (options) => {
  return fetch(apiUri + '/plan', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(options)
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      return response.json()
    })
    .then((data) => data)
    .catch((error) => console.log('error', error))
}

export const deletePlan = (displayId, timeId) => {
  return fetch(apiUri + `/plan/${displayId}/${timeId}`, {
    method: 'DELETE'
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      return response.json()
    })
    .then((data) => data)
    .catch((error) => console.log('error', error))
}
