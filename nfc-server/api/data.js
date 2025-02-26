const { kv } = require('@vercel/kv');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const keys = await kv.keys('nfc:*');
    const data = [];

    for (const key of keys) {
      const item = await kv.get(key);
      const parsedItem = JSON.parse(item);
      if (parsedItem.authentic) {
        data.push(parsedItem);
      }
    }

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};
