const express = require("express");
const UserRoutes = require("../modules/user/user.routes");
const ServiceRoutes = require("../modules/service/service.routes");
const BlogRoutes = require("../modules/blog/blog.routes");

const router = express.Router();

router.use("/users", UserRoutes);
router.use("/user", UserRoutes);
router.use("/services", ServiceRoutes);
router.use("/blogs", BlogRoutes);

module.exports = router;
