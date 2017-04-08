'use strict';

angular
    .module('myApp.directives', [])
    .directive('movietile', function () {
        return {
            restrict: 'AE',
            templateUrl: 'directives/movie-tile.html',
            replace: true,
            scope: {
                movie: '=movie'
            },
            link: function (scope, elem, attrs) {

            }
        }
    });
