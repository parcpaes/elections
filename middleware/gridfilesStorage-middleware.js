const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');

const mongoURL = 'mongodb://localhost/election';
const crypto = require('crypto');
const path = require('path');

const images = new Set(['image/png', 'image/jpeg', 'image/bmp', 'image/webp']);

const storage = new GridFsStorage({
  url: mongoURL,
  file: (req, file) => {
    if (!images.has(file.mimetype)) return null;
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename,
        };
        return resolve(fileInfo);
      });
    });
  },
});
const upload = multer({ storage, limits: { fileSize: 1 << 23 } });
module.exports = upload;
