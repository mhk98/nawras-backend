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
  benefits: Array.isArray(body.benefits)
    ? body.benefits
    : String(body.benefits || "")
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
});

const getServices = async (req, res, next) => {
  try {
    const where = req.query.all === "true" ? {} : { status: "published" };
    const services = await db.service.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });
    sendSuccess(res, services);
  } catch (error) {
    next(error);
  }
};

const getService = async (req, res, next) => {
  try {
    const service = await db.service.findOne({ where: { slug: req.params.slug } });
    if (!service) {
      return res
        .status(404)
        .json({ status: "error", message: "Service not found" });
    }
    sendSuccess(res, service);
  } catch (error) {
    next(error);
  }
};

const createService = async (req, res, next) => {
  try {
    if (!req.body.title) {
      return res.status(400).json({ status: "error", message: "Title is required" });
    }
    const service = await db.service.create(normalizePayload(req.body));
    sendSuccess(res, service, "Service created", 201);
  } catch (error) {
    next(error);
  }
};

const updateService = async (req, res, next) => {
  try {
    const service = await db.service.findByPk(req.params.id);
    if (!service) {
      return res
        .status(404)
        .json({ status: "error", message: "Service not found" });
    }
    await service.update(normalizePayload({ ...service.toJSON(), ...req.body }));
    sendSuccess(res, service, "Service updated");
  } catch (error) {
    next(error);
  }
};

const deleteService = async (req, res, next) => {
  try {
    const deleted = await db.service.destroy({ where: { id: req.params.id } });
    if (!deleted) {
      return res
        .status(404)
        .json({ status: "error", message: "Service not found" });
    }
    sendSuccess(res, null, "Service deleted");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
};
