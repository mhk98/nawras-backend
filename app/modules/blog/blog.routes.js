const express = require("express");
const controller = require("./blog.controller");

const router = express.Router();

router.get("/", controller.getBlogs);
router.get("/:slug", controller.getBlog);
router.post("/", controller.createBlog);
router.patch("/:id", controller.updateBlog);
router.delete("/:id", controller.deleteBlog);

module.exports = router;
