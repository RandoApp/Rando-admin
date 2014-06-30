var userController = angular.module("userController", []);

userController.controller("UserController", ['$scope', '$http', function ($scope, $http) {
    var token = "abcd";
    $http.get('/users/' + token).success(function (data) {
        $scope.users = data;
    });
    
    /*
    $scope.users = [
        {email: "dimhold@gmail.com", randos: 4},
        {email: "dima@gmail.com", randos: 0},
        {email: "peta@gmail.com", randos: 144}
    ];
    */
}]);
