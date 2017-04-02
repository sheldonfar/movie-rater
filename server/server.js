const express = require('express'),
    raccoon = require('raccoon'),
    path = require('path'),
    starter = require('./starter.js'),
    bodyParser = require('body-parser'),
    app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
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

app.post('/newRating', function (req, res) {
    let replyObj = {};

    let raccoonFeeling = req.body.like === true ? raccoon.liked : raccoon.disliked;

    console.warn("NEW RATING " + JSON.stringify(req.body, null, 2));

    raccoonFeeling(req.body.username, req.body.movieId).then(() => {
        raccoon.stat.recommendFor(req.body.username, 15).then((recs) => {
            console.log('recs', recs);
            raccoon.stat.mostSimilarUsers(req.body.username).then((simUsers) => {
                raccoon.stat.bestRatedWithScores(9).then((bestRated) => {
                    replyObj = {
                        recommendations: recs,
                        similarUsers: simUsers,
                        bestScores: bestRated
                    };
                    res.send(replyObj);
                });
            });
        });
    });
});

app.get('/likes', function (req, res) {
    let replyObj = {};
    raccoon.stat.likedBy(req.query[':movieId']).then((likes) => {
        raccoon.stat.dislikedBy(req.query[':movieId']).then((dislikes) => {
            replyObj = {
                likedBy: likes,
                dislikedBy: dislikes
            };
            res.send(replyObj);
        });
    });
});

app.listen(3000, function () {
    console.log('--- Server is up and running! ---');
});
