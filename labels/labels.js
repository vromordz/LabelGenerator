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

.controller('labelsCtrlList', ['$scope', '$http', '$filter', function($scope, $http, $filter) {
	$scope.dbURL = dbURL;
	$scope.labelDate = new Date();
	$scope.labelQuantity = 1;

	$scope.printLabel = function(label) {
		var date_w_format      = $filter('date')($scope.labelDate, 'dd/MM/yyyy');

		var background 	= $scope.dbURL + label.template,
				barcode_txt = 'SAYA-'+label.model_id+counter_leading_0s,
				barcode 		= '<img src="http://barcode.tec-it.com/barcode.ashx?code=Code128&modulewidth=fit&data='+barcode_txt+'&dpi=96&imagetype=gif&rotation=0&color=&bgcolor=&fontcolor=&quiet=0&qunit=mm">',
				popupWin		= new Array;

		console.log($scope.labelQuantity);
		console.log($scope.counter);
		for (var i = $scope.labelQuantity - 1; i >= 0; i--) {
			var counter_leading_0s = $filter('leadingZero')($scope.counter, 8);
			console.log(i);
			console.log(counter_leading_0s);

			popupWin[i] = window.open('', '_blank');
			popupWin[i].document.open();
	  	popupWin[i].document.write([
	  		'<html>',
	  		'	<head>',
	  		'		<title>'+label.model+'</title>',
		  	'		<style>',
	  		'			body {',
	    	'				margin: 0px;',
				'			}>',
				'		</style>',
				'	</head>',
				'	<body>',
				'		<div style="position:relative;">',
				' 		<div style="position:absolute; top: 0px; left: 0px; z-index: 1;">',
				'				<img src="'+background+'">',
				'			</div>',
				' 		<div style="position:absolute; top: '+label.barcode_top+'px; left: '+label.barcode_left+'px; z-index: 3;">',
				barcode,
				'			</div>',
				'			</div>',
				' 		<div style="position:absolute; top: '+label.date_top+'px; left: '+label.date_left+'px; z-index: 3;">',
				'				<p style="font-size: 26px; font-weight: bold; font-family: serif;">'+date_w_format+'</p>',
				'			</div>',
				'		</div>',
				'	</body>',
				'</html>'
				].join('\n'));
	  	popupWin[i].document.close();
	  	$scope.counter += 1;
		};	  	
	};

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
	console.log($scope.labelid);
}]);