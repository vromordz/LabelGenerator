'use strict';

var dbURL = 'db/';

angular.module('LabelGeneratorApp.labels', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/labels', {
    templateUrl: 'labels/labels.html',
    controller: 'labelsCtrlList'
  })
  .when('/labels/:id', {
    templateUrl: 'labels/generatelabel.html',
    controller: 'labelsCtrlShow'
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
	$scope.labelDate = new Date();
	$scope.labelQuantity = 1;

	$http.get(dbURL + 'index.json', { cache: false })
		.success(function(data, status) {
			$scope.labels = data.labels;
			$scope.counter= data.counter;
		})
		.error(function(data, status) {
			console.log(status);
		});
}])

.controller('labelsCtrlShow', ['$scope', '$routeParams', function($scope, $routeParams) {
	$scope.dbURL = dbURL;
	$scope.labelid = $routeParams.id;
}]);