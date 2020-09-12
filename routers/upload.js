const router = require("express").Router();
const mongoose = require("mongoose");
const connection = require("../util/dbConnection");
const dotenv = require("dotenv");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const GridFSStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");

const auth = require("../util/auth");

dotenv.config();

// Init gfs
let gfs;

connection.once("open", () => {
  // Init stream
  gfs = Grid(connection.db, mongoose.mongo);
  gfs.collection("uploads");
});

// // Create storage engine
const storage = new GridFSStorage({
  url: process.env.MONGODB_URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
});

const upload = multer({ storage });

router.post("/", auth, upload.single("file"), (req, res) => {
  res.status(200).json({
    imageUrl: `${req.headers.host}/api/upload/image/${req.file.filename}`,
  });
});

// @route GET /image/:filename
// @desc Display Image
router.get("/image/:filename", (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "No file exists",
      });
    }

    // Check if image
    if (file.contentType === "image/jpeg" || file.contentType === "image/png") {
      // Read output to browser
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: "Not an image",
      });
    }
  });
});

// @route DELETE /files/:id
// @desc  Delete file
router.delete("/:filename", auth, (req, res) => {
  gfs.remove(
    { filename: req.params.filename, root: "uploads" },
    (err, gridStore) => {
      if (err) {
        return res.status(404).json({ err: err });
      }

      res.status(200).json({ message: "Successfully deleted file" });
    }
  );
});

module.exports = router;
