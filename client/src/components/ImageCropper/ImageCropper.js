import React, { Component } from 'react';
import styles from './styles';
import Cropper from 'cropperjs';
import util from './../../../util/util';

let cropper, container, remoteStream;

class ImageCropper extends Component {
	constructor(props) {
		super(props);
	}

	componentWillMount() {
		container = this;
	}

	componentWillRender() {
		this.props.getRemoteStream();
	}

	captureImage(event) {
	  console.log('calling capture image', container.props)
	  console.log('calling capture (this.props) image', this.props)

	  var canvas = this.refs.canvas;
	  var remoteStream = this.props.getRemoteStream();

	  console.log(this.props.getRemoteStream(), 'remoteStream from capture iamge');
	  

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
		{this.props.takePhoto && this.captureImage() }
		return (
			<div>
			    <div className='img-container' style={styles.imageContainer}>
					<canvas 
						ref='canvas'
						className='col-md-4'></canvas>
				</div>
				<button onClick={this.captureImage}>Take Photo</button>
				<button onClick={this.cropAndSend.bind(this)}>Send Cropped Photo</button>
			</div>
		)
	}
}

export default ImageCropper;