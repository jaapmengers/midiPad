'use strict';

var app = angular.module('midiPadApp', ['midiPadControllers']);

var midiPadControllers = angular.module('midiPadControllers', []);

midiPadControllers.controller('MidiPadCtrl', ['$scope', 'socket', function ($scope, socket) {
	$scope.bpm = 100;
	$scope.deltaT = 0;

	var count = 0;

	var interval;

	socket.on('currentBpm', function(data){	
		//$scope.bpm = Math.round(data.bpm * 100) / 100;
		var curDate = new Date().getTime();

		var beatFrequencyInMs = (1 / (data.bpm / 60)) * 1000;

		var deltaT = curDate - data.date;
		var nextStartpointFromNow = 0;
		if(deltaT > 0){
			if(deltaT > beatFrequencyInMs) {
				nextStartpointFromNow = deltaT % beatFrequencyInMs;
			} else {
				nextStartpointFromNow = beatFrequencyInMs % deltaT;
			}
		}

		setTimeout(function(){
			clearInterval(interval);
			interval = setInterval(function(){
				$scope.color = true;
				$scope.$apply();
				setTimeout(function(){
					$scope.color = false;
					$scope.$apply();
				}, beatFrequencyInMs/3);				
			}, beatFrequencyInMs);
		}, nextStartpointFromNow);
	});
}]);
