const serverUrl = 'http://localhost:8080/';
var App = {};

App.helpers = {
    shuffle: function (array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }
};

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
