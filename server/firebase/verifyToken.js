//verifyToken.js
// Imports the Firebase auth
// Splits the authorization header ("Bearer <token>")
// into an array and takes the second element, which is the token
const { auth } = require("./firebase-config");

const verifyToken = async (req, _res, next) => {
  try {
    // don't check token if just looking to see if api is working
    if (req?.originalUrl == "/") {
      next();
    }
    else {
      const token = req?.headers?.authorization?.split(" ")[1];
      // console.log(req.originalUrl)

      if (!token) {
        throw new Error("Token not found");
      }

      // Verifies the token and decodes it to get associated user data
      // and stores it in req.body.user to be accessed by other routes
      const decodeValue = await auth.verifyIdToken(token);

      if (!decodeValue) {
        throw new Error("Token verification failed");
      }

      req.body.user = decodeValue;
      next();
    }
    
  } catch (e) {
    next(e); // Pass the error to Express error-handling middleware
  }
};

module.exports = { verifyToken };
