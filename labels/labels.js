'use strict';

var dbURL = 'db/';

angular.module('LabelGeneratorApp.labels', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/labels', {
    templateUrl: 'labels/labels.html',
    controller: 'labelsCtrlList'
  });
}])

.run([ '$rootScope', '$location', function($rootScope, $location) {
	$rootScope.viewCRUD = ($location.host() === 'localhost');
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

.controller('labelsCtrlList', ['$rootScope', '$scope', '$http', '$filter', function($rootScope, $scope, $http, $filter) {
	$scope.dbURL = dbURL;
	
	$scope.printLabel = function(label) {
		var date_w_format      = $filter('date')(label.made_date, 'dd/MM/yyyy');

		var background 	= $scope.dbURL + label.template,
				popupWin; //		= new Array;

		for (var i = label.quantity - 1; i >= 0; i--) {
			var counter_leading_0s = $filter('leadingZero')($scope.counter, 8),
					barcode_txt = 'SAYA-'+label.model_id+counter_leading_0s,
					barcode 		= '<img src="http://barcode.tec-it.com/barcode.ashx?code=Code128&modulewidth=fit&data='+barcode_txt+'&dpi=96&imagetype=gif&rotation=0&color=&bgcolor=&fontcolor=&quiet=0&qunit=mm">';

			popupWin = window.open('about:blank', '_blank');
			popupWin.document.open();
	  	popupWin.document.write([
	  		'<html>',
	  		'	<head>',
	  		'		<title>'+barcode_txt+'</title>',
		  	'		<style>',
		  	'			@page {',
		  	'				size: auto;',
		  	'				margin: 0mm;',
		  	'				width:210mm; height:297mm; ',
		  	'			}',
	  		'			body {',
	    	'				margin: 0mm;',
				'			}>',
				'		</style>',
				'		<script>',
				'			function printLabel(printableArea) {',
     		'				var printContents = document.getElementById(printableArea).innerHTML;',
     		'				var originalContents = document.body.innerHTML;',
				'				document.body.innerHTML = printContents;',
				'				window.print();',
				'				document.body.innerHTML = originalContents;',
				'			}',
				'		</script>',
				'	</head>',
				'	<body>', // onload="printLabel(\'printableLabel\')">',
				'		<div style="position:absolute; top: 25px; right: 0px; z-index: 4;">',
				'			<input type="button" onclick="printLabel(\'printableLabel\')" value="Print">',
				'		</div>',
				'		<div id="printableLabel" style="position:relative;">',
				' 		<div style="position:absolute; top: 0px; left: 0px; z-index: 1;">',
				'				<img src="'+background+'" style="width:210mm; height:296mm;">', // width:210mm; height:297mm;
				'			</div>',
				' 		<div style="position:absolute; top: '+label.barcode_top+'px; left: '+label.barcode_left+'px; z-index: 3;">',
				barcode,
				'			</div>',
				' 		<div style="position:absolute; top: '+label.date_top+'px; left: '+label.date_left+'px; z-index: 3;">',
				'				<p style="margin: 0px; font-size: 26px; font-weight: bold; font-family: serif;">'+date_w_format+'</p>',
				'			</div>',
				'		</div>',
				'	</body>',
				'</html>'
				].join('\n'));
	  	popupWin.document.close();
	  	$scope.counter += 1;
		};	  	
	};

	$http.get(dbURL + 'index.json', { cache: false })
		.success(function(data, status) {
			$scope.labels = data.labels;
			angular.forEach($scope.labels, function(value, key) {
				value.quantity 	= 1;
				value.made_date 			= new Date();
			});
			$scope.counter= data.counter;
		})
		.error(function(data, status) {
			console.log(status);
		});
}]);