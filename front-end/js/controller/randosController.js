var randosController = angular.module("randosController", ['ngResource']);

randosController.controller("RandosController", function($scope, $http, $routeParams) {
    var token = "abcd";
    $http.get('/admin/randos?token=' + token).success(function (randos) {
        $scope.randos = randos;
    });
});
