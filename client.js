const Sequelize = require('sequelize');
config = require('./config');

const sequelize = new Sequelize(config.postgresDbName, config.postgresUsername, config.postgresPassword, {
    host: config.postgresHost,
    dialect: 'postgres'
});

let User = sequelize.define('user', {
    name: Sequelize.STRING
});

let Movie = sequelize.define('movie', {
    title: Sequelize.STRING,
    year: Sequelize.STRING,
    rated: Sequelize.STRING,
    genre: Sequelize.STRING,
    country: Sequelize.STRING,
    poster: Sequelize.STRING,
    runtime: Sequelize.STRING,
    plot: Sequelize.STRING,
    ratings: Sequelize.JSON
});

module.exports = exports = {
  sequelize,
  User,
  Movie
};

