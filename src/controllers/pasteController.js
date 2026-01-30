const Paste = require('../models/paste');
const { v4: uuidv4 } = require('uuid');

// Helper to get current time considering TEST_MODE
const getCurrentTime = (req) => {
  if (process.env.TEST_MODE === '1' && req.headers['x-test-now-ms']) {
    return new Date(Number(req.headers['x-test-now-ms']));
  }
  return new Date();
};

exports.createPaste = async (req, res) => {
  try {
    const { content, ttl_seconds, max_views } = req.body;
    if (!content) return res.status(400).json({ error: 'Content is required' });

    const id = uuidv4();

    const paste = await Paste.create({
      id,
      content,
      ttl_seconds: ttl_seconds || null,
      max_views: max_views || null,
      views: 0,
    });

    res.json({ id, url: `${req.protocol}://${req.get('host')}/p/${id}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPaste = async (req, res) => {
  try {
    const paste = await Paste.findByPk(req.params.id);
    if (!paste) return res.status(404).json({ error: 'Paste not found' });

    const now = getCurrentTime(req);

    // TTL check
    if (paste.ttl_seconds) {
      const expireTime = new Date(paste.created_at.getTime() + paste.ttl_seconds * 1000);
      if (now > expireTime) return res.status(404).json({ error: 'Paste expired' });
    }

    // Max views check
    if (paste.max_views !== null && paste.views >= paste.max_views) {
      return res.status(404).json({ error: 'Paste expired' });
    }

    // Increment view count
    paste.views += 1;
    await paste.save();

    res.json({
      content: paste.content,
      remaining_views: paste.max_views !== null ? paste.max_views - paste.views : null,
      expires_at: paste.ttl_seconds
        ? new Date(paste.created_at.getTime() + paste.ttl_seconds * 1000)
        : null,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.viewPaste = async (req, res) => {
  try {
    const paste = await Paste.findByPk(req.params.id);
    if (!paste) return res.status(404).send('<h1>Paste not found or expired</h1>');

    const now = getCurrentTime(req);

    // TTL check
    if (paste.ttl_seconds) {
      const expireTime = new Date(paste.created_at.getTime() + paste.ttl_seconds * 1000);
      if (now > expireTime) return res.status(404).send('<h1>Paste expired</h1>');
    }

    // Initialize views if null
    if (paste.views === null || paste.views === undefined) paste.views = 0;

    // Max views check
    if (paste.max_views !== null && paste.views >= paste.max_views) {
      return res.status(404).send('<h1>Paste expired</h1>');
    }

    // Increment view count
    paste.views += 1;
    await paste.save();

    // Safe HTML rendering
    const safeContent = paste.content
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    res.send(`<pre>${safeContent}</pre>`);
  } catch (err) {
    res.status(500).send('<h1>Server error</h1>');
  }
};
