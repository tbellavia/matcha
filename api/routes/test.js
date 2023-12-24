const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const { checkTokenMiddleware } = require("../middleware/check-token-middleware");
const { S3Storage } = require("../s3/s3");

require('dotenv').config()

const s3storage = new S3Storage(process.env.ACCESS_KEY, process.env.SECRET_KEY, process.env.BUCKET_NAME)

router.get("/", (req, res) => {
  console.log(`Request: ${req}`);
  return res.json({ text: "user valide" })
})

router.get('/me', checkTokenMiddleware, (req, res) => {
  res.json({
    message: `User logged with id ${res.locals.id_user}`
  })
});

router.post("/upload", upload.single("image"), async (req, res) => {
  const url = await s3storage.uploadFile(req.file)
  console.log(url)
  res.sendStatus(200)
})

module.exports = router;
