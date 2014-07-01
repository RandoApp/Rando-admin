var userController = angular.module("userController", ['ngResource']);

userController.controller("UserController", function($scope, $http, $routeParams) {
    var token = "abcd";
    $http.get('/admin/user?email=' + $routeParams.email + '&token=' + token).success(function (user) {
        $scope.user = user;
    });
});
