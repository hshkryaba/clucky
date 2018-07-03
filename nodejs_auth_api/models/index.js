const User = require('./user.js');
const Question = require('./question.js');
const Answer = require('./answer.js');
const Category = require('./category.js');
const Tag = require('./tag.js');
const Vote = require('./vote.js');

const connection = require('../db/db_sequelize_connection.js');

User.hasMany(Question);
User.hasMany(Answer);
Question.belongsTo(User); // { foreignKey: 'user_id', targetKey: 'id', as: 'User' }
Answer.belongsTo(User);

Question.hasMany(Answer);
Answer.belongsTo(Question);

Answer.hasMany(Vote);
Vote.belongsTo(Answer);
Vote.belongsTo(User);

Question.belongsToMany(Category, {through: 'questions_categories'});
Category.belongsToMany(Question, {through: 'questions_categories'});

Question.belongsToMany(Tag, {through: 'questions_tags'});
Tag.belongsToMany(Question, {through: 'questions_tags'});

connection.db.sync()
  .then((result) => {
    console.log('The database is synchronized. ');
  })
  .catch((err) => {
    console.error('Unable to synchronize the database:', err.code || '' + ' ' + err.message);
  });

module.exports = connection;
