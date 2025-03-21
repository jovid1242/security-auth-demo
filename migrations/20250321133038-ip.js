module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("IPs", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      ip_address: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true, 
      },
      country: {
        type: Sequelize.STRING,
        allowNull: true, 
      },
      is_blocked: {
        type: Sequelize.BOOLEAN,
        defaultValue: false, 
      }, 
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("IPs");
  },
};
