const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

// Wrapper around S3Client (see: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/s3/)
class S3Storage {
  constructor(accessKey, secretKey, bucketName) {
    this.client = new S3Client({
      endpoint: "https://s3.fr-par.scw.cloud",
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
      },
      region: "fr-par",
    });
    this.baseConfig = {
      ACL: "public-read",
      // WARNING: don't remove, this allows the free-tier s3 
      StorageClass: "ONEZONE_IA",
      Bucket: bucketName,
    }
    this.url = `https://${bucketName}.s3.fr-par.scw.cloud`;
  }

  // Retrieve the S3 url associated to the object with `key`
  getObjectUrl(key) {
    return `${this.url}/${key}`;
  }

  injectBaseConfig(config) {
    return {
      ...config,
      ...this.baseConfig,
    }
  }

  // Upload a file to S3 bucket and returns its public url
  async uploadFile(file) {
    const imageUUID = crypto.randomUUID();
    const config = this.injectBaseConfig({
      Key: imageUUID,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.client.send(new PutObjectCommand(config))

    return this.getObjectUrl(imageUUID);
  }
}

module.exports = {
  S3Storage
}
