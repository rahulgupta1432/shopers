let { Sequelize, Model, DataTypes, Op, QueryTypes } = require("sequelize");
// let sequelizeCon = new Sequelize("mysql://root:@localhost/ecom");
let sequelizeCon = new Sequelize("mysql://root:root@localhost:3308/ecom");
sequelizeCon.authenticate().then().catch();
// sequelizeCon.sync({ alter: true });
module.exports = {
  sequelizeCon,
  Model,
  DataTypes,
  Op,
  QueryTypes,
};
