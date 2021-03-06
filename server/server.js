var express = require('express'),
    raccoon = require('raccoon'),
    path = require('path'),
    starter = require('./starter.js'),
    app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/login', function (req, res) {
    starter.buildLoginObject(req.query[':username'], function (object) {
        res.send(object);
    });
});

var sendRating = function (req, res) {
    var username = req.body.username || req.query.username;
    raccoon.stat.recommendFor(username, 15).then(starter.getMovies).then(function (recommendations) {
        raccoon.stat.mostSimilarUsers(username).then(function (simUsers) {
            raccoon.stat.leastSimilarUsers(username).then(function (leastSimUsers) {
                raccoon.stat.mostLiked().then(starter.getMovies).then(function (mostLiked) {
                    raccoon.stat.mostDisliked().then(starter.getMovies).then(function (mostDisliked) {
                        raccoon.stat.bestRatedWithScores(9).then(function (bestRated) {
                            res.send({
                                recommendations: recommendations,
                                similarUsers: simUsers,
                                mostLiked: mostLiked,
                                mostDisliked: mostDisliked,
                                leastSimilarUsers: leastSimUsers,
                                bestScores: bestRated
                            });
                        });
                    });
                });
            });
        });
    });
};

app.get('/recommendations', function (req, res) {
    sendRating(req, res);
});

app.post('/newRating', function (req, res) {
    var raccoonFeeling = req.body.like === true ? raccoon.liked : raccoon.disliked;
    console.info("New Rating: Liked = " + req.body.like + ", Id = " + req.body.movieId);

    if (req.body.movieId2) {
        starter.getMovieRating(req.body.movieId, function (Ra) {
            starter.getMovieRating(req.body.movieId2, function (Rb) {
                var Ea = 1 / (1 + Math.pow(10, (Rb - Ra) / 400));
                var Eb = 1 / (1 + Math.pow(10, (Ra - Rb) / 400));
                var RaNew = Math.round(Ra + 10 * (1 - Ea));
                var RbNew = Math.round(Rb + 10 * (-Eb));
                starter.updateMovieRating(req.body.movieId, RaNew);
                starter.updateMovieRating(req.body.movieId2, RbNew);
            });
        });
    }

    raccoonFeeling(req.body.username, req.body.movieId).then(function () {
        sendRating(req, res);
    });
});

app.get('/movies', function (req, res) {
    starter.getMovies().then(function (movies) {
        res.send(movies);
    });
});

app.get('/movie', function (req, res) {
    starter.getMovieById(req.body.movieId || req.query.movieId).then(function (object) {
        res.send(object);
    });
});

app.get('/likes', function (req, res) {
    var replyObj = {};
    raccoon.stat.likedBy(req.query[':movieId']).then(function (likes) {
        raccoon.stat.dislikedBy(req.query[':movieId']).then(function (dislikes) {
            replyObj = {
                likedBy: likes,
                dislikedBy: dislikes
            };
            res.send(replyObj);
        });
    });
});

var ipaddress = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server = app.listen(port, ipaddress, function () {
    console.log((new Date()) + '  app listening at http://%s:%s', server.address().address, port)
});
