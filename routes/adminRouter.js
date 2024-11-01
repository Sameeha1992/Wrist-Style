const express = require("express");
const router=express.Router();
const adminController=require("../controllers/admin/adminController");
const customerController=require("../controllers/admin/customerController")
const categoryController = require("../controllers/admin/categoryController");
const brandController = require("../controllers/admin/brandController")
const {userAuth,adminAuth} = require("../middlewares/auth");
const multer = require("multer");
const storage = require("../helpers/multer");
const uploads = multer({storage:storage});


router.get("/pageerror",adminController.pageerror);
//Login Management
router.get("/login",adminController.loadLogin);

router.post("/login",adminController.login);

router.get("/",adminAuth,adminController.loadDashboard)

router.get("/logout",adminController.logout);

//Customer Management

router.get("/users",adminAuth,customerController.customerInfo)
router.get("/blockCustomer",adminAuth,customerController.customerBlocked)
router.get("/unblockCustomer",adminAuth,customerController.customerUnblocked)

//Category Management

router.get("/category",adminAuth,categoryController.categoryInfo)
router.post("/addCategory",categoryController.addCategory);
router.post("/addCategoryOffer",adminAuth,categoryController.addCategoryOffer);
router.post("/removeCategoryOffer",adminAuth,categoryController.removeCategoryOffer);
router.get("/listCategory",adminAuth,categoryController.getListCategory);
router.get("/unlistCategory",adminAuth,categoryController.getUnlistCategory);
router.get("/editCategory",adminAuth,categoryController.getEditCategory);
router.post("/editCategory/:id",adminAuth,categoryController.editCategory);

//Brand Management

router.get("/brands",adminAuth,brandController.getBrandPage);
router.post("/addBrand",adminAuth,uploads.single("image"),brandController.addBrand);



module.exports=router;
