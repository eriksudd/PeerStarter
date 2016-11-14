import React, { Component } from 'react';
import VideoFeed from '../VideoFeed/VideoFeed';
import Cropper from '../Cropper/Cropper'

let remoteStream, imageCanvas;

class Survey extends Component {
	constructor(props) {
		super(props)

		this.state = {
			remoteStream: null,
			imageCanvas: null
		}
	}

	setRemoteStream(stream) {
		console.log('setting remote stream', stream)
		remoteStream = stream;
	}

	setImageCanvas(canvas) {
		console.log('setting imageCanvas', canvas)
		imageCanvas = canvas;
	}
	render() {
		return (
			<div>
				<div>Survey</div>
				<VideoFeed 
					setRemoteStream={this.setRemoteStream.bind(this)} />
				<Cropper 
					setImageCanvas={this.setImageCanvas.bind(this)} />
			</div>	
		)
		
	}
}

export default Survey