//firebase-config.ts
// Description: Imports the Firebase configurations and uses it to initialize the Firebase SDK.
// Exports auth to be used in other files.

import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import dotenv from "dotenv";

dotenv.config();

const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
if (!serviceAccountKey) {
  throw new Error("Firebase service account key not provided");
}

const app = initializeApp({
  credential: cert(JSON.parse(serviceAccountKey)),
});

const auth = getAuth(app);

export { auth };