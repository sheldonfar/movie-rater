'use strict';

angular.module('myApp.main', ['ngRoute', 'slick'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/main/:username', {
            templateUrl: 'main/main.html',
            controller: 'MainCtrl'
        });
    }])

    .controller('MainCtrl', ['config', '$scope', '$routeParams', '$http', function (config, $scope, $routeParams, $http) {
        $scope.username = $routeParams.username;

        $http({
            method: 'GET',
            url: config.serverUrls.login,
            data: {username: $scope.username}
        }).success(function (data) {
            $scope.movies = data.allMovies;
            $scope.iteratorOne = 0;
            $scope.iteratorTwo = 0;

            $scope.moviesOne = $scope.movies.slice(0, Math.ceil($scope.movies.length / 2));
            $scope.moviesTwo = $scope.movies.slice(Math.ceil($scope.movies.length / 2), $scope.movies.length);
        }).error(function () {
            window.console.log("No connection");
        });

        let sendRating = function (isLiked, movieId) {
            console.warn("SEND ", $scope.username, isLiked, movieId);
            $http({
                method: 'POST',
                url: config.serverUrls.newRating,
                data: {
                    username: $scope.username,
                    like: isLiked,
                    movieId: movieId
                }
            }).success(function (data) {
                console.warn("RESP ", data);
            }).error(function () {
                window.console.log("No connection");
            });
        };

        $scope.onYes = function (movies, iterator) {
            sendRating(true, movies[iterator].id);
        };

        $scope.onNo = function (movies, iterator) {
            sendRating(false, movies[iterator].id);
        };

        $scope.increment = function (iteratorNumber) {
            iteratorNumber === 1 ? $scope.iteratorOne++ : $scope.iteratorTwo++;
        }
    }]);
