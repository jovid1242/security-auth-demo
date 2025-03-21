module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      phone: {
        type: Sequelize.STRING,
        unique: true
      },
      bio: Sequelize.TEXT,
      avatar: Sequelize.STRING,
      gender: Sequelize.STRING,
      dob: Sequelize.DATE,
      device_id: Sequelize.STRING,
      status: {
        type: Sequelize.ENUM("online", "offline"),
        defaultValue: "offline"
      },
      last_seen: Sequelize.DATE,
      is_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }, 
      private_key: Sequelize.TEXT,
      public_key: Sequelize.TEXT,
      roleId: {
        type: Sequelize.UUID,
        defaultValue: false,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Users");
  }
};
