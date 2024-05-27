const fs = require("node:fs");
const path = require("node:path");
const logger = require("../config/logger");
const { s3, bucketName } = require("../config/aws-s3");

function uploadFile(businessName, filePath) {
  // Configure the file stream and obtain the upload parameters
  try {
    const fileStream = fs.createReadStream(filePath);
    fileStream.on("error", function (error) {
      logger.error("File Error", error);
      throw new Error(error);
    });

    // call S3 to retrieve upload file to specified bucket
    const uploadParameters = {
      Bucket: bucketName,
      Key: `${businessName}/${path.basename(filePath)}`,
      Body: fileStream,
    };
    // call S3 to retrieve upload file to specified bucket
    s3.upload(uploadParameters, function (error, data) {
      if (error) {
        logger.error("Error", error);
      }
      if (data) {
        logger.info("Upload Success", data.Location);
      }
      // delete file from temp
      fs.unlink(filePath, (error_) => {
        if (error_) throw error_;
        logger.info(`${filePath} was deleted`);
      });
    });
  }
  catch (ex) {
    logger.error(ex);
  }
  
}

function uploadProfile(businessName, filePath) {
  // Configure the file stream and obtain the upload parameters
  const fileStream = fs.createReadStream(filePath);
  fileStream.on("error", function (error) {
    logger.error("File Error", error);
    throw new Error(error);
  });

  // call S3 to retrieve upload file to specified bucket
  const uploadParameters = {
    Bucket: bucketName,
    Key: `${businessName}/${path.basename(filePath)}`,
    Body: fileStream,
  };
  // call S3 to retrieve upload file to specified bucket

  return new Promise((resolve, reject) => {
    s3.upload(uploadParameters, function (error, data) {
      if (error) {
        reject(error);
        logger.error("Error", error);
      }
      if (data) {
        // delete file from temp
        fs.unlink(filePath, (error_) => {
          if (error_) throw error_;
          logger.info(`${filePath} was deleted`);
        });
        resolve(data);
        logger.info("Upload Success", data.Location);
      }
    });
  });
}

function getFile(keyName, isRoute) {
  // console.log(keyName, bucketName)

  console.log(bucketName, keyName, "sudip")
  const parameters = {
    Bucket: bucketName,
    Key: keyName,
  };
  return new Promise((resolve, reject) => {

    s3.getObject(parameters, function (error, data) {
      if (error) {
        // reject(error);
        resolve(null)
      } else {
        if (isRoute) {
          var s3url = s3.getSignedUrl('getObject', parameters);
          resolve(s3url)
        }
        else {
          resolve(data.Body.toString("base64"));
        }
        // resolve(s3url);
      }
    });
  });
}

function deleteFile(array) {
  const parameters = {
    Bucket: bucketName,
    Delete: {
      Objects: array,
    },
  };
  return new Promise((resolve, reject) => {
    s3.deleteObjects(parameters, function (error, data) {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
}

const deleteObject = async (filename) => {
  const parameters = {
    Bucket: bucketName,
    Key: filename,
  };
  return new Promise((resolve, reject) => {
    s3.deleteObject(parameters, (error, data) => {
      if (error) {
        reject({ message: error.message });
      } else {
        resolve({ message: "Deleted Successfully" });
      }
    });
  });
};

module.exports = {
  uploadFile,
  getFile,
  deleteFile,
  deleteObject,
  uploadProfile,
};
