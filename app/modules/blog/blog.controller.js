const db = require("../../../models");

const sendSuccess = (res, data, message = "Success", statusCode = 200) =>
  res.status(statusCode).json({ status: "success", message, data });

const makeSlug = (value = "") =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const normalizePayload = (body) => ({
  ...body,
  slug: makeSlug(body.slug || body.title),
  keywords: Array.isArray(body.keywords)
    ? body.keywords
    : String(body.keywords || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
  publishedAt:
    body.publishedAt || body.status === "published" ? body.publishedAt || new Date() : null,
});

const getBlogs = async (req, res, next) => {
  try {
    const where = req.query.all === "true" ? {} : { status: "published" };
    const blogs = await db.blog.findAll({ where, order: [["createdAt", "DESC"]] });
    sendSuccess(res, blogs);
  } catch (error) {
    next(error);
  }
};

const getBlog = async (req, res, next) => {
  try {
    const blog = await db.blog.findOne({ where: { slug: req.params.slug } });
    if (!blog) {
      return res.status(404).json({ status: "error", message: "Blog not found" });
    }
    sendSuccess(res, blog);
  } catch (error) {
    next(error);
  }
};

const createBlog = async (req, res, next) => {
  try {
    if (!req.body.title || !req.body.content) {
      return res
        .status(400)
        .json({ status: "error", message: "Title and content are required" });
    }
    const blog = await db.blog.create(normalizePayload(req.body));
    sendSuccess(res, blog, "Blog created", 201);
  } catch (error) {
    next(error);
  }
};

const updateBlog = async (req, res, next) => {
  try {
    const blog = await db.blog.findByPk(req.params.id);
    if (!blog) {
      return res.status(404).json({ status: "error", message: "Blog not found" });
    }
    await blog.update(normalizePayload({ ...blog.toJSON(), ...req.body }));
    sendSuccess(res, blog, "Blog updated");
  } catch (error) {
    next(error);
  }
};

const deleteBlog = async (req, res, next) => {
  try {
    const deleted = await db.blog.destroy({ where: { id: req.params.id } });
    if (!deleted) {
      return res.status(404).json({ status: "error", message: "Blog not found" });
    }
    sendSuccess(res, null, "Blog deleted");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
};
