import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
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
			route: 'signin',
			isSignedIn: false,
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

	onRouteChange = (route) => {
		// more elegant solution than example
		this.setState({isSignedIn: (route === 'home')});
		// if (route === 'signin') {
		// 	this.setState({isSignedIn: false});
		// } else if (route === 'home') {
		// 	this.setState({isSignedIn: true});
		// }
		this.setState({route: route});
	}

	render() {
		const { isSignedIn, imageUrl, route, box } = this.state;
		return (
			<div className="App">
				<Particles
					className='particles'
					params={particlesOptions}
				/>
		  		<Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
		  		{ route === 'home'
					? <div>
			  			<Logo />
				  		<Rank />
				  		<ImageLinkForm
				  			onInputChange={this.onInputChange}
				  			onButtonSubmit={this.onButtonSubmit}
				  		/>
				  		<FaceRecognition box={box} imageUrl={imageUrl} />
				  	</div>
			  		: (
			  			route === 'signin' || route === 'signout' // added signout to account for 4th route
			  			? <SignIn onRouteChange={this.onRouteChange} />
			  			: <Register onRouteChange={this.onRouteChange} />
			  		  )
		  		}
		 	</div>
		);
	}
}

export default App;