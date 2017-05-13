var client = require('./client'),
    redisClient = require('./redisCli'),
    path = require('path'),
    jsonfile = require('jsonfile');

var file = path.join(__dirname, './sampleContent/movies.json');

var Movie = client.Movie,
    sequelize = client.sequelize;

redisClient.flushall();

sequelize.sync({force: true}).then(function () {
    var insertMovie = function (jsonMovie) {
        var movie = Movie.build({
            title: jsonMovie['Title'],
            year: jsonMovie['Year'],
            rated: jsonMovie['Rated'],
            genre: jsonMovie['Genre'],
            country: jsonMovie['Country'],
            poster: jsonMovie['Poster'],
            runtime: jsonMovie['Runtime'],
            plot: jsonMovie['Plot'],
            criticRatings: jsonMovie['Ratings'],
            rating: 1400
        });
        movie.save().catch(function (error) {
            if (error) {
                console.log(error);
            }
        });
    };

    var movies = jsonfile.readFileSync(file);

    for (var i = 0; i < movies.length; i++) {
        insertMovie(movies[i]);
    }

    setTimeout(function () {
        process.exit();
    }, 10000);
});


