export default function handler(req, res) {
  const { to } = req.query;
  if (!to) return res.status(400).send('Missing target');
  res.writeHead(302, { Location: decodeURIComponent(to) });
  res.end();
}
