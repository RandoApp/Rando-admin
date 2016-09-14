var randoApp = angular.module("randoApp", [
    'ngRoute',
    'randosController',
    'starsController',
    'userController',
    'statusController',
    'logController',
    'logsController',
    'apiController',
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
            .when('/reports', {
                templateUrl: '/static/partials/reports.html',
                                controller: 'LogsController'
            })
            .when('/logs', {
                templateUrl: '/static/partials/logs.html',
                controller: 'LogsController'
            })
            .when('/api', {
                templateUrl: '/static/partials/api.html',
                controller: 'ApiController'
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
