const multer = require("multer");
const { s3storage } = require("../db/s3storage");
const logger = require("../common/logger");

const storage = multer.memoryStorage();

const upload = multer({ storage });
const MAX_IMAGES = 5;
const ONE_MB = 1024 * 1024
const MAX_IMAGE_SIZE = 10 * ONE_MB;
const ALLOWED_TYPES = ["image/jpeg", "image/png"];


const checkImagesMiddleware = (req, res, next) => {
  logger.info("check images middleware called");

  upload.array("photos", MAX_IMAGES)(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    const photos = req.files;
    const errors = [];

    // Valid file types and sizes
    photos.forEach(file => {
      if (!ALLOWED_TYPES.includes(file.mimetype)) {
        errors.push(`Invalid file type: ${file.originalname}`);
      }

      if (file.size > MAX_IMAGE_SIZE) {
        errors.push(`File too large: ${file.originalname}}`);
      }
    })

    if (errors.length > 0) {
      return res.status(400).json({ errors: errors });
    }

    // Attach files to the request object
    req.photos = photos;

    // Proceed to next middleware or routes
    next();
  })
}

const uploadImagesToS3Middleware = async (req, res, next) => {
  logger.info("S3 upload images middlware called");

  if (!req.photos) {
    logger.error("no files found in request");
    return res.status(400).json({ error: "no files found in request" });
  }
  const errors = [];

  let urls = req.photos.map(async photo => {
    try {
      logger.info(`uploading image ${photo.originalname} on S3 bucket`);
      return await s3storage.uploadFile(photo)
    } catch (err) {
      logger.error(`error while upload images on s3 bucket ${err}`);
      errors.push(`error while uploading images on s3 bucket`);
    }
  });
  urls = await Promise.all(urls);

  logger.info(`URLS: ${urls}`);

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  req.photos = urls;

  // Proceed to next request
  next();
}

module.exports = {
  checkImagesMiddleware,
  uploadImagesToS3Middleware,
}
