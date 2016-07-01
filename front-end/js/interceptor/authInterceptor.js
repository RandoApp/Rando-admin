angular.module('randoApp').config([
  '$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  }
]);

angular.module('randoApp').factory('authInterceptor', [
  '$rootScope', 'ENV', '$log', 'CONFIG',
  function($rootScope, ENV, $log, CONFIG) {
    return {
      request: function($config) {
        $config.headers['token'] = localStorage.getItem("authToken");
      }
    };
  }
]);
