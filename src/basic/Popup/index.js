import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Image, Animated, Dimensions, Alert } from 'react-native'

const WIDTH = Dimensions.get('screen').width
const HEIGHT = Dimensions.get('screen').height

class Popup extends Component {
	static popupInstance

	static show({ ...config }) {
		this.popupInstance.start(config)
	}

	static hide() {
		this.popupInstance.hidePopup()
	}

	state = {
		positionView: new Animated.Value(HEIGHT),
		opacity: new Animated.Value(0),
		positionPopup: new Animated.Value(HEIGHT),
		popupHeight: 0
	}

	start({ ...config }) {
		this.setState({
			title: config.title,
			type: config.type,
			icon: config.icon !== undefined ? config.icon : false,
			textBody: config.textBody,
			button: config.button !== undefined ? config.button : true,
			buttonText: config.buttonText || 'Ok',
			callback: config.callback !== undefined ? config.callback : this.defaultCallback(),

			snd_button: config.snd_button !== undefined ? config.snd_button : true,
			snd_buttonText: config.snd_buttonText || 'Ok',
			snd_callback: config.callback !== undefined ? config.snd_callback : this.defaultCallback(),

			dark: config.dark,

			action: config.action !== undefined ? config.action : null,

			latitude: config.latitude,
			longitude: config.longitude,
			collection: config.collection,
			


			background: 'rgba(0, 0, 0, 0.5)',
			timing: config.timing,
			autoClose: config.autoClose !== undefined ? config.autoClose : false
		})

		Animated.sequence([
			Animated.timing(this.state.positionView, {
				toValue: 0,
				duration: 100,
				useNativeDriver: false
			}),
			Animated.timing(this.state.opacity, {
				toValue: 1,
				duration: 300,
				useNativeDriver: false
			}),
			Animated.spring(this.state.positionPopup, {
				toValue: (HEIGHT / 2) - (this.state.popupHeight / 2),
				bounciness: 15,
				useNativeDriver: true
			})
		]).start()

		if (config.autoClose && config.timing !== 0) {
			const duration = config.timing > 0 ? config.timing : 5000
			setTimeout(() => {
				this.hidePopup()
			}, duration)
		}
	}

	hidePopup() {
		Animated.sequence([
			Animated.timing(this.state.positionPopup, {
				toValue: HEIGHT,
				duration: 250,
				useNativeDriver: true
			}),
			Animated.timing(this.state.opacity, {
				toValue: 0,
				duration: 300,
				useNativeDriver: false
			}),
			Animated.timing(this.state.positionView, {
				toValue: HEIGHT,
				duration: 100,
				useNativeDriver: false
			})
		]).start()
	}

	defaultCallback() {
		return Alert.alert(
			'Callback!',
			'Callback complete!',
			[
				{ text: 'Ok', onPress: () => this.hidePopup() }
			]
		)
	}

	handleImage(type) {
		switch (type) {
			case 'Success': return require('../../assets/Success.png')
			case 'Danger': return require('../../assets/Error.png')
			case 'Warning': return require('../../assets/Warning.png')
		}
	}

	render() {
		const { dark,title, type, textBody, button, buttonText, callback,snd_button, snd_buttonText, snd_callback, background , action, latitude, longitude, collection, button_color, snd_button_color} = this.state
		let el = null;
		if (this.state.button) {
			el = <>
			<TouchableOpacity style={[styles.Button, styles[type]]} onPress={() => action()}>
				<Text style={styles.TextButton}>{buttonText}</Text>
			</TouchableOpacity>
			<TouchableOpacity style={[styles.Button, styles[type]]} onPress={callback}>
				<Text style={styles.TextButton}>{snd_buttonText}</Text>
			</TouchableOpacity>
			</>
		}
		else {
			el = <Text></Text>
		}
		return (
			<Animated.View
				ref={c => this._root = c}
				style={[styles.Container, {
					backgroundColor: background || 'transparent',
					opacity: this.state.opacity,
					transform: [
						{ translateY: this.state.positionView }
					]
				}]}>
				<Animated.View
					onLayout={event => {
						this.setState({ popupHeight: event.nativeEvent.layout.height })
					}}
					style={[dark ? styles.Message_dark : styles.Message, {
						transform: [
							{ translateY: this.state.positionPopup }
						]
					}]}

				>
					<View style={{...styles.Header, backgroundColor: dark ? "rgb(23,32,42)" : '#b7e9f7' }} />
					{
						this.state.icon ? (this.state.icon) :
							<Image
								source={this.handleImage(type)}
								resizeMode="contain"
								style={styles.Image}
							/>
					}
					<View style={styles.Content}>
						<Text style={{...styles.Title, color: dark ? 'white' : 'black'}}>{title}</Text>

						<View style={{flexDirection: "column"}}>

							<View style={{flexDirection: "row"}}>
								<Text style={{...styles.Desc}}>latitude:</Text>
								<Text style={{...styles.Desc,fontWeight:"bold", color:"#666"}}>      {latitude}</Text>
							</View>

							<View style={{flexDirection: "row"}}>
								<Text style={{...styles.Desc}}>longitude:</Text>
								<Text style={{...styles.Desc,fontWeight:"bold", color:"#666"}}>   {longitude}</Text>
							</View>

							<View style={{flexDirection: "row"}}>
								<Text style={{...styles.Desc}}>collection:</Text>
								<Text style={{...styles.Desc,fontWeight:"bold",marginBottom:20, color:"#666"}}>   {collection}</Text>
							</View>
						</View>
						
						{el}
					</View>
				</Animated.View>
			</Animated.View>
		)
	}
}

const styles = StyleSheet.create({
	Container: {
		position: 'absolute',
		zIndex: 99999,
		width: WIDTH,
		height: HEIGHT,
		backgroundColor: '#fff',
		alignItems: 'center',
		top: -100,
		left: 0
	},
	Message: {
		maxWidth: 350,
		width: 300,
		minHeight: 400,
		backgroundColor: '#b7e9f7',
		borderRadius: 30,
		alignItems: 'center',
		overflow: 'hidden',
		position: 'absolute',
	},
	Message_dark: {
		maxWidth: 350,
		width: 300,
		minHeight: 400,
		backgroundColor: 'rgb(23,32,42)',
		borderRadius: 30,
		alignItems: 'center',
		overflow: 'hidden',
		position: 'absolute',
	},
	Content: {
		padding: 20,
		alignItems: 'center'
	},
	Header: {
		height: 300,
		width: 250,
		backgroundColor: '#b7e9f7',
		borderRadius: 100,
		marginTop: -120
	},
	Image: {
		width: 150,
		height: 80,
		position: 'absolute',
		top: 10
	},
	Title: {
		fontWeight: 'bold',
		fontSize: 26,
		color: '#fff',
		marginBottom:20
	},
	Desc: {
		//textAlign: 'center',
		
		color: '#666',
		marginTop: 10,
		//marginBottom:10
	},
	Button: {
		borderRadius: 50,
		height: 40,
		width: 130,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 10
	},
	TextButton: {
		color: '#fff',
		fontWeight: 'bold'
	},
	Success: {
		backgroundColor: 'rgb(27,164,220)',
		shadowColor: "#b7e9f7",
		shadowOffset: {
			width: 0,
			height: 5,
		},
		//shadowOpacity: 0.36,
		//shadowRadius: 2,
		elevation: 2
	},
	Danger: {
		backgroundColor: '#F29091',
		shadowColor: "#F29091",
		shadowOffset: {
			width: 0,
			height: 5,
		},
		shadowOpacity: 0.36,
		shadowRadius: 6.68,
		elevation: 11
	},
	Warning: {
		backgroundColor: '#fbd10d',
		shadowColor: "#fbd10d",
		shadowOffset: {
			width: 0,
			height: 5,
		},
		shadowOpacity: 0.36,
		shadowRadius: 6.68,
		elevation: 11
	}
})

export default Popup
