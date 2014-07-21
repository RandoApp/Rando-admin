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
                templateUrl: '/admin/partials/auth.html',
                controller: 'AuthController'
            })
            .when('/randos', {
                templateUrl: '/admin/partials/randos.html',
                controller: 'RandosController'
            })
            .when('/stars', {
                templateUrl: '/admin/partials/stars.html',
                controller: 'StarsController'
            })
            .when('/user/:email', {
                templateUrl: '/admin/partials/user.html',
                controller: 'UserController'
            })
            .when('/users', {
                templateUrl: '/admin/partials/users.html',
                controller: 'UsersController'
            })
            .when('/logs', {
                templateUrl: '/admin/partials/logs.html',
                controller: 'LogsController'
            })
            .when('/log/:logFile', {
                templateUrl: '/admin/partials/log.html',
                controller: 'LogController'
            })
            .when('/status', {
                templateUrl: '/admin/partials/status.html',
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
