'use strict';
require('dotenv').config();

var AWS = require('ibm-cos-sdk');
const fs = require('fs');

var sessionToken;
var config = {
    endpoint: process.env.IBM_COS_ENDPOINT,
    apiKeyId: process.env.IBM_COS_API_KEY,
    ibmAuthEndpoint: process.env.IBM_COS_AUTH_ENDPOINT,
    serviceInstanceId: process.env.IBM_COS_RESOURCE_INSTANCE_ID,
    signatureVersion: 'v4',
    credentials: new AWS.Credentials(process.env.IBM_COS_ACCESS_KEY_ID, process.env.IBM_COS_SECRET_ACCESS_KEY, sessionToken = null),
};

var cos = new AWS.S3(config);

module.exports = {

    doCreateObject: (obj) => {
        console.log('Creating object');
        return cos.putObject({
            Bucket: 'goodfood1',
            Key: obj.name,
            Body: new Buffer(obj.localBuffer)
        }).promise();
    },

    doDeleteObject: (obj) => {
        console.log('Deleting object');
        return cos.deleteObject({
            Bucket: 'goodfood1',
            Key: obj
        }).promise();
    },

    doDownloadObject: (obj) => {
        console.log('Downloading object');
        return cos.getObject({
            Bucket: 'goodfood1',
            Key: obj
        }).createReadStream();
    },

    doGetSignedURL: async (obj) => {
        var params = { Bucket: 'goodfood1', Key: obj };
        var url = await cos.getSignedUrl('getObject', params);
        return url;
    }

}