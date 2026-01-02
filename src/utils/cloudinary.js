const streamifier = require('streamifier');
const cloudinary = require('cloudinary').v2;

// const { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_FOLDER } =
//   process.env;


console.log(process.env.CLOUDINARY_API_KEY)
const uploadBuffer = (buffer, folder) =>
  new Promise((resolve, reject) => {
    if (!buffer) {
      reject(new Error('Invalid buffer received for Cloudinary upload.'));
      return;
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result.secure_url);
      },
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });

const uploadFiles = async (files = []) => {
  const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_FOLDER = process.env.CLOUDINARY_UPLOAD_FOLDER;
console.log('CLOUDINARY_API_SECRET', CLOUDINARY_API_SECRET)
console.log('CLOUDINARY_CLOUD_NAME', CLOUDINARY_CLOUD_NAME)
console.log('CLOUDINARY_UPLOAD_FOLDER', CLOUDINARY_UPLOAD_FOLDER)
console.log('CLOUDINARY_API_KEY', CLOUDINARY_API_KEY)
const hasCloudinaryConfig = Boolean(CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET && CLOUDINARY_CLOUD_NAME);

if (hasCloudinaryConfig) {
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });
}
  if (!files.length) {
    return [];
  }

  if (!hasCloudinaryConfig) {
    console.log(process.env.CLOUDINARY_API_KEY)
    console.warn('Cloudinary credentials missing; skipping house image uploads.');
    return [];
  }

  const folder = CLOUDINARY_UPLOAD_FOLDER ?? 'locatify/house-images';

  const uploadPromises = files.map((file) =>
    uploadBuffer(file.buffer, folder).then((url) => {
      console.log(`Cloudinary: uploaded ${file.originalname} -> ${url}`);
      return url;
    }),
  );
  return Promise.all(uploadPromises);
};

module.exports = {
  uploadFiles,
};

