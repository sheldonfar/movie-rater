angular.module('myApp', [
    'ngRoute',
    'myApp.login',
    'myApp.main'
]).config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

    $routeProvider.otherwise({redirectTo: '/'});
}]);
