import React, { Component } from 'react';
import styles from './styles';
import Cropper from 'cropperjs';
import util from './../../../util/util';

let cropper;

class ImageCropper extends Component {
	constructor(props) {
		super(props);
	}

	captureImage(event) {
	  var canvas = this.refs.canvas;
	  var remoteStream = this.props.getRemoteStream();
	  var video = remoteStream.player.player;

	  canvas.width = remoteStream.props.width;
	  canvas.height = remoteStream.props.height;
	  canvas.getContext('2d').drawImage(video, 0, 0, 375, 667);

	  cropper = new Cropper(canvas);
	}

	cropAndSend() {
	  let image = cropper.getCroppedCanvas().toDataURL('image/jpeg');
	  let base64Image = image.replace(/^data:image\/(jpeg|png|jpg);base64,/, "").toString('base64')
	  util.postImageToClarifai(base64Image, this.props.getToken())
	  this.props.setPhotoState(false);
	}

	render() {
		console.log(this.props.takePhoto)
		{this.props.takePhoto && this.captureImage() }
		return (
			<div>
			    <div className='img-container' style={styles.imageContainer}>
					<canvas 
						ref='canvas'
						className='col-md-4'></canvas>
				</div>
				<button onClick={this.captureImage.bind(this)}>Take Photo</button>
				<button onClick={this.cropAndSend.bind(this)}>Send Cropped Photo</button>
			</div>
		)
	}
}

export default ImageCropper;