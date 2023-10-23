// src/populateDB.ts

import { createConnection } from 'typeorm';
import { Message } from './src/app.entity';

const data = [
  {
    text: 'Discover the new Toyota',
    color: 'blue',
    motion: 'spin',
    displayId: 'toy',
  },
  {
    text: "It's Halloween",
    color: 'orange',
    motion: 'shake',
    displayId: 'hallo',
  },
  {
    text: 'Save the planet',
    color: 'green',
    motion: 'static',
    displayId: 'planet',
  },
];

async function populateDatabase() {
  const connection = await createConnection();
  const messageRepository = connection.getRepository(Message);

  for (const item of data) {
    const message = new Message();
    message.text = item.text;
    message.color = item.color;
    message.motion = item.motion;
    message.displayId = item.displayId;
    await messageRepository.save(message);
  }

  console.log('Data has been inserted!');
  await connection.close();
}

populateDatabase();
