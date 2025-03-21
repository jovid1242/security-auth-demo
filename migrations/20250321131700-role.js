const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const Role = sequelize.define("Role", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,  
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE
});

module.exports = Role;
