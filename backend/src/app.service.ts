import { v4 as uuidv4 } from 'uuid';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Message } from './app.entity';
import { checkTimeConflict } from './utils.js';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async getMessages() {
    try {
      const messages = await this.messageRepository.find({});
      if (!messages) throw new Error('No messages found');
      return { status: 200, data: messages };
    } catch (error) {
      return { status: 400, data: error.message };
    }
  }

  async deletePlan({ id, displayId }) {
    try {
      const message = await this.messageRepository.findOne({
        where: { displayId },
      });

      if (message) {
        if (!message.timing) message.timing = [];
        const timingUpdated = message.timing.filter(
          (timing) => timing.id !== id,
        );
        message.timing = timingUpdated;
        await this.messageRepository.save(message);
      } else {
        throw new Error('Message not found');
      }
      return { status: 200, data: 'deleted' };
    } catch (error) {
      return { status: 400, data: error.message };
    }
  }

  async planMessage({ endDate, startDate, displayId }) {
    if (!endDate || !startDate || !displayId) {
      throw new Error('Missing parameters');
    }

    try {
      const messages = await this.messageRepository.find({});
      const hasConflict = checkTimeConflict(startDate, endDate, messages);
      if (hasConflict) throw new Error('Conflict with another planned message');

      const message = await this.messageRepository.findOne({
        where: { displayId },
      });

      if (message) {
        if (!message.timing) message.timing = [];
        message.timing.push({ startDate, endDate, id: uuidv4() });

        await this.messageRepository.save(message);
      } else {
        throw new Error('Message not found');
      }

      const updatedMessage = await this.messageRepository.findOne({
        where: { displayId },
      });

      return { status: 201, data: updatedMessage };
    } catch (error) {
      return { status: 400, data: error.message };
    }
  }
}
