const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const { File, Project } = require('../models');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, '..', '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    crypto.randomBytes(16, (err, raw) => {
      if (err) return cb(err);
      cb(null, raw.toString('hex') + path.extname(file.originalname));
    });
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/pjpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type.'));
    }
  }
});

module.exports = {
  uploadMiddleware: upload.single('file'),

  // Upload file
  async store(req, res) {
    try {
      const { originalname: originalName, filename, mimetype, size } = req.file;
      const { projectId } = req.body;

      const file = await File.create({
        originalName,
        filename,
        mimetype,
        size,
        path: \`/uploads/\${filename}\`,
        projectId
      });

      return res.json(file);
    } catch (err) {
      return res.status(400).json({ error: 'File upload failed' });
    }
  },

  // List files
  async index(req, res) {
    try {
      const where = {};
      if (req.query.projectId) {
        where.projectId = req.query.projectId;
      }

      const files = await File.findAll({
        where,
        include: [{ model: Project }]
      });

      return res.json(files);
    } catch (err) {
      return res.status(400).json({ error: 'Error loading files' });
    }
  },

  // Delete file
  async destroy(req, res) {
    try {
      const file = await File.findByPk(req.params.id);

      if (!file) {
        return res.status(404).json({ error: 'File not found' });
      }

      await file.destroy();
      return res.send();
    } catch (err) {
      return res.status(400).json({ error: 'File deletion failed' });
    }
  }
};