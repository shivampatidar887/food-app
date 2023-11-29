const Order = require("../models/orderModel");
const Product= require("../models/productModel");
const errorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { off } = require("../models/orderModel");

// Create new order
exports.newOrder = catchAsyncErrors(async (req,res,next)=>{
const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
} = req.body;
const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt:Date.now(),
    user:req.user._id,
});
res.status(201).json({
    success:true,
    order,
})
});
// get single order by id (admin)
exports.singleOrderdetails = catchAsyncErrors(async (req,res,next)=>{
   const order = await Order.findById(req.params.id).populate("user","name email");
   if(!order){
    return next(new errorHandler("No order Found with this id",404));
   }
    res.status(200).json({
        success:true,
        order,
    })
});
// get my orders
exports.myOrders = catchAsyncErrors(async (req,res,next)=>{
    const orders = await Order.find({user:req.user._id});
    
     res.status(200).json({
         success:true,  
         orders,
     })
 });
// get all orders and ammount
exports.allOrders = catchAsyncErrors(async (req,res,next)=>{
    const orders = await Order.find();
    let totalAmmount = 0;
    orders.forEach(order=>{
        totalAmmount+=order.totalPrice
    })
     res.status(200).json({
         success:true,  
         orders,
         totalAmmount,
     })
 });
// update order status
exports.updateOrder = catchAsyncErrors( async (req,res,next)=>{
    const order = await Order.findById(req.params.id);
    
    if(!order){
        return next(new errorHandler("No order Found with this id",404));
    };
    if(order.orderStatus==="Delivered"){
     return next (new errorHandler("WE have Already delivered this order",400));
    }
    if(req.body.status==="Shipped"){
    order.orderItems.forEach(async (ele)=>{
        //await updateStock(order.Product,order.quantity);
        const product= await Product.findById(ele.product);
        product.stock-=ele.quantity;
        await product.save({validateBeforeSave:false});
    });}

    order.orderStatus = req.body.status;
    if(req.body.status==="Delivered"){
        order.deliveredAt=Date.now();
    }
    await order.save({validateBeforeSave:false});
     res.status(200).json({
         success:true,  
         message:"Status updated!"
     })
 });
 // delete order admin
 exports.deleteOrder = catchAsyncErrors(async(req,res,next)=>{
    const order = await Order.findById(req.params.id);
    if(!order){
        return next(new errorHandler("No order Found with this id",404));
       };
       order.remove();
       res.status(200).json({
        success:true,  
        message:"order deleted successfully!"
    })
 });