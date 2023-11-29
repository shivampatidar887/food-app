class errorHandler extends Error{                         // errorhandler inharit the error
    constructor(message,statusCode){
        super(message);
        this.statusCode=statusCode,
        Error.captureStackTrace(this,this.constructor);
    }
}


module.exports = errorHandler;