var logsController = angular.module("logsController", ['ngTable', 'ngResource']);

logsController.controller("LogsController", function($scope, $http, $filter, $route, ngTableParams) {
     $scope.tableParams = new ngTableParams({
            page: 1,
            count: 25,
        }, {
            total: 0,
            getData: function($defer, params) {
                $http.get('/admin/logs?token=' + localStorage.getItem("authToken")).success(function (logs) {
                    updateTable($defer, logs, params, $scope, $filter);
                    $scope.deleteLogFile = function (logFile) {
                        $http.delete('/admin/log/' + logFile + '?token=' + localStorage.getItem("authToken"))
                        .success(function(data, status, headers, config) {
                            alert("File " + data.delete + " deleted");
                            $route.reload();
                        }).error(function(data, status, headers, config) {
                            alert("Can NOT delete. Server response: " + status + ", : " + data);
                        });
                    };

                });
            }
        }
    );
});

function updateTable($defer, logs, params, $scope, $filter) {
    var pageNumber = params.page();
    var count = params.count();
    var page = logs.slice((pageNumber - 1) * count, pageNumber * count),
    page = params.filter() ? $filter('filter')(page, params.filter()) : page;
    page = params.sorting() ? $filter('orderBy')(page, params.orderBy()) : page;

    params.total(logs.length);
    $defer.resolve(page);
}
