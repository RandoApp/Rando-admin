var randoApp = angular.module("randoApp", [
    'ngRoute',
    'userController',
    'randosController',
    'usersController',
    'statusController',
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
            .when('/user/:email', {
                templateUrl: '/admin/partials/user.html',
                controller: 'UserController'
            })
            .when('/users', {
                templateUrl: '/admin/partials/users.html',
                controller: 'UsersController'
            })
            .when('/status', {
                templateUrl: '/admin/partials/status.html',
                controller: 'StatusController'
            })
            .otherwise({redirectTo: '/status'});
}]);
