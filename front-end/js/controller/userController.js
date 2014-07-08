var userController = angular.module("userController", ['ngResource']);

userController.controller("UserController", function($scope, $http, $routeParams) {
    $http.get('/admin/user?email=' + $routeParams.email + '&token=' + sessionStorage.getItem("authToken")).success(function (user) {
        $scope.user = user;
        $scope.user.banPritty = moment.unix(user.ban).format('DD MMMM YYYY, HH:mm:ss');
        var notPairedRandos = 0;
        for (var i = 0; i < user.randos.length; i++) {
            var rando = user.randos[i];
            rando.user.creationPritty = moment.unix(rando.user.creation).format('DD MMMM YYYY, HH:mm:ss');
            rando.stranger.creationPritty = moment.unix(rando.stranger.creation).format('DD MMMM YYYY, HH:mm:ss');
            if (rando.stranger.imageURL == "") {
                rando.stranger.email = "_";
                rando.stranger.imageSizeURL.small = "http://s3.amazonaws.com/img.s.rando4me/reported.jpg";
                rando.stranger.mapSizeURL.small = "http://s3.amazonaws.com/img.s.rando4me/reported.jpg";
                notPairedRandos++;
            }
        }
        $scope.user.notPairedRandos = notPairedRandos;

        $scope.flipRando = function (rando, $event) {
            var img = $event.target;
            if (img.src.indexOf("img.s") != -1) {
                img.src = rando.mapSizeURL.small;
            } else {
                img.src = rando.imageSizeURL.small;
            }
        };
    });
});
