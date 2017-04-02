const serverUrl = 'http://localhost:3000/';


angular.module('myApp', [
    'ngRoute',
    'myApp.login',
    'myApp.main'
]).config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {

    $routeProvider
        .otherwise({redirectTo: '/'});
}]).constant('config', {
    appName: 'Video Recommendation Portal',
    appVersion: '0.0.1',
    serverUrls: {
        login: serverUrl + 'login',
        newRating: serverUrl + 'newRating',
        likes: serverUrl + 'likes'
    }
});
