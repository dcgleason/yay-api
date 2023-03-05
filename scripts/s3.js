const aws = require("aws-sdk");
require("dotenv").config({ path: require("find-config")(".env") });
const uuid = require("uuid");

const region = "us-east-1";
const bucketName = "test-bundle-s3upload-proto1";
const accessKeyId = process.env.AWS_ACCESS_KEY; //working
const secretAccessKey = process.env.AWS_SECRET; //working

const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: "v4",
});

const generateUploadURL = async () => {
  const randUUID = uuid.v4();
  const imgName = randUUID + ".jpg";

  const params = {
    Bucket: bucketName,
    Key: imgName,
    Expires: 60,
  };

  const uploadURL = await s3.getSignedUrlPromise("putObject", params);
  return uploadURL;
};

module.exports = { generateUploadURL };
