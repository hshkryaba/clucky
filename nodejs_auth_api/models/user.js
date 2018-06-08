const Sequelize = require('sequelize');

const User = Sequelize.define('user', {
  id: Sequelize.INTEGER,
  username: Sequelize.STRING,
  name: Sequelize.STRING,
  surname: Sequelize.STRING,
  password_hash: Sequelize.STRING,
  access_token: Sequelize.STRING,
  auth_key: Sequelize.STRING,
  created_at: Sequelize.DATE
},
{
  underscored: true,
  timestamps: true,
  createdAt: 'createTimestamp',
  updatedAt: false, // 'updateTimestamp'
  deletedAt: false, // 'destroyTime'
  paranoid: false
});

module.exports = User;
