'use strict';

angular
    .module('myApp.directives', [])
    .directive('movietile', function () {
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
                    scope.smallTile = attrs.smallTile;
                }
            }
        }
    });
