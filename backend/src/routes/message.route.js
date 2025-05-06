const router = require("express").Router();
const authMiddleware = require("../middleware/auth.middleware");
const messageController = require("../controllers/message.controller")

router.get("/users", authMiddleware.protectRoute, messageController.getUsersforSidebar);
router.get("/:id", authMiddleware.protectRoute, messageController.getMessages);
router.post("/send/:id", authMiddleware.protectRoute, messageController.sendMessage);

module.exports = router;