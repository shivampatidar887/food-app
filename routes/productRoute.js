const express = require("express");
const { getAllProducts,createProduct,updateProduct, deleteProduct, getProductDetails } = require("../controllers/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");


const router= express.Router();

router.route("/products").get(getAllProducts);
router.route("/product/:id").get(getProductDetails);
router.route("/admin/product/new").post(isAuthenticatedUser, authorizeRoles("admin") ,createProduct);
router.route("/admin/product/:id").put(isAuthenticatedUser,updateProduct).delete(isAuthenticatedUser,deleteProduct);
module.exports = router