module.exports = router => {

    var authController = require('../controllers/auth/auth.controller');
    var verifyToken = require('../controllers/auth/verifyToken');

    var productController = require('../controllers/product/product.controller');
    var customerController = require('../controllers/customer/customer.controller');
    var orderController = require('../controllers/order/order.controller');
    var promoController = require('../controllers/promo/promo.controller');
    var storeController = require('../controllers/store/store.controller');


    router.post("/sign-in", authController.validate('signIn'), authController.signIn);
    router.post("/sign-up", authController.validate('signUp'), authController.signUp);
    router.post("/validate-cred", authController.validate('validateCred'), authController.validateCred);
    router.post("/subscription-form", authController.validate('subscriptionForm'), authController.subscriptionForm);
    router.post("/sign-out", verifyToken, authController.signOut);
    router.post("/forgot-password", authController.validate('forgotPassword'), authController.forgotPassword);
    router.post("/reset-password", authController.validate('resetPassword'), authController.resetPassword);

    router.get("/product", verifyToken, productController.index);
    router.post("/product/add", verifyToken, productController.validate('add'), productController.add);
    router.put("/product/update", verifyToken, productController.validate('update'), productController.update);
    router.get("/product/details", verifyToken, productController.validate('details'), productController.details);
    router.put("/product/delete", verifyToken, productController.validate('delete'), productController.delete);
    router.get("/product/generate-code", verifyToken, productController.generateCode);
    
    router.get("/store/profile", verifyToken, storeController.profile);
    router.put("/store/profile/deactivate", verifyToken, storeController.deactivate);
    router.put("/store/profile/activate", verifyToken, storeController.activate);
    router.put("/store/profile/permanently-delete", verifyToken, storeController.permanentlyDelete);
    router.put("/store/profile/update", verifyToken, storeController.validate('update'), storeController.update);
    
    router.get("/promo", verifyToken, promoController.index);
    router.post("/promo/add", promoController.validate('add'), verifyToken, promoController.add);
    router.put("/promo/update", promoController.validate('update'), verifyToken, promoController.update);
    router.put("/promo/delete", promoController.validate('delete'), verifyToken, promoController.delete);
    
    router.get("/customer", verifyToken, customerController.index);
    router.post("/customer/ban", verifyToken, customerController.validate('ban'), customerController.ban);
    
    router.get("/order", verifyToken, orderController.index);
    router.post("/order/transaction", verifyToken, orderController.validate('transaction'), orderController.transaction);
    router.put("/order/cancel", verifyToken, orderController.validate('cancel'), orderController.cancel);
    router.put("/order/process", verifyToken, orderController.validate('process'), orderController.process);

    // Public
    const publicController = require("../controllers/storage/publicController");
    router.post("/upload-file", publicController.uploadFile);
    
};
    