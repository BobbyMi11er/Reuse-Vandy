import { initializeApp, getApp } from "firebase/app";
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


// Your web app's Firebase configuration
const firebaseConfig = {
	// Insert secrets here
	apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
// initialize Firebase App
const app = initializeApp(firebaseConfig);
// initialize Firebase Auth for that app immediately
// @ts-ignore
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const getUserId = () => {
	const uid = auth.currentUser?.uid
    if (uid == undefined) {
      return null;
    }
    return uid;
};

const getToken = async () => {
	return await auth.currentUser?.getIdToken()
}

export { app, auth, getApp, getAuth, getUserId, getToken };