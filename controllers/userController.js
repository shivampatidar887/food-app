const User= require("../models/userModel");
const errorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");
const jwtDecode = require("jwt-decode");
// resinster a user 
exports.resisterUser = catchAsyncErrors(async(req,res,next)=>{
    const myCloud=await cloudinary.v2.uploader.upload(req.body.avatar,{
        folder:"avatars",
        width:150,
        crop:"scale",
    });

   try {
     const {name,email,password} = req.body;
     const user= await User.create({
      name,email,password,
      avatar:{
           public_id:myCloud.public_id,
           url:myCloud.secure_url,
      },
     });
     sendToken(user,201,res);
   } catch (err) {
     // Delete the uploaded avatar image from Cloudinary
     await cloudinary.v2.uploader.destroy(myCloud.public_id);

     next(err);
   }
});

// Login user 
exports.loginUser = catchAsyncErrors(async(req,res,next)=>{
    const {email,password} = req.body;
    if(!email || !password){
        return next(new errorHandler("Please Enter Email and Password",400) );
    }
    const user= await User.findOne({email}).select("+password");
    if(!user){
        return next(new errorHandler("Invalid Email and Password",401) );
    }
    const isPasswordmatched = await user.comparePassword(password);
    if(!isPasswordmatched){
        return next(new errorHandler("Invalid Email and Password",401) );
    }
   sendToken(user,200,res);
})

// Log out
exports.logoutUser = catchAsyncErrors(async(req,res,next)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true,
    });
    res.status(200).json({
        succes:true,
        message:"Log out successfully",
    })
});
// get user details by token
exports.getUserdetailstoken = catchAsyncErrors(async(req,res,next)=>{
    const decodedtoken=jwtDecode(req.params.token);
    const user = await User.findById(decodedtoken.id);
    res.status(200).json({
        success:true,
        user,
    })
});
// Get reset Password token
exports.forgotPassword = catchAsyncErrors(async (req,res,next)=>{
    const user = await User.findOne({email:req.body.email});
    if(!user){
        return next(new errorHandler("User not Found",404));

    }

    
    const resetToken = user.getresetPasswordToken();
    
    await user.save({validateBeforeSave:false});
    const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
    const message = `Your password token is:- \n\n ${resetPasswordUrl} \n
    in case if you are not request for it, Please Ignore!`;
    try{
   await sendEmail({
    email:user.email,
    subject:"F9-Food Password recovery",
    message,
   });
   res.status(200).json({
    success:true,
    message: `Email sent to ${user.email} Successfully!`,
   })
    }catch{
        
        user.resetPasswordToken= undefined;
        user.resetPasswordExpire= undefined;
        await user.save({validateBeforeSave:false});
        
    }
});
// reset password with token
exports.resetPassword =  catchAsyncErrors(async (req,res,next)=>{
    
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    
     const user = await User.findOne({resetPasswordToken,resetPasswordExpire:{$gt:Date.now()},});
     if(!user){
        return next(new errorHandler("Reset Password token is invalid or has been expired",404));
    }
     if(req.body.password!==req.body.confirmPassword){
        return next(new errorHandler("Password does not match, Please rewrite carefully!",404));
     }
     user.password = req.body.password;
     user.resetPasswordToken= undefined;
     user.resetPasswordExpire= undefined;
     await user.save();

    //  sendToken(user,200,res);   // login user after change the password
    res.status(200).json({
        success:true,
        message:"Password Reset Successfully",
    })
});

// get login user details
exports.getUserdetails = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success:true,
        user,
    })
});

// update user Passoword
exports.updatePassword = catchAsyncErrors(async (req,res,next)=>{
    const user = await User.findById(req.user.id).select("+password");
    const isPasswordmatched = await user.comparePassword(req.body.oldPassword);
    if(!isPasswordmatched){
        return next(new errorHandler("Old password is not correct",400) );
    }
    if(req.body.newPassword!==req.body.confirmPassword){
        return next(new errorHandler("Passwords dose not matched ! enter carefully",400) );
    }
    user.password = req.body.newPassword;
    await user.save();
    sendToken(user,200,res);
})
// update user Profile
exports.updateProfile = catchAsyncErrors(async (req,res,next)=>{
    const newUserData = {
        name:req.body.name,
        email:req.body.email,
    }
    if(!(req.body.avatar==='undefined')){
    if(req.body.avatar!==""){
        
        const user=await User.findById(req.user.id);
        const imageId=user.avatar.public_id;
    
        await cloudinary.v2.uploader.destroy(imageId);
        
        const myCloud=await cloudinary.v2.uploader.upload(req.body.avatar,{
            folder:"avatars",
            width:150,
            crop:"scale"
        });
        
        newUserData.avatar={
            public_id:myCloud.public_id,
            url:myCloud.secure_url,
        };
    }
}
   const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
    new:true,
    runValidators:true,
    useFindAndModify:false,
   });

    res.status(200).json({
        success:true,
        message:"profile update successfully",
    })
});
// Get all users (admin)
exports.getAllusers = catchAsyncErrors(async(req,res,next)=>{
    const users = await User.find();
    res.status(200).json({
        success:true,
        users,
    })
});
// Get Single user (admin)
exports.getsingleuserDetail = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new errorHandler(`User dose not exist with id: ${req.params.id}`,404));
    }
    res.status(200).json({
        success:true,
        user,
    })
});
// update user Role (admin)
exports.updateuserRole = catchAsyncErrors(async (req,res,next)=>{
    const newuserData = {
        name:req.body.name,
        email:req.body.email,
        role:req.body.role,
    }
   const user = await User.findByIdAndUpdate(req.params.id,newuserData,{
    new:true,
    runValidators:true,
    useFindAndModify:false,
   });
    res.status(200).json({
        success:true,
        message:`User ${req.params.id} Role updated successfully`,
    })
});
//delete a user (admin)
exports.deleteuser = catchAsyncErrors(async (req,res,next)=>{
 
const user = await User.findById(req.params.id);
if(!user){
    return next(new errorHandler(`User dose not exist with id: ${req.params.id}`,404));
}
   const imageId=user.avatar.public_id;
   await cloudinary.v2.uploader.destroy(imageId);
   await user.remove();
    res.status(200).json({
        success:true,
        message:`User ${req.params.id} deleted successfully`,
    })
});


