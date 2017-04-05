module.exports = exports = (function(){  

  var client = require('./client'),
  raccoon = require('raccoon');

  var Movie = client.Movie,
    User = client.User,
    sequelize = client.sequelize;

  var buildLoginObject = function(userName, callback){
    var loginObject = {};

    sequelize.Promise.all([
      User.findOrCreate({where: {name: userName}}),
      User.findAll(),
      Movie.findAll()
    ]).spread(function(userObj, allUsers, allMovies) {
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

  return {
    buildLoginObject: buildLoginObject
  };
}).call(this);
