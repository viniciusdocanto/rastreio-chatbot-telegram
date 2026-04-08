import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';

dotenv.config();
const token = process.env.TOKEN;

if (!token) {
  throw new Error('TOKEN is not set in environment variables');
}

const app = new TelegramBot(token, { polling: true });

app.on('polling_error', (error: Error) => {
  console.error('[TelegramBot Polling Error]', error.message);
});

export default app;
