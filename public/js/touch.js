'use strict';

var module = angular.module('midiPad', ['midiPadServices']);

module.controller('TouchCtrl', function($scope, TouchService){
	
	$scope.$watch(function(){
		return TouchService.color;
	}, function(newValue){
			
			$scope.r = newValue.r;
			$scope.g = newValue.g;
			$scope.b = newValue.b;
	}, true);

});