const mongoose  = require("mongoose");

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter product name"],
        trim:true,// for avoid leading and trailing whitespace
        maxLength:[30,"Name cannot exceed 30 characters"]
    },
    price:{
        type:Number,
        required:[true,"Please enter product Price"],
        min: [0, 'Price cannot be negative'],
        max: [800, 'Price cannot exceed 800']
    },
    image:{
        public_id:{
        type:String,
        required:true,
        },
        url:{
            type:String,
            required:true,
        },
    },
    category:{
        type:String,
        required:[true,"Please Enter the product category"],
    },
    stock:{
        type:Number,
        required: [true, "Please Enter product Stock"],
        min: [0, 'Stock cannot be negative'],
        max: [1000, 'Price cannot exceed 999'],
        default: 1,
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
});
module.exports = mongoose.model("Product",productSchema);
// export as a Product module