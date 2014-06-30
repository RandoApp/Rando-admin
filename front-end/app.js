var randoApp = angular.module("randoApp", [
    'ngRoute',
    'userController',
    'ngTable'
]);

randoApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/users', {
                templateUrl: '/admin/partials/users.html',
                controller: 'UserController'
            })
            .otherwise({redirectTo: '/bla'});
}]);
