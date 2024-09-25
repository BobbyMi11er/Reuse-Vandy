import { initializeApp } from 'firebase/app';
import {FIREBASE_API_KEY, 
	FIREBASE_AUTH_DOMAIN, 
	FIREBASE_APP_ID, 
	FIREBASE_PROJECT_ID, 
	FIREBASE_STORAGE_BUCKET, 
	FIREBASE_MESSAGING_SENDER_ID} from "@env";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import 'firebase/auth';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
	// Insert secrets here
	apiKey: FIREBASE_API_KEY,
	authDomain: FIREBASE_AUTH_DOMAIN,
	projectId: FIREBASE_PROJECT_ID,
	storageBucket: FIREBASE_STORAGE_BUCKET,
	messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
	appId: FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };