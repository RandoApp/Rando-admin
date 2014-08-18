var logController = angular.module("logController", ['ngResource']);

logController.controller("LogController", function($scope, $http, $routeParams, $location) {
    $http.get('/log/' + $routeParams.logFile+ '?token=' + localStorage.getItem("authToken")).success(function (log) {
        log.name = $routeParams.logFile;
        $scope.log = log;

        $scope.deleteLogFile = function (logFile) {
            $http.delete('/log/' + logFile + '?token=' + localStorage.getItem("authToken"))
            .success(function(data, status, headers, config) {
                alert("File " + data.delete + " deleted");
                $location.path("/logs");
            }).error(function(data, status, headers, config) {
                alert("Can NOT delete. Server response: " + status + ", data: " + data);
            });
        };
    });
});
