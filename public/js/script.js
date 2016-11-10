$(function(){

  var messages = [];
  var peer_id, name, conn;
  var messages_template = Handlebars.compile($('#messages-template').html());

  var cropper;

  var peer = new Peer({
    host: 'localhost',
    port: 9000,
    path: '/peerjs',
    debug: 3,
    config: {'iceServers': [
    { url: 'stun:stun1.l.google.com:19302' },
    { url: 'turn:numb.viagenie.ca',
      credential: 'muazkh', username: 'webrtc@live.com' }
    ]}
  });

  peer.on('open', function(){
    $('#id').text(peer.id);
  });

  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

  function getVideo(callback){
    navigator.getUserMedia({audio: true, video: true}, callback, function(error){
      console.log(error);
      alert('An error occured. Please try again');
    });
  }


  var cropAndSend = () => {
    var imageData = cropper.getCroppedCanvas().toDataURL('image/jpeg');
    sendImageData(imageData);
    const url = 'http://localhost:9000/api/croppedImage';

    // cropper.getCroppedCanvas().toBlob(function (blob) {

    //   console.log('blob', blob);

    // //   $.post(url,
    // //     {image: blob}
    // //   ).done(function() {
    // //     console.log( "success" );
    // //   })
    // //   .fail(function(err) {
    // //     console.log( "error", err );
    // //   });
    // // });

    //   var formData = new FormData();

    //   formData.append('croppedImage', blob);

    //   // Use `jQuery.ajax` method
    //   $.ajax(url, {
    //     method: "POST",
    //     data: formData,
    //     processData: false,
    //     contentType: false,
    //     success: function () {
    //       console.log('Upload success');
    //     },
    //     error: function () {
    //       console.log('Upload error');
    //     }
    //   });
    // });

  }

  var sendImageData = (imageData) => {
    const url = 'http://localhost:9000/api/croppedImage';

    // const photo = {
    //   uri: imageData,
    //   type: 'image/jpeg',
    //   name: 'image'
    // };


    // const form = new FormData();
    // form.append('image', photo);

    // fetch(url,
    //   {
    //     body: form,
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'multipart/form-data'
    //     },
    // })
    // .then(res => console.log('Response from postPhotoAndLocation:', res))
    // .catch(err => console.log('Error postPhotoAndLocation (utils.js):', err));


    $.post('http://localhost:9000/api/croppedImage',
      {image: imageData}
    ).done(function() {
      console.log( "success" );
    })
    .fail(function(err) {
      console.log( "error", err );
    });


  };



  var captureImage = function(event) {
    var scale = 0.5;
    var canvas = document.createElement("canvas");

    var video = event.target;
    var $output = $('#peer-screenshot');


    canvas.width = video.videoWidth * scale;
    canvas.height = video.videoHeight * scale;
    canvas.getContext('2d')
          .drawImage(video, 0, 0, canvas.width, canvas.height);

    var img = document.createElement("img");
    img.src = canvas.toDataURL();
    $output.append(img);

    // var cropper = new Cropper(img, {
    //   crop: function(e) {
    //     console.log('cropped');
    //     var imageData = this.cropper.getCroppedCanvas().toDataURL('image/jpeg');
    //     sendImageData(imageData);
    //   }
    // });

    cropper = new Cropper(img);


  };

  getVideo(function(stream){
    window.localStream = stream;
    onReceiveStream(stream, 'my-camera');
  });

  function onReceiveStream(stream, element_id){
    var video = $('#' + element_id + ' video')[0];
    video.src = window.URL.createObjectURL(stream);
    window.peer_stream = stream;

    console.log('hit');


    video = $('video');
    // video.click(function(){
    //   captureImage(video);
    // });

    video.click(captureImage);

    $('#send-image').click(cropAndSend);

  }

  $('#login').click(function(){
    name = $('#name').val();
    peer_id = $('#peer_id').val();
    if(peer_id){
      conn = peer.connect(peer_id, {metadata: {
        'username': name
      }});
      conn.on('data', handleMessage);
    }

    $('#chat').removeClass('hidden');
    $('#connect').addClass('hidden');
  });

  peer.on('connection', function(connection){
    conn = connection;
    peer_id = connection.peer;
    conn.on('data', handleMessage);

    $('#peer_id').addClass('hidden').val(peer_id);
    $('#connected_peer_container').removeClass('hidden');
    $('#connected_peer').text(connection.metadata.username);
  });

  function handleMessage(data){
    var header_plus_footer_height = 285;
    var base_height = $(document).height() - header_plus_footer_height;
    var messages_container_height = $('#messages-container').height();
    messages.push(data);

    var html = messages_template({'messages' : messages});
    $('#messages').html(html);

    if(messages_container_height >= base_height){
      $('html, body').animate({ scrollTop: $(document).height() }, 500);
    }
  }

  function sendMessage(){
    var text = $('#message').val();
    var data = {'from': name, 'text': text};

    conn.send(data);
    handleMessage(data);
    $('#message').val('');
  }

  $('#message').keypress(function(e){
    if(e.which == 13){
      sendMessage();
    }
  });

  $('#send-message').click(sendMessage);

  $('#call').click(function(){
    console.log('now calling: ' + peer_id);
    console.log(peer);
    var call = peer.call(peer_id, window.localStream);
    call.on('stream', function(stream){
      window.peer_stream = stream;
      onReceiveStream(stream, 'peer-camera');
    });
  });

  peer.on('call', function(call){
    onReceiveCall(call);
  });

  function onReceiveCall(call){
    call.answer(window.localStream);
    call.on('stream', function(stream){
      window.peer_stream = stream;
      onReceiveStream(stream, 'peer-camera');
    });
  }

});
