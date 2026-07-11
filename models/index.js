const db = require("../db/db");
const { DataTypes } = require("sequelize");

db.user = require("../app/modules/user/user.model")(db.sequelize, DataTypes);
db.service = require("../app/modules/service/service.model")(
  db.sequelize,
  DataTypes,
);
db.blog = require("../app/modules/blog/blog.model")(db.sequelize, DataTypes);

db.ready = db.sequelize.sync({ alter: true });

module.exports = db;
