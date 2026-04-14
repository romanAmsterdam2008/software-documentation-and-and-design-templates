import { faker } from '@faker-js/faker';
import { createObjectCsvWriter } from 'csv-writer';
import { join } from 'path';
import { mkdirSync } from 'fs';

const COUNTS = {
  USERS: 50,
  CHATS: 20,
  TEXT_MESSAGES: 600,
  ATTACHMENT_MESSAGES: 350,
};

const HEADERS = [
  'type',
  'id',
  'username',
  'email',
  'chatId',
  'chatTitle',
  'messageId',
  'authorId',
  'text',
  'fileUrl',
  'fileType',
  'chatRef',
];

interface Row {
  type: string;
  id?: string;
  username?: string;
  email?: string;
  chatId?: string;
  chatTitle?: string;
  messageId?: string;
  authorId?: string;
  text?: string;
  fileUrl?: string;
  fileType?: string;
  chatRef?: string;
}

async function main() {
  const outDir = join(process.cwd(), 'data');
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, 'seed.csv');

  const userIds: string[] = [];
  const chatIds: string[] = [];
  const rows: Row[] = [];

  for (let i = 0; i < COUNTS.USERS; i++) {
    const id = faker.string.uuid();
    userIds.push(id);
    rows.push({
      type: 'USER',
      id,
      username: faker.internet.username(),
      email: faker.internet.email(),
    });
  }

  for (let i = 0; i < COUNTS.CHATS; i++) {
    const id = faker.string.uuid();
    chatIds.push(id);
    rows.push({
      type: 'CHAT',
      id,
      chatTitle: faker.company.name(),
    });
  }

  const fileTypes = ['image/png', 'image/jpeg', 'video/mp4', 'application/pdf'];

  for (let i = 0; i < COUNTS.TEXT_MESSAGES; i++) {
    rows.push({
      type: 'TEXT_MESSAGE',
      messageId: faker.string.uuid(),
      authorId: faker.helpers.arrayElement(userIds),
      text: faker.lorem.sentence(),
      chatRef: faker.helpers.arrayElement(chatIds),
    });
  }

  for (let i = 0; i < COUNTS.ATTACHMENT_MESSAGES; i++) {
    rows.push({
      type: 'ATTACHMENT_MESSAGE',
      messageId: faker.string.uuid(),
      authorId: faker.helpers.arrayElement(userIds),
      fileUrl: faker.internet.url() + '/' + faker.system.commonFileName(),
      fileType: faker.helpers.arrayElement(fileTypes),
      chatRef: faker.helpers.arrayElement(chatIds),
    });
  }

  const writer = createObjectCsvWriter({
    path: outPath,
    header: HEADERS.map((h) => ({ id: h, title: h })),
  });
  await writer.writeRecords(rows);
  console.log(`Wrote ${rows.length} rows to ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
