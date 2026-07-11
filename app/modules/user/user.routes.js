const express = require("express");
const controller = require("./user.controller");

const router = express.Router();

router.post("/register", controller.createUser);
router.post("/login", controller.loginUser);
router.get("/", controller.getUsers);
router.get("/:id", controller.getUser);
router.post("/", controller.createUser);
router.patch("/:id", controller.updateUser);
router.delete("/:id", controller.deleteUser);

module.exports = router;
