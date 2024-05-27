const multer = require("multer");
const path = require("node:path");
const fs = require("node:fs");

const directory = path.join(__dirname, "../upload/temp");

if (!fs.existsSync(directory)) {
  fs.mkdirSync(directory, { recursive: true });
}

const storage = multer.diskStorage({
  destination(request, file, callback) {
    callback(null, directory);
  },
  filename(request, file, callback) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = path.extname(file.originalname);
    const fileName = `${uniqueSuffix}${extension}`;
    callback(null, fileName);
  },
});

const upload = multer({
  storage,
  fileFilter(request, file, callback) {
    if (file.mimetype === "text/csv") {
      callback(null, true);
    } else {
      callback(new Error("Only .csv format allowed!"));
    }
  },
  limits: { fileSize: 900_000 },
});

module.exports = upload;
