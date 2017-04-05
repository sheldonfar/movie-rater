'use strict';

angular.module('myApp.main', ['ngRoute', 'slick', 'angular-flippy'])

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
            console.warn("DATA ", data);
            $scope.movies = App.helpers.shuffle(data.allMovies);
            $scope.iteratorOne = 0;
            $scope.iteratorTwo = 0;

            $scope.moviesOne = $scope.movies.slice(0, Math.ceil($scope.movies.length / 2));
            $scope.moviesTwo = $scope.movies.slice(Math.ceil($scope.movies.length / 2), $scope.movies.length);
        }).error(function () {
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
            }).success(function (data) {
                //console.warn("RESP ", data);
            }).error(function () {
                window.console.log("No connection");
            });
        };

        $scope.onYes = function (iterator) {
            var movie = iterator === 1 ? $scope.moviesOne[$scope.iteratorOne] : $scope.moviesTwo[$scope.iteratorTwo];
            sendRating(true, movie.id);

            if ($scope.moviesOne.length > $scope.iteratorOne + 1 && $scope.moviesTwo.length > $scope.iteratorTwo + 1) {
                $scope.iteratorOne++;
                $scope.iteratorTwo++;
            }

            console.warn($scope.moviesOne, $scope.moviesOne.length, $scope.iteratorOne);
        };
    }]);
