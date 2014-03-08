'use strict';

var module = angular.module('midiPad', ['midiPadServices']);

module.controller('TouchCtrl', function($scope, TouchService){
	
	$scope.$watch(function(){
		return TouchService.rotation;
	}, function(newValue){
		var rot = Math.abs(newValue - 150);
		$scope.rotation = Math.round((rot / 360) * 255);
	});

	$scope.$watch(function(){
		return TouchService.center;
	}, function(newValue){

		var x = Math.round((newValue.pageX / document.width) * 255);
		var y = Math.round((newValue.pageY / document.height) * 255);

		$scope.center = {x: x, y:y};
		
	});

});