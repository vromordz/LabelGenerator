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

		popupWin = window.open('', '_blank');
		popupWin.document.open();
  	var html_content = [
				'<html><head>',
				'	<title>'+barcode_txt+'</title>',
				'	<style>',
				'@page{size:auto;margin:0;width:210mm}body{margin:0;background-color:#fff}.printbutton{position:absolute;top:25px;left:25px;z-index:4;-webkit-appearance:none;-webkit-box-shadow:rgba(255,255,255,0.14902) 0 1px 0 0 inset,rgba(0,0,0,0.0745098) 0 1px 1px 0;-webkit-user-select:none;-webkit-writing-mode:horizontal-tb;align-items:flex-start;background-color:#428bca;background-image:linear-gradient(#428bca 0%,#2d6ca2 100%);background-repeat:repeat-x;border-bottom-left-radius:4px;border-bottom-right-radius:4px;border-image-outset:0;border-image-repeat:stretch;border-image-slice:100%;border-image-source:none;border-image-width:1;border-top-left-radius:4px;border-top-right-radius:4px;box-shadow:rgba(255,255,255,0.14902) 0 1px 0 0 inset,rgba(0,0,0,0.0745098) 0 1px 1px 0;box-sizing:border-box;color:#fff;cursor:pointer;display:inline-block;font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;font-size:14px;font-style:normal;font-variant:normal;font-weight:400;height:34px;letter-spacing:normal;line-height:20px;overflow-x:visible;overflow-y:visible;text-align:center;text-indent:0;text-shadow:rgba(0,0,0,0.2) 0 -1px 0;text-transform:none;vertical-align:middle;white-space:nowrap;width:94.1875px;word-spacing:0;writing-mode:lr-tb;border-color:#2b669a;border-style:solid;border-width:1px;margin:0;padding:6px 12px}user agent stylesheetinput:not([type="image"]),textarea{box-sizing:border-box}user agent stylesheetinput[type="button"],input[type="submit"],input[type="reset"],input[type="file"]::-webkit-file-upload-button,button{align-items:flex-start;text-align:center;cursor:default;color:buttontext;padding:2px 6px 3px;border:2px outset buttonface;border-image-source:initial;border-image-slice:initial;border-image-width:initial;border-image-outset:initial;border-image-repeat:initial;background-color:buttonface;box-sizing:border-box}user agent stylesheetinput[type="button"],input[type="submit"],input[type="reset"]{-webkit-appearance:push-button;-webkit-user-select:none;white-space:pre}user agent stylesheetinput,input[type="password"],input[type="search"]{-webkit-appearance:textfield;padding:1px;background-color:#fff;border:2px inset;border-image-source:initial;border-image-slice:initial;border-image-width:initial;border-image-outset:initial;border-image-repeat:initial;-webkit-rtl-ordering:logical;-webkit-user-select:text;cursor:auto}user agent stylesheetinput,textarea,keygen,select,button{margin:0;font:-webkit-small-control;color:initial;letter-spacing:normal;word-spacing:normal;text-transform:none;text-indent:0;text-shadow:none;display:inline-block;text-align:start}user agent stylesheetinput,textarea,keygen,select,button,meter,progress{-webkit-writing-mode:horizontal-tb}.background{position:absolute;top:0;left:0;z-index:1}.label{position:relative;width:210mm;padding:50px;margin:0 auto;margin-top:25px;background-color:#fff;-webkit-box-shadow:0 0 4px rgba(0,0,0,0.2),inset 0 0 50px rgba(0,0,0,0.1);-moz-box-shadow:0 0 4px rgba(0,0,0,0.2),inset 0 0 50px rgba(0,0,0,0.1);box-shadow:0 0 5px rgba(0,0,0,0.2),inset 0 0 50px rgba(0,0,0,0.1)}label:before,label:after{position:absolute;width:40%;height:10px;content:" ";left:12px;bottom:12px;background:transparent;-webkit-transform:skew(-5deg) rotate(-5deg);-moz-transform:skew(-5deg) rotate(-5deg);-ms-transform:skew(-5deg) rotate(-5deg);-o-transform:skew(-5deg) rotate(-5deg);transform:skew(-5deg) rotate(-5deg);-webkit-box-shadow:0 6px 12px rgba(0,0,0,0.3);-moz-box-shadow:0 6px 12px rgba(0,0,0,0.3);box-shadow:0 6px 12px rgba(0,0,0,0.3);z-index:-1}label:after{margin-bottom:25px;left:auto;right:12px;-webkit-transform:skew(5deg) rotate(5deg);-moz-transform:skew(5deg) rotate(5deg);-ms-transform:skew(5deg) rotate(5deg);-o-transform:skew(5deg) rotate(5deg);transform:skew(5deg) rotate(5deg)}',
				'	</style>',
				'	<script>',
				'		function printLabel(printableArea) {',
				'			var printContents = document.getElementById(printableArea).innerHTML;',
				'			var originalContents = document.body.innerHTML;',
				'			document.body.innerHTML = printContents;',
				'			window.print();',
				// '			popupWin = window.open("", "_blank");',
				// '			popupWin.document.open();',
				'	  	popupWin.document.write(document.body.innerHTML);',
				'			document.body.innerHTML = originalContents;',
				'		}',
				'	</script>',
				'</head>',
				'<body>',
				'	<input class="printbutton" type="button" onclick="printLabel(\'printableArea\')" value="Print">',
				'	<div  id="printableArea">'
			].join('\n');
		
		for (var i = label.quantity - 1; i >= 0; i--) {
			var counter_leading_0s = $filter('leadingZero')($scope.counter, 8),
					barcode_txt = 'SAYA-'+label.model_id+counter_leading_0s,
					barcode 		= '<img src="http://barcode.tec-it.com/barcode.ashx?code=Code128&modulewidth=fit&data='+barcode_txt+'&dpi=96&imagetype=gif&rotation=0&color=&bgcolor=&fontcolor=&quiet=0&qunit=mm">';

			html_content = html_content + [
				'		<div class="label">',
				'			<div style="position: relative; width: 210mm;">',
				'				<img src="'+background+'" style="width:210mm; height:296mm;">',
				'				<div style="position:absolute; top: 1015px; left: 403px; z-index: 3;">',
									barcode,
				'				</div>',
				'				<div style="position:absolute; top: 1047px; left: 135px; z-index: 3;">',
				'					<p style="margin: 0px; font-size: 26px; font-weight: bold; font-family: serif;">'+date_w_format+'</p>',
				'				</div> ',
				'			</div>',
				'		</div>'
			].join('\n');
			$scope.counter += 1;
		};

		html_content = html_content + [
			'	</div>',
			' <br/>',
			'</body></html>'
		].join('\n');
		popupWin.document.write(html_content);
  	popupWin.document.close();	  	
	};

	$http.get(dbURL + 'index.json', { cache: false })
		.success(function(data, status) {
			$scope.labels = data.labels;
			angular.forEach($scope.labels, function(value, key) {
				value.quantity 	= 1;
				value.made_date = new Date();
				value.model_id  = parseInt(value.model.substr(6,3));
			});
			$scope.counter= data.counter;
		})
		.error(function(data, status) {
			console.log(status);
		});
}]);