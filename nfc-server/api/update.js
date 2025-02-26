const { kv } = require('@vercel/kv');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, authentic, location, lat, lng } = req.body;

  if (!code || authentic === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const data = {
    code,
    authentic,
    location: location || 'Unknown',
    lat: lat || '-7.9666', // Default Malang
    lng: lng || '112.6326',
    timestamp: Date.now()
  };

  try {
    await kv.set(`nfc:${code}`, JSON.stringify(data));
    res.status(200).json({ message: 'Data saved', data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save data' });
  }
};
