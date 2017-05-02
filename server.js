var express = require('express'),
    raccoon = require('raccoon'),
    path = require('path'),
    starter = require('./starter.js'),
    bodyParser = require('body-parser'),
    app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
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

app.get('/recommendations', function (req, res) {
    raccoon.stat.recommendFor(req.query.username, 15).then(function (recs) {
        raccoon.stat.mostSimilarUsers(req.query.username).then(function (simUsers) {
            raccoon.stat.bestRatedWithScores(9).then(function (bestRated) {
                res.send({
                    recommendations: recs,
                    similarUsers: simUsers,
                    bestScores: bestRated
                });
            });
        });
    });
});

app.post('/newRating', function (req, res) {
    var sendRating = function (recommendations) {
        console.warn("RECCCOMNETDATIONDs ", recommendations);
        raccoon.stat.mostSimilarUsers(req.body.username).then(function (simUsers) {
            raccoon.stat.bestRatedWithScores(9).then(function (bestRated) {
                replyObj = {
                    recommendations: recommendations,
                    similarUsers: simUsers,
                    bestScores: bestRated
                };
                res.send(replyObj);
            });
        });
    };

    var replyObj = {};

    var raccoonFeeling = req.body.like === true ? raccoon.liked : raccoon.disliked;

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
        raccoon.stat.recommendFor(req.body.username, 15).then(function (recs) {
            var recommendations = [];
            console.warn("RECS ", recs);
            if (recs.length === 0) {
                sendRating(recommendations);
            } else {
                for (var rec in recs) {
                    starter.getMovieById(+recs[rec]).then(function (movie) {
                        recommendations.push(movie);
                        if (recommendations.length === recs.length) {
                            sendRating(recommendations);
                        }
                    });
                }
            }
        });
    });
});

app.get('/movies', function (req, res) {
    starter.getMovies().then(function (movies) {
        res.send(movies);
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
