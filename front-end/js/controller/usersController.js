var usersController = angular.module("usersController", ['ngTable', 'ngResource']);

usersController.controller("UsersController", function($scope, $http, $filter, ngTableParams) {
     $scope.tableParams = new ngTableParams({
            page: 1,
            count: 100,
        }, {
            total: 0,
            getData: function($defer, params) {
                var token = "adasd";
                if (!$scope.cache || $scope.cache.page != params.page()) {
                    $http.get('/admin/users?page=' + params.page() + '&count=' + params.count() + '&token=' + token).success(function (usersPage) {
                        updateTable($defer, usersPage, params, $scope, $filter);
                    });
                } else {
                    updateTable($defer, $scope.cache.usersPage, params, $scope, $filter);
                }
            }
        }
    );
});

function updateTable($defer, usersPage, params, $scope, $filter) {
    var page = usersPage.data;
    page = params.filter() ? $filter('filter')(page, params.filter()) : page;
    page = params.sorting() ? $filter('orderBy')(page, params.orderBy()) : page;

    params.total(usersPage.total);
    $defer.resolve(page);
    $scope.cache = {
        page: params.page(),
        usersPage: usersPage 
    }
}
