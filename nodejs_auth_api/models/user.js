const config = require('../config');
const { db, DataTypes } = require('../db/db_sequelize_connection.js');
const crypto = require('crypto');

const User = db.define('user', {
  login: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { is: /(?=^.{4,255}$)^(?![_.-])([a-zA-Z0-9]|[_.-](?![_.-]|$))+$/gm },
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { is: /(?=^.{5,255}$)^(?![_.-])([a-zA-Z0-9]|[_.-](?![_.@-]))+@(?![_.-])([a-zA-Z0-9]|[_.-](?![_.-]))+\.[a-zA-Z0-9]{2,3}$/gm },
    unique: true
  },
  password_hash: {
    type: DataTypes.CHAR(64),
    allowNull: false
  },
  access_token_hash: {
    type: DataTypes.CHAR(64),
    allowNull: true
  },
  acc_action_token_hash: {
    type: DataTypes.CHAR(64),
    allowNull: true
  },
  refresh_token_hash: {
    type: DataTypes.CHAR(64),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('New', 'Active', 'Disabled', 'Reseting'),
    defaultValue: 'New',
    allowNull: false
  }
},
{
  getterMethods: {
    password() {
      return this.getDataValue('password_hash');
    }
  },
  setterMethods: {
    password(value) {
      let hash = crypto.createHmac('sha256', config.crypto.key)
        .update(config.crypto.salt + value)
        .digest('hex');
      this.setDataValue('password_hash', hash);
    }
  }
});

module.exports = User;
