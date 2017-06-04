import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

const config = {
	apiKey: "AIzaSyAGOlPQFuUPgQoAEDIDb3mQCBexHgReGN0",
	authDomain: "abraxas-time-tracker.firebaseapp.com",
	databaseURL: "https://abraxas-time-tracker.firebaseio.com",
	projectId: "abraxas-time-tracker",
	storageBucket: "abraxas-time-tracker.appspot.com",
	messagingSenderId: "633854708046"
}

firebase.initializeApp(config)

export default firebase

