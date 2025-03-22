module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      unique: true
    },
    bio: DataTypes.TEXT,
    avatar: DataTypes.STRING,
    device_id: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM("online", "offline"),
      defaultValue: "offline"
    },
    last_seen: DataTypes.DATE,
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    private_key: DataTypes.TEXT,
    public_key: DataTypes.TEXT,
    roleId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    gender: DataTypes.STRING,
    dob: DataTypes.DATE,
  });

  User.associate = (models) => {
    User.belongsTo(models.Role, { foreignKey: "roleId", onDelete: "SET NULL" });  
  };

  return User;
};
