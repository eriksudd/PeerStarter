import React, { Component } from 'react';
import ReactPlayer from 'react-player'
import io from 'socket.io-client';
import styles from './styles';

/************************************* SOCKET IO******************************************/ 

// let socket = io('https://localhost:4443/');
let socket = io('https://react-native-webrtc.herokuapp.com', {transports: ['websocket']});

let RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection || window.msRTCPeerConnection;
let RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription || window.msRTCSessionDescription;
navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia || navigator.msGetUserMedia;

var configuration = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]};
let localStream, remoteStream, container;
var pcPeers = {};

/************************************* SOCKET IO ******************************************/ 
let width = window.innerWidth;

class VideoFeed extends Component {
	constructor(props) {
		super(props);
		this.state = {
			localStreamURL: null,
			remoteStreamURL: null,
		}
	}

	componentWillMount() {
		container = this;

		socket.on('connect', (data) => {
		  console.log('connect');
		  this.getLocalStream();
		});

		socket.on('exchange', function(data){
		  console.log('exchange')
		  container.exchange(data);
		});

		socket.on('leave', function(socketId){
		  container.leave(socketId);
		});

		 // auto join room MoveKick
	}

	componentDidMount() {
		this.join('MoveKick');
	}

	logError(error, message) {
	  console.log(message + ': ', error);
	}

	// get local video stam from user and createObjectURL then attach that as the video source
	getLocalStream() {
	  navigator.getUserMedia({ "audio": true, "video": true }, (stream) => {
	    localStream = stream;
	    this.setState({ localStreamURL: URL.createObjectURL(stream) });
	  }, this.logError);
	}

	// 
	join(roomID) {
	  socket.emit('join', roomID, (socketIds) =>{
	    console.log('join', socketIds);
	    for (var i in socketIds) {
	      var socketId = socketIds[i];
	      this.createPC(socketId, true);
	    }
	  });
	}

	createPC(socketId, isOffer) {
	  var pc = new RTCPeerConnection(configuration);
	  pcPeers[socketId] = pc;

	  pc.onicecandidate = function (event) {
	    console.log('onicecandidate', event);
	    if (event.candidate) {
	      socket.emit('exchange', {'to': socketId, 'candidate': event.candidate });
	    }
	  };

	  function createOffer() {
	    pc.createOffer(function(desc) {
	      console.log('createOffer', desc);
	      pc.setLocalDescription(desc, function () {
	        console.log('setLocalDescription', pc.localDescription);
	        socket.emit('exchange', {'to': socketId, 'sdp': pc.localDescription });
	      }, container.logError);
	    }, container.logError);
	  }

	  pc.onnegotiationneeded = function () {
	    console.log('onnegotiationneeded');
	    if (isOffer) {
	      createOffer();
	    }
	  }

	  pc.oniceconnectionstatechange = function(event) {
	    console.log('oniceconnectionstatechange', event);
	    if (event.target.iceConnectionState === 'connected') {
	      createDataChannel();
	    }
	  };
	  pc.onsignalingstatechange = function(event) {
	    console.log('onsignalingstatechange', event);
	  };

	  pc.onaddstream = function (event) {
	    console.log('onaddstream', event);
	    let remoteStreamURL = URL.createObjectURL(event.stream);
	    container.setState({ remoteStreamURL });
	  };

	  pc.addStream(localStream);
	  
	  function createDataChannel() {
	    if (pc.textDataChannel) {
	      return;
	    }
	    var dataChannel = pc.createDataChannel("text");

	    dataChannel.onerror = function (error) {
	      console.log("dataChannel.onerror", error);
	    };

	    dataChannel.onmessage = function (event) {
	      console.log("dataChannel.onmessage:", event.data);
	      if (event.data === 'capture') {
	      	container.props.setPhotoState(true);
	      }
	    };

	    dataChannel.onopen = function () {
	      console.log('dataChannel.onopen');
	    };

	    dataChannel.onclose = function () {
	      console.log("dataChannel.onclose");
	    };

	    pc.textDataChannel = dataChannel;
	  }

	  return pc;
	}

	// handle data exchange
	exchange(data) {
	  var fromId = data.from;
	  var pc;
	  if (fromId in pcPeers) {
	    pc = pcPeers[fromId];
	  } else {
	    pc = this.createPC(fromId, false);
	  }

	  if (data.sdp) {
	    console.log('exchange sdp', data);
	    pc.setRemoteDescription(new RTCSessionDescription(data.sdp), function () {
	      if (pc.remoteDescription.type == "offer")
	        pc.createAnswer(function(desc) {
	          console.log('createAnswer', desc);
	          pc.setLocalDescription(desc, function () {
	            console.log('setLocalDescription', pc.localDescription);
	            socket.emit('exchange', {'to': fromId, 'sdp': pc.localDescription });
	          }, container.logError);
	        }, container.logError);
	    }, container.logError);
	  } else {
	    console.log('exchange candidate', data);
	    pc.addIceCandidate(new RTCIceCandidate(data.candidate));
	  }
	}

	leave(socketId) {
	  console.log('leave', socketId);
	  var pc = pcPeers[socketId];
	  pc.close();
	  delete pcPeers[socketId];
	}

	render() {
	    return (
	    		<div style={styles.videoFeed}>
			        <ReactPlayer playing
			        	style={styles.localStream}
			        	url={this.state.localStreamURL}
			        	width={200}
			        	height={150} />

			 
			        <ReactPlayer playing
			        	ref={stream => stream && this.props.setRemoteStream(stream)}
			        	style={styles.remoteStream}  
			        	url={this.state.remoteStreamURL}
			        	width={375}
			        	height={667} />
			    </div>

	    );
	}
}

export default VideoFeed
