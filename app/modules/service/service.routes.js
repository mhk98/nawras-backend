const express = require("express");
const controller = require("./service.controller");

const router = express.Router();

router.get("/", controller.getServices);
router.get("/:slug", controller.getService);
router.post("/", controller.createService);
router.patch("/:id", controller.updateService);
router.delete("/:id", controller.deleteService);

module.exports = router;
