'use strict';
const Upload = require('s3-uploader');
const secret = require('./secret.js');

module.exports = new Upload('movekick', {
  aws: {
    path: 'images/',
    region: 'us-west-2',
    acl: 'public-read',
    accessKeyId: secret.AWSAccessKeyId,
    secretAccessKey: secret.AWSSecretKey,
  },

  cleanup: {
    versions: true,
    original: false,
  },

  original: {
    awsImageAcl: 'public-read',
  },
  versions: [
    {
      maxHeight: 1040,
      maxWidth: 1040,
      format: 'jpg',
      suffix: '-large',
      quality: 80,
      awsImageExpires: 31536000,
      awsImageMaxAge: 31536000,
    },
    {
      maxWidth: 780,
      aspect: '3:2!h',
      suffix: '-medium',
    },
    {
      maxWidth: 320,
      aspect: '16:9!h',
      suffix: '-small',
    },
    {
      maxHeight: 100,
      aspect: '1:1',
      format: 'png',
      suffix: '-thumb1',
    },
    {
      maxHeight: 250,
      maxWidth: 250,
      aspect: '1:1',
      suffix: '-thumb2',
    },
  ],
});
