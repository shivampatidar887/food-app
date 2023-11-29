const Product = require("../models/productModel");
const errorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const cloudinary = require("cloudinary");
// Create new Product
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
    const myCloud = await cloudinary.v2.uploader.upload(req.body.image, {
      folder: "products",
      width: 150,
      crop: "scale"
    });
    req.body.user = req.user.id;
    // for the maker of the product
    req.body.image = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  
    try {
      const product = await Product.create(req.body);
      res.status(201).json({
        success: true,
        product,
      });
    } catch (err) {
      // Delete the uploaded image from Cloudinary
      await cloudinary.v2.uploader.destroy(myCloud.public_id);
  
      next(err);
    }
  });
// Get all Products
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
    const productsCount = await Product.countDocuments();
    const apiFeatures = new ApiFeatures(Product.find(), req.query);
    const products = await apiFeatures.query;
    res.status(200).json({
        success: true,
        products,
        productsCount,
    })
});
// Update Products
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(new errorHandler("Product Not FOund", 404));
    }
    if(!(req.body.image==='undefined')&&(req.body.image!=="")){
            const imageId=product.image.public_id;
            await cloudinary.v2.uploader.destroy(imageId);
            const myCloud=await cloudinary.v2.uploader.upload(req.body.image,{
                folder:"products",
                width:150,
                crop:"scale"
            });
            req.body.image = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
    }
    else{
        req.body.image=product.image;
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    res.status(200).json({
        success: true,
        product
    })
});

// Delete product 
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new errorHandler("Product Not FOund", 404));
    }
    //Delete Image from cloudinary
    await cloudinary.v2.uploader.destroy(product.image.public_id);
    
    await product.remove();
    res.status(200).json({
        success: true,
        message: "Product deleted Successfully"
    })
});

// Get single product details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new errorHandler("Product Not FOund", 404));
    }
    res.status(200).json({
        success: true,
        product
    })
});