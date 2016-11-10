
const Vision = require('@google-cloud/vision');
const express = require('express');
const bodyParser = require('body-parser');
const Upload = require('s3-uploader');
const fs = require('fs'); 
const s3 = require('./s3config');
const app = express();
const ExpressPeerServer = require('peer').ExpressPeerServer;



const server = app.listen(9000);


app.use('/', ExpressPeerServer(server, {debug: true}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());




//google api
const config = {
  projectId: 'projectId',
  keyFilename: './../MoveEasy-1.json'
};

const vision = Vision(
  config
);

const opts = {
  verbose: true,
  types: ['label']
};




app.post('/api/croppedImage', (req, res, next) => {
  var photoData = req.body.image;
  photoData = photoData.replace(/^data:image\/jpeg;base64,/, "");
  //FileSaver.saveAs(photoData, "hello_world.jpg");
  //console.log('req', photoData);

  const filePath = 'images/logo.png';

  fs.writeFile(filePath, photoData, 'base64', function(err){
    if (err) throw err;

    s3.upload(filePath, {}, (err, versions) => {
      if (err) {
        return console.log('error uploading file:', err);
      }
      //console.log('versions', versions);
      const imageUrl = versions[versions.length - 1].url;

      vision.detect(imageUrl, opts).then((data) => {
        const detections = data[0];
        const apiResponse = data[1];

        console.log('apiResponse', detections);
      });

    });

  });









  // vision.detect(fileName, opts).then((data) => {
  //   const detections = data[0];
  //   const apiResponse = data[1];

  //   console.log('apiResponse', detections);
  // });
});