const Sequelize = require('sequelize');
config = require('./config');

const sequelize = new Sequelize(config.postgresDbName, config.postgresUsername, config.postgresPassword, {
    host: config.postgresHost,
    dialect: 'postgres'
});

var User = sequelize.define('user', {
    name: Sequelize.STRING
});

var Movie = sequelize.define('movie', {
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
  sequelize: sequelize,
  User: User,
  Movie: Movie
};

