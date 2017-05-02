'use strict';

angular.module('myApp.mosaic', ['ngRoute', 'slick', 'wu.masonry', 'myApp.directives'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/mosaic/:username', {
            templateUrl: 'mosaic/mosaic.html',
            controller: 'MosaicCtrl'
        });
    }])

    .controller('MosaicCtrl', ['config', '$scope', '$routeParams', '$http', function (config, $scope, $routeParams, $http) {
        $scope.username = $routeParams.username;

        $http({
            method: 'GET',
            url: config.serverUrls.movies,
            params: {username: $scope.username}
        }).then(function (resp) {
            $scope.movies = App.helpers.shuffle(resp.data);
            $scope.top5Elo =
            $scope.iterator = 0;
        }, function () {
            window.console.log("No connection");
        });

        $http({
            method: 'GET',
            url: config.serverUrls.recommendations,
            params: {username: $scope.username}
        }).then(function (resp) {
            $scope.recommendations = resp.data.recommendations;
        }, function () {
            window.console.log("No connection");
        });

        var sendRating = function (isLiked, movieId) {
            $http({
                method: 'POST',
                url: config.serverUrls.newRating,
                data: {
                    username: $scope.username,
                    like: isLiked,
                    movieId: movieId
                }
            }).then(function (resp) {
                console.warn("RESP ", resp);
                $scope.recommendations = App.helpers.shuffle(resp.data.recommendations);
            }, function () {
                window.console.log("No connection");
            });
        };

        $scope.onYes = function (id) {
            sendRating(true, id);
        };
    }]);
