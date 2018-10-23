import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import './App.css';

const app = new Clarifai.App({
 apiKey: '7e59c084dc4b4f35bfeaf4df34cb3755'
});

const particlesOptions = {
	particles: {
		number: {
			value: 80,
			density: {
				enable: true,
				value_area: 800
			}
		}
	}
}

class App extends Component {
	constructor() {
		super();
		this.state = {
			input: '',
			imageUrl: '',
			box: {},
		}
	}

	calculateFaceLocation = (data) => {
		const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
		const image = document.getElementById('inputImage');
		const width = Number(image.width);
		const height = Number(image.height);
		return {
			leftCol: clarifaiFace.left_col * width, /*starting position on left*/
			topRow: clarifaiFace.top_row * height, /*starting position on top*/
			rightCol: width - (clarifaiFace.right_col * width), //left over
			bottomRow: height - (clarifaiFace.bottom_row * height), //left over
		}
	}

	displayFaceBox = (box) => {
		console.log(box);
		this.setState({box: box});
	}
	onInputChange = (event) => {
		this.setState({input: event.target.value});
	}

	onButtonSubmit = () => {
		this.setState({imageUrl: this.state.input});
		app.models.predict(
			Clarifai.FACE_DETECT_MODEL,
			this.state.input)
		.then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
		.catch(err => console.log(err));
	}

	render() {
	return (
		<div className="App">
			<Particles
				className='particles'
				params={particlesOptions}
			/>
	  		<Navigation />
	  		<Logo />
	  		<Rank />
	  		<ImageLinkForm
	  			onInputChange={this.onInputChange}
	  			onButtonSubmit={this.onButtonSubmit}
	  		/>
	  		<FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
	 	</div>
	);
	}
}

export default App;