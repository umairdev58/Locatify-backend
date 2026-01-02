const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({ storage });

const maybeUpload = (req, res, next) => {
  const contentType = (req.headers['content-type'] || '').toLowerCase();
  if (contentType.startsWith('multipart/form-data')) {
    return upload.array('houseImages', 8)(req, res, next);
  }
  return next();
};

module.exports = { maybeUpload };
