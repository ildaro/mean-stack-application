const jwt = require("jsonwebtoken");

//a middleware is just a function so we export a function
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; //get token from incoming req in the header
    const decodedToken = jwt.verify(token, process.env.JWT_KEY); // verify the token using the signature from when token was created
    req.userData = { email: decodedToken.email, userId: decodedToken.userId };
    next();
  } catch(error) {
    res.status(401).json({
      message: "You are not authenticated"
    });
  }
};
