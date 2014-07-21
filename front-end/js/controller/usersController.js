var usersController = angular.module("usersController", ['ngTable', 'ngResource']);

usersController.controller("UsersController", function($scope, $http, $filter, ngTableParams) {
     $scope.tableParams = new ngTableParams({
            page: 1,
            count: 100,
        }, {
            total: 0,
            getData: function($defer, params) {
                if (!$scope.cache || $scope.cache.page != params.page()) {
                    $http.get('/admin/users?page=' + params.page() + '&count=' + params.count() + '&token=' + localStorage.getItem("authToken")).success(function (usersPage) {
                        updateUsersTable($defer, usersPage, params, $scope, $filter);
                    });
                } else {
                    updateUsersTable($defer, $scope.cache.usersPage, params, $scope, $filter);
                }
            }
        }
    );
});

function updateUsersTable($defer, usersPage, params, $scope, $filter) {
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
