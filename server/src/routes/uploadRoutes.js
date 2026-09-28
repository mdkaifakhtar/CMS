const express = require('express');
const { uploadImages } = require('../controllers/uploadController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/images', protect, authorize('vendor', 'admin'), upload.any(), uploadImages);

module.exports = router;

