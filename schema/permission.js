let { sequelizeCon, Model, DataTypes } = require("../init/dbconfig");
class Permission extends Model {}
// sequelizeCon.sync({ alter: true });
Permission.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    tableName: "permission",
    modelName: "Permission",
    sequelize: sequelizeCon,
  }
);
module.exports = {
  Permission,
};
