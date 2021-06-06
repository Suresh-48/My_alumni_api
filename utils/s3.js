import fs from "fs";
import AWS from "aws-sdk";
import config from "../config";
const path = require("path");

import core from "../core";
import { SETTINGS_MEDIA_PATH } from "../core/Setting";

/**
 * Update AWS config
 */
AWS.config.update({
    accessKeyId: config.awsAccessKeyId,
    secretAccessKey: config.awsSecretAccessKey,
});

const s3 = new AWS.S3();

/**
 * Upload  file contents
 *
 * @param {*} fileContent
 * @param {*} uploadPath
 * @param {*} callback
 */
function uploadFileContents(fileContent, uploadPath, callback) {
    const params = {
        Bucket: config.aws.bucketName,
        Key: uploadPath,
        Body: fileContent,
    };

    s3.putObject(params, err => {
        if (err) {
            return callback(err);
        }

        return callback();
    });
}

/**
 * Upload Public File
 *
 * @param {*} file
 * @param {*} uploadPath
 * @param {*} callback
 */
export function uploadPublicFile(file, uploadPath, callback) {
    fs.readFile(file, (err, fileContent) => {
        if (err) {
            return callback(err);
        }

        return uploadFilePublicContents(fileContent, uploadPath, callback);
    });
}

/**
 * Upload public file contents
 *
 * @param {*} fileContent
 * @param {*} uploadPath
 * @param {*} callback
 */
function uploadFilePublicContents(fileContent, uploadPath, callback) {
    const params = {
        Bucket: config.aws.bucketName,
        Key: uploadPath,
        Body: fileContent,
        ACL: "public-read",
    };

    s3.putObject(params, err => {
        if (err) {
            return callback(err);
        }

        return callback();
    });
}

/**
 * Delete file
 *
 * @param {*} filePath
 * @param {*} callback
 */
export function delFile(filePath, callback) {
    const params = {
        Bucket: config.aws.bucketName,
        Key: filePath,
    };

    s3.deleteObject(params, err => {
        if (err) {
            return callback(err);
        }

        return callback();
    });
}

/**
 * Get File
 *
 * @param {*} filePath
 * @param {*} callback
 */
export function getFile(filePath, callback) {
    return s3.getObject(
        {
            Bucket: config.aws.bucketName,
            Key: filePath,
        },
        callback
    );
}

/**
 * Get File URL
 *
 * @param {*} filePath
 * @param {*} callback
 */
export async function getS3ObjectUrl(filePath) {
    const { Setting } = core;
    const setting = new Setting();
    const mediaBaseUrl = await setting.getMediaBaseUrl();

    return `${mediaBaseUrl}/${SETTINGS_MEDIA_PATH}/${filePath}`;
}

/**
 * Upload File
 *
 * @param {*} file
 * @param {*} uploadPath
 * @param {*} callback
 */
export function uploadFile(file, uploadPath, callback) {
    fs.readFile(file, (err, fileContent) => {
        if (err) {
            return callback(err);
        }

        return uploadFileContents(fileContent, uploadPath, callback);
    });
}

/**
 * Rename file name
 *
 * @param {*} filePath
 * @param {*} newPath
 * @param {*} callback
 */
export function renameFile(filePath, newPath, callback) {
    if (filePath === newPath) {
        return callback();
    }

    const params = {
        Bucket: config.aws.bucketName,
        CopySource: encodeURI(`${config.aws.bucketName}/${filePath}`),
        Key: newPath,
    };

    s3.copyObject(params, err => {
        if (err) {
            return callback(err);
        }

        return delFile(filePath, callback);
    });
}

/**
 * Upload Base64 To File
 *
 * @param base64
 * @param newPath
 * @param callback
 */
export function uploadBase64File(base64, newPath, callback, options) {
    const buffer = Buffer.from(
        base64.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
    );

    const params = {
        Bucket: config.aws.bucketName,
        Key: newPath,
        Body: buffer,
        ContentEncoding: "base64",
        ContentType: "image/png",
    };

    if (options && typeof options === "object" && options.public)
        params.ACL = "public-read";

    const extension = path.extname(newPath);
    params.Key = `${path.dirname(newPath)}/${path.basename(
        newPath,
        extension
    )}${extension}`;

    s3.putObject(params, err => {
        if (err) {
            return callback(err);
        }

        return callback();
    });
}

export function uploadBase64FileAsync(base64, newPath) {
    return new Promise((resolve, reject) => {
        return uploadBase64File(base64, newPath, err => {
            if (err) {
                return reject(err);
            }

            return resolve();
        });
    });
}

/**
 * Copy File
 *
 * @param {*} filePath
 * @param {*} callback
 */
export function copyFile(resource, destination, callback) {
    const params = {
        Bucket: config.aws.bucketName,
        CopySource: `${config.aws.bucketName}${resource}`,
        Key: destination,
        ACL: "public-read",
    };

    s3.copyObject(params, function(err, data) {
        if (err) {
            return callback(null, err);
        }

        return callback(null, data);
    });
}
