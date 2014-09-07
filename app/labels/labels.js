'use strict';

var dbURL = 'db/';

angular.module('LabelGeneratorApp.labels', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/labels', {
    templateUrl: 'labels/labels.html',
    controller: 'labelsCtrlList'
  });
}])

.filter('leadingZero', function () {
  return function (n, len) {
    var num = parseInt(n, 10),
    		len = parseInt(len, 10);
    if (isNaN(num) || isNaN(len)) {
      return n;
    }
    num = ''+num;
    while (num.length < len) {
      num = '0'+num;
    }
    return num;
  };
})

.controller('labelsCtrlList', ['$scope', '$http', function($scope, $http) {
	$scope.dbURL = dbURL;

	$http.get(dbURL + 'index.json', { cache: false })
		.success(function(data, status) {
			$scope.labels = data.labels;
			$scope.counter= data.counter;
			console.log(status);
		})
		.error(function(data, status) {
			console.log(status);
		});
}]);