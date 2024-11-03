const userController = require("../controllers/user");
const router = require("express").Router();

router.post("/register", userController.register);
router.get("/", userController.getAllUsers);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.post("/login", userController.login);

module.exports = router;
