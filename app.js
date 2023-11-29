const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const errorMiddleware = require("./middleware/error")
const cors = require('cors');
const dotenv=require("dotenv");

// config
dotenv.config({path:"config/config.env"})

// Enable CORS for all routes
app.use(cors());

//for upload the images in cloudinary
app.use(express.json({
    limit: '3mb'
  }));
  
app.use(express.json())
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));
app.use(fileUpload());
app.use(express.json({limit:'50mb', extended: true}));
app.use(express.urlencoded({limit:'50mb',extended:true}));

// Route Imports
const product = require("./routes/productRoute");
const user = require("./routes/userRoute");
const order=require("./routes/orderRoute");
const payment=require("./routes/paymentRoute");

app.use("/api/v1",product);
app.use("/api/v1",user)
app.use("/api/v1",order);
app.use("/api/v1",payment);

// use middleware
app.use(errorMiddleware);
module.exports =  app