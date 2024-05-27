const AWS = require("aws-sdk");
const config = require("./config");

const awsS3Config = {
  accessKeyId: config.s3.accessKeyId,
  secretAccessKey: config.s3.secretAccessKey,
  region: config.s3.region,
};

const { bucketName } = config;

const s3 = new AWS.S3(awsS3Config);
//exporting
module.exports = {
  s3,
  bucketName,
};
