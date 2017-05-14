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
            $scope.movies = resp.data;
        }, function () {
            window.console.log("No connection");
        });

        $http({
            method: 'GET',
            url: config.serverUrls.recommendations,
            params: {username: $scope.username}
        }).then(function (resp) {
            $scope.recommendations = resp.data.recommendations;
            $scope.similarUsers = resp.data.similarUsers;
        }, function () {
            window.console.log("No connection");
        });

        $scope.onRating = function (isLiked, id) {
            $http({
                method: 'POST',
                url: config.serverUrls.newRating,
                data: {
                    username: $scope.username,
                    like: isLiked,
                    movieId: id
                }
            }).then(function (resp) {
                $scope.recommendations = App.helpers.shuffle(resp.data.recommendations);
            }, function () {
                window.console.log("No connection");
            });
        };

        $scope.greaterThan = function (ratingOne, ratingTwo) {
            return +ratingOne >= +ratingTwo;
        };
    }]);
