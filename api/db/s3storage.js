const { S3Storage } = require("../s3/s3");

module.exports = {
  s3storage: new S3Storage(process.env.ACCESS_KEY, process.env.SECRET_KEY, process.env.BUCKET_NAME)
};
