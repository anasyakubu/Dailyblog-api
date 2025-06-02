"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContentS3 = exports.uploadContentToS3 = exports.getContentS3 = exports.getContentCloudFront = exports.s3 = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const node_http_handler_1 = require("@aws-sdk/node-http-handler");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const client_cloudfront_1 = require("@aws-sdk/client-cloudfront");
const crypto_1 = __importDefault(require("crypto"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const randomImageName = (bytes = 32) => crypto_1.default.randomBytes(bytes).toString("hex");
//*********** setup s3 connection ***********//
const s3 = new client_s3_1.S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_BUCKET_REGION,
    requestHandler: new node_http_handler_1.NodeHttpHandler({
        connectionTimeout: 20000, // 20 seconds
        socketTimeout: 20000, // 20 seconds
    }),
});
exports.s3 = s3;
//*********** setup cloudFront connection ***********//
const cloudFront = new client_cloudfront_1.CloudFrontClient({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
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
const getContentCloudFront = (key) => {
    try {
        const cloudFrontURL = `${process.env.AWS_CLOUDFRONT_DISTRIBUTION_NAME}/${key}`;
        // console.log(cloudFrontURL);
        return cloudFrontURL;
    }
    catch (error) {
        console.error("Fail to getContentCloudFront:", error);
    }
};
exports.getContentCloudFront = getContentCloudFront;
//*********** get content from s3 directly using the SignedUrl ***********//
const getContentS3 = (key) => {
    try {
        const getObjectParams = { Bucket: process.env.AWS_BUCKET_NAME, Key: key, };
        const command = new client_s3_1.GetObjectCommand(getObjectParams);
        const url = (0, s3_request_presigner_1.getSignedUrl)(s3, command, { expiresIn: 3600 });
        return url;
    }
    catch (error) {
        console.error("Fail to getContentS3:", error);
    }
};
exports.getContentS3 = getContentS3;
//*********** upload file content to s3 ***********//
const uploadContentToS3 = (body, ContentType) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const key = randomImageName();
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key, Body: body, ContentType: ContentType,
        };
        const command = new client_s3_1.PutObjectCommand(params);
        yield s3.send(command);
        return key;
    }
    catch (error) {
        console.error("Fail to getContentS3:", error);
    }
});
exports.uploadContentToS3 = uploadContentToS3;
//*********** delete content from s3 ***********//
const deleteContentS3 = (key) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
        };
        const command = new client_s3_1.DeleteBucketCommand(params);
        yield s3.send(command);
    }
    catch (error) {
        console.error("Fail to delete:", error);
    }
});
exports.deleteContentS3 = deleteContentS3;
