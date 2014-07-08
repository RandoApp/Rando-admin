var randosController = angular.module("randosController", ['ngResource']);

randosController.controller("RandosController", function($scope, $http, $routeParams) {
    $http.get('/admin/randos?token=' + localStorage.getItem("authToken")).success(function (randos) {
        for (var i = 0; i < randos.length; i++) {
            randos[i].creationPritty = moment.unix(randos[i].creation).format('DD MMMM YYYY, HH:mm:ss');
        }
        $scope.randos = randos;
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
