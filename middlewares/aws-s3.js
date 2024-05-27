const path = require("node:path");
const slugify = require("slugify");

const { uploadFile } = require("../utils/aws-s3");
const { fileSettings } = require("../config/config");
const sharp = require("sharp");
const { decrypt } = require("../utils/encrypt");
const logger = require("../config/logger");


const getFileSize = (type) => {
  if (type) {
    if (fileSettings.fileTypes.assignment.includes(type)) {
      return fileSettings.fileSize.assignment;
    }
  }
  return fileSettings.fileSize.image
}

const s3Upload = (fields) => async (request, _response, next) => {
  try {
    const keys = Object.keys(request.files);
    for (const { name } of fields) {
      if (keys.includes(name)) {
        const fileType = request.body.type;

        const uploadableFileSize = getFileSize(fileType);
        // if (request.files[name][0].size > uploadableFileSize) {
        //   throw new Error(`file size not more than ${uploadableFileSize / 1000} ${fileSettings.fileTypes.assignment.includes(fileType) ? 'Mb' : 'Kb'}`);
        // }

        console.log(name, fileType, request.files[name][0].size, '-------------')

        const bucketFolderName = fileType ? (fileSettings.fileTypes.assignment.includes(fileType) ? fileSettings.s3folder.assignment : fileSettings.s3folder.image) : slugify("school name");
        request.body.bucketFolderName = bucketFolderName;

        if (fileType !== "student-profile-photo") {
          // set filename
          request.body[name] = request.files[name][0].filename;
          uploadFile(
            // slugify("school name"),
            bucketFolderName,
            path.join(__dirname, `../upload/temp/${request.body[name]}`)
          );
        }

        else {
          try {
            const image = await sharp(request.files[name][0].path);

            const image_metadata = await image.metadata();
            request.body[name] = `${+decrypt(request.body.studentId)}.${image_metadata.format}`;
            let height = '';
            let width = '';
            console.log(image_metadata.height, image_metadata.width);
            if (image_metadata.width > 300 && image_metadata.height > 300) {
              height = 300;
              width = 300;
            }
            else {
              height = image_metadata.height;
              width = image_metadata.width;
            }
            const data = await image.resize(width, height).toFile(path.join(__dirname, `../upload/temp/${request.body[name]}`));
            uploadFile(
              bucketFolderName,
              path.join(__dirname, `../upload/temp/${request.body[name]}`)
            );
          }
          catch (ex) {
            logger.info(ex);
          }
        }
      }
    }
    next();
  } catch (error) {
   // throw new Error(error);
   logger.info(ex);
   //return _response.send(error);
  }
};

module.exports = s3Upload;
