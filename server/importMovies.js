const client = require('./client'),
    redisClient = require('./redisCli'),
    path = require('path'),
    jsonfile = require('jsonfile');

const file = path.join(__dirname, './sampleContent/movies.json');

const Movie = client.Movie,
    sequelize = client.sequelize;

redisClient.flushall();

sequelize.sync({force: true}).then(function () {
    const insertMovie = (jsonMovie) => {
        const movie = Movie.build({
            title: jsonMovie['Title'],
            year: jsonMovie['Year'],
            rated: jsonMovie['Rated'],
            genre: jsonMovie['Genre'],
            country: jsonMovie['Country'],
            poster: jsonMovie['Poster']
        });
        movie.save().catch(function (error) {
            if (error) {
                console.log(error);
            }
        });
    };

    const movies = jsonfile.readFileSync(file);


    for (let i = 0; i < movies.length; i++) {
        insertMovie(movies[i]);
    }

    setTimeout(function () {
        process.exit();
    }, 10000);
});


