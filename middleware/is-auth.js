const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  //Check if there is an authorization header
  if(!authHeader){
    const error = new Error('Not authenticated');
    error.statusCode = 401;
    throw error;
  }
  //extract the token from an incoming request
  // We will add an 'Authorization' headers in the front-end to send the token in the requests
  const token = authHeader.split(' ')[1]; //Bearer[0], token[1]
  let decodedToken;
  try{
    //verifies the token is valid
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch(err){
    err.statusCode = 500;
    throw err;
  }
  if(!decodedToken){
    const error = new Error('Not authenticated');
    error.statusCode = 401;
    throw error;
  }
  req.userId = decodedToken.userId;
  next();
};