const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const errorHandler = require("../utils/errorhandler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
exports.isAuthenticatedUser = catchAsyncErrors(async (req,res,next)=>{
    
    let token;
    // Check for token in headers first
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // Extract token from authorization header
      token = req.headers.authorization.split(" ")[1];
    } 
    else if (req.cookies.token) {
      // Extract token from cookies
      token = req.cookies.token;
    }
    if(!token){
        return next(new errorHandler("Please login to access this resourcess",401));
    }
    const decodedData = jwt.verify(token,process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id);       // we use user id for create token with secret key
     next();
});
exports.authorizeRoles = (...roles) => {   // access role array
return (req,res,next) =>{
     
    if(!roles.includes(req.user.role)){
        return next(new errorHandler(`Role: ${req.user.role} is not allowed to access this resourcess`,403));
    };
    next();
}

}