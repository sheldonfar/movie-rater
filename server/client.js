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
    released: Sequelize.STRING,
    runtime: Sequelize.STRING,
    genre: Sequelize.STRING,
    director: Sequelize.STRING,
    writer: Sequelize.STRING,
    actors: Sequelize.STRING,
    plot: Sequelize.STRING,
    language: Sequelize.STRING,
    country: Sequelize.STRING,
    awards: Sequelize.STRING,
    poster: Sequelize.STRING,
    criticRatings: Sequelize.JSON,
    rating: Sequelize.INTEGER,
    metascore: Sequelize.STRING,
    imdbRating: Sequelize.STRING,
    imdbVotes: Sequelize.STRING,
    imdbID: Sequelize.STRING,
    type: Sequelize.STRING,
    dvd: Sequelize.STRING,
    boxOffice: Sequelize.STRING,
    production: Sequelize.STRING,
    website: Sequelize.STRING
});

module.exports = exports = {
  sequelize: sequelize,
  User: User,
  Movie: Movie
};

