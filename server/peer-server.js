
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
  keyFilename: './MoveEasy-1.json'
};

const vision = Vision(
  config
);

const opts = {
  verbose: true,
  types: ['label']
};



// app.post('/upload').post(upload.single('image'), (req, res) => {
//   console.log('req', req.body);
// });


app.post('/api/croppedImage', (req, res, next) => {
  var photoData = req.body.image;
  photoData = photoData.replace(/^data:image\/jpeg;base64,/, "");
  //FileSaver.saveAs(photoData, "hello_world.jpg");
  console.log('req', photoData);

  fs.writeFile('images/logo.png', photoData, 'base64', function(err){
    if (err) throw err;

    var params = {Bucket: 'bucket', Key: 'key', Body: stream};
    var options = {partSize: 10 * 1024 * 1024, queueSize: 1};
    s3.upload(params, options, function(err, data) {
      console.log(err, data);
    });


  });









  // vision.detect(fileName, opts).then((data) => {
  //   const detections = data[0];
  //   const apiResponse = data[1];

  //   console.log('apiResponse', detections);
  // });
});