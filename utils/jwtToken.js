// create a token and saveing in cookie

const sendToken = (user,statusCode,res)=>{
    const jwt=user.getJWTToken();
    // ortion for cookie
    const option={
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE *24*60*60*1000
        ),
        httpOnly:true,
    };

    res.status(statusCode).cookie("token",jwt,option).json({
        success:true,
        user,
        jwt,
    })
};
module.exports = sendToken;