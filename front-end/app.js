var randoApp = angular.module("randoApp", [
    'ngRoute',
    'userController',
    'usersController',
    'ngTable'
]);

randoApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider
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
