'use strict';

// Declare app level module which depends on views, and components
angular.module('TagGenApp', [
  'ngRoute',
  'TagGenApp.view1',
  'TagGenApp.view2',
  'TagGenApp.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
