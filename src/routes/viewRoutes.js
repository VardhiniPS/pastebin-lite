const express = require('express');
const router = express.Router();
const pasteController = require('../controllers/pasteController');

// View paste in HTML
router.get('/p/:id', pasteController.viewPaste);

module.exports = router;
