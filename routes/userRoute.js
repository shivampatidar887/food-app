const express = require("express");
const { resisterUser, loginUser, logoutUser, forgotPassword, resetPassword, getUserdetails, updatePassword, updateProfile, getAllusers, getsingleuserDetail,getUserdetailstoken, updateuserRole, deleteuser } = require("../controllers/userController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");


const router= express.Router();

router.route("/register").post(resisterUser);
router.route("/login").post(loginUser);
router.route("/user/:token").get(getUserdetailstoken);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/logout").post(logoutUser);
router.route("/me").get(isAuthenticatedUser,getUserdetails);
router.route("/password/update").put(isAuthenticatedUser,updatePassword);
router.route("/me/update").put(isAuthenticatedUser,updateProfile);
router.route("/admin/users").get(isAuthenticatedUser,authorizeRoles('admin'),getAllusers);
router.route("/admin/user/:id").get(isAuthenticatedUser,authorizeRoles('admin'),getsingleuserDetail).put(isAuthenticatedUser,authorizeRoles('admin'),updateuserRole).delete(isAuthenticatedUser,authorizeRoles('admin'),deleteuser);
 router.route("/admin/user/:id").get(getsingleuserDetail).put(isAuthenticatedUser,authorizeRoles('admin'),updateuserRole).delete(isAuthenticatedUser,authorizeRoles('admin'),deleteuser);


module.exports = router;