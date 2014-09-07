'use strict';

angular.module('LabelGeneratorApp.version', [
  'LabelGeneratorApp.version.interpolate-filter',
  'LabelGeneratorApp.version.version-directive'
])

.value('version', '0.1');
