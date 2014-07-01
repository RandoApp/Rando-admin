var randoApp = angular.module("randoApp", [
    'ngRoute',
    'userController',
    'randosController',
    'usersController',
    'ngTable'
]);

randoApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider
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
            .otherwise({redirectTo: '/bla'});
}]);
