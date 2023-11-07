let { sequelizeCon, Model, DataTypes } = require("../init/dbconfig");
class UserPermission extends Model {}

UserPermission.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    permission_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "userpermission",
    modelName: "Userpermission",
    sequelize: sequelizeCon,
  }
);

module.exports = {
  UserPermission,
};
