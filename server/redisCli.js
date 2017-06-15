var redis = require('redis'),
    config = require('./config');

redisClient = redis.createClient(config.redisPort, config.redisUrl);
if (config.redisAuth) {
    this.redisCli.auth(config.redisAuth, function (err) {
        if (err) {
            throw err;
        }
    });
}

module.exports = exports = redisClient;
