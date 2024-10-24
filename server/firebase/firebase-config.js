//firebase-config.js
// Description: Imports the Firebase configurations and uses it to initialize the Firebase SDK.
// Exports auth to be used in other files.

const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const dotenv = require("dotenv");

dotenv.config();

// const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
// if (!serviceAccountKey) {
//   throw new Error("Firebase service account key not provided");
// }

var serviceAccount = require("./serviceAccountKey.json")
if (!serviceAccount) {
  throw new Error("No service account key file found");
}

const app = initializeApp({
  credential: cert(serviceAccount),
});

const auth = getAuth(app);

module.exports = { auth };
