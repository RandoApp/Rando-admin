var starsController = angular.module("starsController", ['ngResource']);

starsController.controller("StarsController", function($scope, $http, $routeParams) {
    $http.get('/admin/stars?token=' + localStorage.getItem("authToken")).success(function (stars) {
        for (var i = 0; i < stars.length; i++) {
            stars[i].datePritty = moment.unix(stars[i].date).format('DD MMMM YYYY, HH:mm:ss');
        }
        $scope.stars = stars;

        $scope.starOrUnstar = function (email, randoId, $event) {
            var action = "star";
            if($($event.target).hasClass("star-active")) {
                action = "unstar";
            }
            $http({
                method: "POST",
                url: "/admin/" + action + "?token=" + localStorage.getItem("authToken"),
                data: {
                    email: email,
                    randoId: randoId
                }
                }).success(function (res) {
                    alert("Command: " + res.command);
                });
        };
    });
});
