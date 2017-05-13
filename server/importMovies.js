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
            released: jsonMovie['Released'],
            runtime: jsonMovie['Runtime'],
            genre: jsonMovie['Genre'],
            director: jsonMovie['Director'],
            writer: jsonMovie['Writer'],
            actors: jsonMovie['Actors'],
            plot: jsonMovie['Plot'],
            language: jsonMovie['Language'],
            country: jsonMovie['Country'],
            awards: jsonMovie['Awards'],
            poster: jsonMovie['Poster'],
            criticRatings: jsonMovie['Ratings'],
            rating: 1400,
            metascore: jsonMovie['Metascore'],
            imdbRating: jsonMovie['imdbRating'],
            imdbVotes: jsonMovie['imdbVotes'],
            imdbID:  jsonMovie['imdbID'],
            type: jsonMovie['Type'],
            dvd: jsonMovie['DVD'],
            boxOffice:  jsonMovie['BoxOffice'],
            production:  jsonMovie['Production'],
            website: jsonMovie['Website']
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


