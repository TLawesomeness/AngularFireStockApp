'use strict';

angular.module('myApp', [
    'ngRoute',
    'myApp.home',
    'myApp.register',
    'myApp.welcome'       // Newly added home module
])

.config(['$routeProvider', function($routeProvider) {
    // Set default view of our app to home

    $routeProvider.otherwise({
        redirectTo: '/home'
    });
}]);
