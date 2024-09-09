'use strict';
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('admin@queue123', 10); // Replace 'admin123' with your desired password
    return queryInterface.bulkInsert('Users', [{
      id: uuidv4(), // Generate UUID with the uuid package
      name: 'Queue Manager',
      email: 'admin@queueapp.com',
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', { email: 'admin@queueapp.com' }, {});
  }
};
