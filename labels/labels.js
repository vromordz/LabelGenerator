'use strict';

var dbURL = 'db/';

angular.module('LabelGeneratorApp.labels', ['ngRoute', 'firebase'])

.value('fbURL', 'https://labelgenerator.firebaseio.com/')
 
.factory('LabelsCounter', function($firebase, fbURL) {
  return $firebase(new Firebase(fbURL)).$asObject();
})

.config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/labels', {
    templateUrl: 'labels/labels.html',
    controller: 'labelsCtrlList'
  })
  .when('/labels/print/:labelModel', {
    templateUrl: 'labels/labelsPrint.html',
    controller: 'labelsCtrlPrint'
  })
  .when('/labels/edit/:labelModel', {
    templateUrl:'labels/labelsDetail.html',
    controller:'labelsCtrlEdit'
  })
  .when('/labels/new', {
    templateUrl:'labels/labelsDetail.html',
    controller:'labelsCtrlCreate'
  })
  .otherwise({
    redirectTo:'/'
  });
}])

.run([ '$rootScope', '$location', 'LabelsCounter', function($rootScope, $location, LabelsCounter) {
  $rootScope.viewCRUD = ($location.host() === 'localhost');
  $rootScope.showPrintLabelBtn = false;
  LabelsCounter.$bindTo($rootScope, 'labelsDB');

  $rootScope.dismissAlert = function() {
    $rootScope.flashMessage = undefined;
  }

  $rootScope.cancelPrintLabel = function() {
    $rootScope.labelsDB.counter = $rootScope.labelsDB.counter - $rootScope.label.quantity;
    $rootScope.flashMessage = "El contador no fue modificado, ha regresado a su valor anterior ("+$rootScope.labelsDB.counter+").";
    $location.path('/');
  }

  $rootScope.printLabel = function() {
    var printContents = [
      '<html>',
      '  <head>',
      '    <style type="text/css">',
      '      @page {',
      '        size: auto;',
      '        margin: 0mm;',
      '        width: 2.95in;',
      '        height: 4.53in;',
      '      }',
      '      body {',
      '        margin: 0mm;',
      '        background-color: white;',
      '      }',
      '      .labelsheet {',
      '        position: relative;',
      '        width: 900px;',
      '      }',
      '      .labelbackground {',
      '        width: 900px;',
      '        height: 1350px;',
      '      }',
      '      .labeldate {',
      '        margin: 0px;',
      '        font-size: 24px;',
      '        font-weight: bold;',
      '        font-family: serif;',
      '      }',
      '    </style>',
      '    <title>Impresion de Etiquetas</title>',
      '  </head>',
      '  <body>',
      ].join('\n');
    printContents += document.getElementById('printableArea').innerHTML;
    printContents += [
      '    <br/>',
      '  </body>',
      '</html>',
      ].join('\n');
    var popupWin = window.open("", "_blank");
    popupWin.document.open();
    popupWin.document.write(printContents);
    popupWin.print();
    popupWin.close();

    // $location.path('/');
    $rootScope.flashMessage = "El contador ha incrementado en "+$rootScope.label.quantity+" su valor. De "+($rootScope.labelsDB.counter - $rootScope.label.quantity)+" a cambiado a "+$rootScope.labelsDB.counter+".";
  }
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
  $rootScope.showPrintLabelBtn = false;

  $http.get(dbURL + 'index.json', { cache: false })
    .success(function(data, status) {
      angular.forEach(data.labels, function(value, key) {
        value.quantity  = 1;
        value.made_date = new Date();
        value.model_id  = parseInt(value.model.substr(6,3));
      });
      $rootScope.labels = data.labels;
    })
    .error(function(data, status) {
      console.log(status);
    });
}])

.controller('labelsCtrlPrint', ['$rootScope', '$scope', '$filter', '$routeParams', function($rootScope, $scope, $filter, $routeParams) {
  var labelModel = $routeParams.labelModel;

  $scope.findLabel = function(labelModel) {
    var label;
    angular.forEach( $rootScope.labels, function(value, key) {
      if ( label === undefined ) {
        if ( value.model === labelModel ) {
          label = value;
        }
      }
    })
    return label;
  }

  $rootScope.showPrintLabelBtn = true;
  $rootScope.label;
  $rootScope.label = $scope.findLabel(labelModel);

  $scope.dbURL = dbURL;
  $scope.labels2print = new Array;

  for (var i = $rootScope.label.quantity - 1; i >= 0; i--) {
    $rootScope.labelsDB.counter++;
    $scope.labels2print.push({ counter: $rootScope.labelsDB.counter });
  }
}]);