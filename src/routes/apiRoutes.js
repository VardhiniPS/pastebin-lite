const express = require('express');
const router = express.Router();
const pasteController = require('../controllers/pasteController');

// Health check
router.get('/healthz', (req, res) => res.json({ ok: true }));

// Create paste
router.post('/pastes', pasteController.createPaste);

// Get paste JSON
router.get('/pastes/:id', pasteController.getPaste);

module.exports = router;
