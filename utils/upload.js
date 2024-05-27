const multer = require("multer");

const crypto = require("node:crypto");

const fs = require("node:fs");
const path = require("node:path");

const directory = path.join(__dirname, "../upload/temp");

if (!fs.existsSync(directory)) {
  fs.mkdirSync(directory, { recursive: true });
}

const storage = multer.diskStorage({
  destination(_request, _file, callback) {
    callback(undefined, directory);
  },
  filename(_request, file, callback) {
    callback(
      undefined,
      `${crypto.randomUUID({ disableEntropyCache: true })}.${
        file.mimetype.split("/")[1]
      }`
    );
  },
});

const upload = multer({
  storage,
  fileFilter: (request, file, callback) => {
    console.log(file.mimetype)
    if (request.url.split("/").pop() !== "import") {
      if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/svg+xml" ||
        file.mimetype === "text/csv" ||
        file.mimetype === "application/pdf"
      ) {
        callback(undefined, true);
      } else {
        return callback(
          new Error("Only .png, .jpg .jpeg and pdf format allowed!")
        );
      }
    }
    callback(undefined, true);
  },
  // limits: { fileSize: 200_000 },
});

module.exports = upload;
