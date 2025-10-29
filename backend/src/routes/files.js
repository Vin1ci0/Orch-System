const express = require('express');
const multer = require('multer');
const path = require('path');
const FileController = require('../controllers/FileController');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, '..', '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    // Add file type restrictions if needed
    cb(null, true);
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

const router = express.Router();

router.get('/', FileController.index);
router.get('/:id', FileController.show);
router.post('/', upload.single('file'), FileController.store);
router.delete('/:id', FileController.destroy);

// Download route
router.get('/:id/download', FileController.download);

module.exports = router;