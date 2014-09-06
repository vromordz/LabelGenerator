'use strict';

angular.module('TagGenApp.version', [
  'TagGenApp.version.interpolate-filter',
  'TagGenApp.version.version-directive'
])

.value('version', '0.1');
