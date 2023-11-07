let { sequelizeCon, Model, DataTypes } = require("../init/dbconfig");
class User extends Model {}
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    contact: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    token:{
      type:DataTypes.STRING(500),
      allowNull:true
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
    tableName: "user",
    modelName: "User",
    sequelize: sequelizeCon,
  }
);

module.exports = {
  User,
};
