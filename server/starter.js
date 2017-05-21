module.exports = exports = (function () {

    var client = require('./client'),
        raccoon = require('raccoon');

    var Movie = client.Movie,
        User = client.User,
        sequelize = client.sequelize;

    var buildLoginObject = function (userName, callback) {
        var loginObject = {};

        sequelize.Promise.all([
            User.findOrCreate({where: {name: userName}}),
            User.findAll(),
            Movie.findAll()
        ]).spread(function (userObj, allUsers, allMovies) {
            const user = userObj[0];
            const userId = user.id;
            raccoon.stat.allWatchedFor(userId).then(function (allWatched) {
                raccoon.stat.recommendFor(userId, 30).then(function (recs) {
                    loginObject = {
                        userId: userId,
                        allUsers: allUsers,
                        allMovies: allMovies,
                        username: userName,
                        alreadyWatched: allWatched,
                        recommendations: recs
                    };
                    callback(loginObject);
                });
            });
        });
    };

    var getMovieRating = function (movieId, callback) {
        sequelize.Promise.all([
            Movie.findOne({where: {id: movieId}})
        ]).spread(function (movieObj) {
            callback(movieObj.rating);
        })
    };

    var getMovieById = function (movieId) {
        return Movie.findOne({where: {id: movieId}});
    };

    var updateMovieRating = function (movieId, newRating) {
        return Movie.update(
            {rating: newRating},
            {where: {id: movieId}}
        ).catch(function (err) {
            console.warn("-------------> Error updating movie ", movieId, ': ', err);
        });
    };

    var getMovies = function (ids) {
        if (ids) {
            return sequelize.Promise.all(ids.map(function(id) {
                return Movie.findOne({where: {id: +id}});
            }))
        }
        return Movie.findAll();
    };

    return {
        buildLoginObject: buildLoginObject,
        getMovieRating: getMovieRating,
        updateMovieRating: updateMovieRating,
        getMovies: getMovies,
        getMovieById: getMovieById
    };
}).call(this);
