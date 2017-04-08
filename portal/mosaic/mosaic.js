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
            url: config.serverUrls.login,
            data: {username: $scope.username}
        }).then(function (resp) {
            console.warn("DATA ", resp.data);
            $scope.movies = App.helpers.shuffle(resp.data.allMovies);
            $scope.iterator = 0;

        }, function () {
            window.console.log("No connection");
        });

        var sendRating = function (isLiked, movieId) {
            //console.warn("SEND ", $scope.username, isLiked, movieId);
            $http({
                method: 'POST',
                url: config.serverUrls.newRating,
                data: {
                    username: $scope.username,
                    like: isLiked,
                    movieId: movieId
                }
            }).then(function (data) {
                //console.warn("RESP ", data);
            }, function () {
                window.console.log("No connection");
            });
        };

        $scope.onYes = function (iterator) {
            var movie = iterator === 1 ? $scope.moviesOne[$scope.iteratorOne] : $scope.moviesTwo[$scope.iteratorTwo];
            sendRating(true, movie.id);
        };
    }]);
