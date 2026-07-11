const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../../../models");

const publicUserFields = ["id", "name", "email", "role", "status", "createdAt"];

const sendSuccess = (res, data, message = "Success", statusCode = 200) =>
  res.status(statusCode).json({ status: "success", message, data });

const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role = "user", status = "active" } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Name, email, and password are required",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.user.create({
      name,
      email,
      password: hashedPassword,
      role,
      status,
    });
    const payload = publicUserFields.reduce((acc, field) => {
      acc[field] = user[field];
      return acc;
    }, {});
    sendSuccess(res, payload, "User created", 201);
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await db.user.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password || "", user.password))) {
      return res
        .status(401)
        .json({ status: "error", message: "Invalid email or password" });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.TOKEN_SECRET || process.env.JWT_SECRET || "nawras-dev-secret",
      { expiresIn: "7d" },
    );
    sendSuccess(res, {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await db.user.findAll({
      attributes: publicUserFields,
      order: [["createdAt", "DESC"]],
    });
    sendSuccess(res, users);
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await db.user.findByPk(req.params.id, {
      attributes: publicUserFields,
    });
    if (!user) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }
    sendSuccess(res, user);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await db.user.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }
    const updates = { ...req.body };
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    await user.update(updates);
    sendSuccess(res, {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const deleted = await db.user.destroy({ where: { id: req.params.id } });
    if (!deleted) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }
    sendSuccess(res, null, "User deleted");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  loginUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
