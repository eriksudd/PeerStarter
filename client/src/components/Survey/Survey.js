import React, { Component } from 'react';
import VideoFeed from '../VideoFeed/VideoFeed';
import NavigationBar from '../NavigationBar/NavigationBar'
import ImageCropper from '../ImageCropper/ImageCropper';
import util from './../../../util/util';
import PhotoInventory from '../PhotoInventory/PhotoInventory';
import HorizontalStepper from '../HorizontalStepper/HorizontalStepper';


let remoteStream;

class Survey extends Component {
	constructor(props) {
		super(props)

		this.state = {
			clarifaiToken: null,
			takePhoto: false
		}
	}

	componentWillMount() {
		this.setClarifaiToken()
	}

	setClarifaiToken() {
		util.getClarifaiToken().then(clarifaiToken => this.setState({ clarifaiToken }))
	}

	getRemoteStream() {
		return remoteStream;
	}

	getToken() {
		return this.state.token;
	}

	setPhotoState(boolean) {
		this.setState({ takePhoto: boolean })
	}



	render() {
		return (
			<div className='row'>

	    		<div className='col-md-6'>
					<VideoFeed 
						setRemoteStream={(stream) => remoteStream = stream } 
						setPhotoState={this.setPhotoState.bind(this)}/>	

					<hr />	

					<PhotoInventory />			
				</div>

				<div className='col-md-6'>
					<HorizontalStepper />

					<ImageCropper 
						getRemoteStream={this.getRemoteStream.bind(this)}
						getToken={this.getToken.bind(this)}
						takePhoto={this.state.takePhoto}
						setPhotoState={this.setPhotoState.bind(this)}/>
				</div>
			</div>
		)
		
	}
}

export default Survey