'use strict';

angular
    .module('myApp.directives', ['ngRoute'])
    .directive('movietile', ['$location', function ($location) {
        return {
            restrict: 'E',
            templateUrl: 'directives/movie-tile.html',
            replace: true,
            scope: {
                movie: '=movie',
                tileWidth: '=',
                tileHeight: '='
            },
            compile: function (elem, attrs) {
                attrs.tileWidth = attrs.tileWidth || '380';
                attrs.tileHeight = attrs.tileHeight || '380';
                attrs.smallTile = +attrs.tileWidth < 300 || +attrs.tileHeight < 300;

                return function(scope, elem, attrs) {
                    scope.goToMoviePage = function () {
                        console.warn("GOTOOO ", scope.movie);
                        $location.path('/movie/' + scope.movie.id);
                    };
                    scope.smallTile = attrs.smallTile;
                }
            }
        }
    }]);
