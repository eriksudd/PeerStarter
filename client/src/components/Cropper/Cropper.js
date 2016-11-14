import React, { Component } from 'react';
import styles from './styles';



class Cropper extends Component {
	render() {
		return (
			<div>
			    <div className='col-md-4 img-container' style={styles.imageContainer}>
					<canvas 
						ref={canvas => props.setImageCanvas(canvas)}
						className='col-md-4'></canvas>
				</div>
			</div>
		)
	}
}

export default Cropper;