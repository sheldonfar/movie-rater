var express = require('express'),
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
    var replyObj = {};

    var raccoonFeeling = req.body.like === true ? raccoon.liked : raccoon.disliked;

    console.warn("NEW RATING " + JSON.stringify(req.body, null, 2));

    raccoonFeeling(req.body.username, req.body.movieId).then(function () {
        raccoon.stat.recommendFor(req.body.username, 15).then(function (recs) {
            console.log('recs', recs);
            raccoon.stat.mostSimilarUsers(req.body.username).then(function (simUsers) {
                raccoon.stat.bestRatedWithScores(9).then(function (bestRated) {
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

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || 8888;
var server = app.listen(port, ipaddress, function () {

    var host = server.address().address;

    console.log((new Date()) + '  app listening at http://%s:%s', host, port)

});
