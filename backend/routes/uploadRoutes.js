const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { promisify } = require("util");

const pipeline = promisify(require("stream").pipeline);

const router = express.Router();

const upload = multer();

router.post("/resume", upload.single("file"), (req, res) => {
  const { file } = req;
  if(file.detectedFileExtension === ".pdf"){
    const filename = `${uuidv4()}${file.detectedFileExtension}`;
    pipeline(
      file.stream,
      fs.createWriteStream(`${__dirname}/../public/resume/${filename}`)
    )
    .then(() => {
      res.send({
        message: "File uploaded successfully",
        url: `/host/resume/${filename}`,
      });
    })
    .catch((err) => {
      res.status(400).json({
        message: "Error while uploading",
      });
    });
  }else{
    res.status(400).json({
      message: "Please upload PDF File Only",
    });
  }
});

router.post("/profile", upload.single("file"), (req, res) => {
  const { file } = req;
  if(file.detectedFileExtension === ".png" || file.detectedFileExtension === ".jpg" || file.detectedFileExtension === ".png"){

    const filename = `${uuidv4()}${file.detectedFileExtension}`;

    pipeline(
      file.stream,
      fs.createWriteStream(`${__dirname}/../public/profile/${filename}`)
    )
    .then(() => {
      res.send({
        message: "Profile image uploaded successfully",
        url: `/host/profile/${filename}`,
      });
    })
    .catch((err) => {
      res.status(400).json({
        message: "Error while uploading",
      });
    });
  }else{
    res.status(400).json({
      message: "Please upload JPG, JPEG & PNG File Only",
    });
  }
});

module.exports = router;
