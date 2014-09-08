'use strict';

// Declare app level module which depends on views, and components
angular.module('LabelGeneratorApp', [
  'ngRoute',
  'LabelGeneratorApp.labels',
  'LabelGeneratorApp.view2',
  'LabelGeneratorApp.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/labels'});
}]);
