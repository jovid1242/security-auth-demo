const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();
    await queryInterface.bulkInsert('Roles', [
      {
        id: uuidv4(),
        name: 'admin',
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        name: 'user',
        createdAt: now,
        updatedAt: now
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Roles', {
      name: ['admin', 'user']
    }, {});
  }
}; 