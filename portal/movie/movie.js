'use strict';

angular.module('myApp.movie', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/movie/:movieId', {
            templateUrl: 'movie/movie.html',
            controller: 'MovieCtrl'
        });
    }])

    .controller('MovieCtrl', ['config', '$scope', '$routeParams', '$http', function (config, $scope, $routeParams, $http) {
        $scope.movieId = $routeParams.movieId;

        $http({
            method: 'GET',
            url: config.serverUrls.movie,
            params: {movieId: $scope.movieId}
        }).then(function (resp) {
            $scope.movie = resp.data;
            console.warn(resp.data);
        }, function () {
            window.console.log("No connection");
        });
    }]);
