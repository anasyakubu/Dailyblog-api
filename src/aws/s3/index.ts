import { S3Client, PutObjectCommand, GetObjectCommand, DeleteBucketCommand, } from "@aws-sdk/client-s3";
import { NodeHttpHandler } from "@aws-sdk/node-http-handler";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { CloudFrontClient, CreateInvalidationCommand, } from "@aws-sdk/client-cloudfront";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString("hex");

//*********** setup s3 connection ***********//
const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
  region: process.env.AWS_BUCKET_REGION,
  requestHandler: new NodeHttpHandler({
    connectionTimeout: 20000, // 20 seconds
    socketTimeout: 20000, // 20 seconds
  }),
});

//*********** setup cloudFront connection ***********//
const cloudFront = new CloudFrontClient({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

//*********** invalidate the cloud front cache for that image ***********//
// const invalidationParams = {
//   DistrubtionId: process.env.AWS_DISTRIBUTION_ID,
//   InvalidationBatch: { CallerRefrence: randomImageName() },
//   Paths: {
//     Quantity: 1,
//     Items: ["/" + randomImageName()],
//   },
// };

// const invalidationCommand = new CreateInvalidationCommand(invalidationParams);
// await cloudFront.send(invalidationCommand);

//*********** get content from cloudFront ***********//
const getContentCloudFront = (key: string) => {
  try {
    const cloudFrontURL = `${process.env.AWS_CLOUDFRONT_DISTRIBUTION_NAME}/${key}`;
    // console.log(cloudFrontURL);
    return cloudFrontURL;
  } catch (error) { console.error("Fail to getContentCloudFront:", error); }
};

//*********** get content from s3 directly using the SignedUrl ***********//
const getContentS3 = (key: string) => {
  try {
    const getObjectParams = { Bucket: process.env.AWS_BUCKET_NAME, Key: key, };

    const command = new GetObjectCommand(getObjectParams);
    const url = getSignedUrl(s3, command, { expiresIn: 3600 });
    return url;
  } catch (error) { console.error("Fail to getContentS3:", error); }
};

//*********** upload file content to s3 ***********//
const uploadContentToS3 = async (body: any, ContentType: string) => {
  try {
    const key = randomImageName();
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key, Body: body, ContentType: ContentType,
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);
    return key;
  } catch (error) { console.error("Fail to getContentS3:", error); }
};

//*********** delete content from s3 ***********//

const deleteContentS3 = async (key: string) => {
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    };

    const command = new DeleteBucketCommand(params);

    await s3.send(command);
  } catch (error) {
    console.error("Fail to delete:", error);
  }
};

export { s3, getContentCloudFront, getContentS3, uploadContentToS3, deleteContentS3, };
