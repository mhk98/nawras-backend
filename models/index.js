const db = require("../db/db");
const { DataTypes } = require("sequelize");

db.user = require("../app/modules/user/user.model")(db.sequelize, DataTypes);
db.service = require("../app/modules/service/service.model")(
  db.sequelize,
  DataTypes,
);
db.blog = require("../app/modules/blog/blog.model")(db.sequelize, DataTypes);

// Do not use `alter: true` here. Sequelize's MySQL alter synchronizer can
// recreate the same unique indexes on every restart until MySQL reaches its
// 64-index-per-table limit. Use migrations for schema changes instead.
db.ready = db.sequelize.sync();

module.exports = db;
