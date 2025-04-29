const router = require('express').Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/updateProfile", authController.updateProfile);

router.get("/test", authMiddleware.protectRoute, (req, res) => {
    res.send('ok');
})

module.exports = router;
