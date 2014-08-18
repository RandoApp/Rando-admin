var randoApp = angular.module("randoApp", [
    'ngRoute',
    'randosController',
    'starsController',
    'userController',
    'usersController',
    'statusController',
    'logController',
    'logsController',
    'ngTable'
]);

randoApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider
            .when('/auth', {
                templateUrl: '/static/partials/auth.html',
                controller: 'AuthController'
            })
            .when('/randos', {
                templateUrl: '/static/partials/randos.html',
                controller: 'RandosController'
            })
            .when('/stars', {
                templateUrl: '/static/partials/stars.html',
                controller: 'StarsController'
            })
            .when('/user/:email', {
                templateUrl: '/static/partials/user.html',
                controller: 'UserController'
            })
            .when('/users', {
                templateUrl: '/static/partials/users.html',
                controller: 'UsersController'
            })
            .when('/logs', {
                templateUrl: '/static/partials/logs.html',
                controller: 'LogsController'
            })
            .when('/log/:logFile', {
                templateUrl: '/static/partials/log.html',
                controller: 'LogController'
            })
            .when('/status', {
                templateUrl: '/static/partials/status.html',
                controller: 'StatusController'
            })
            .otherwise({redirectTo: '/status'});
}]);


$(document).ready(function() {
    $("#menu li").on("click", function () {
        $("#menu li").removeClass("active");
        $(this).addClass("active");
    });
});
