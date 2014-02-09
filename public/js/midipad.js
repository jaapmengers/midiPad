'use strict';

var app = angular.module('midiPadApp', ['midiPadControllers']);

var midiPadControllers = angular.module('midiPadControllers', []);

midiPadControllers.controller('MidiPadCtrl', ['$scope', 'socket', function ($scope, socket) {


	var interval;
	var times = [];
	var tempTimes = [];
	var current

	setInterval(function(){
		if(new Date().getTime() >= _.first(times)){
			var atTime = times.shift();
			$scope.color = true;
			$scope.$apply();
			setTimeout(function(){
				$scope.color = false;
				$scope.$apply();
			}, 100)
		}
	}, 5);

	socket.on('currentBeatDelta', function(data){	
		var curDate = new Date().getTime();

		var deltaT = curDate - data.date;
		var freq = data.freq;

		$scope.$apply();

		var nextStartPointFromNow = 0;
		if(deltaT > freq){
			nextStartPointFromNow = deltaT % freq;
		} else {
			nextStartPointFromNow = freq - deltaT;
		}
		
		tempTimes = [];
		var offset = -100;
		var begin = curDate + nextStartPointFromNow + offset;
		tempTimes.push(begin);

		_(8).times(function(n){
			tempTimes.push(begin + n * freq);
		});

		var margin = freq * -0.15;
		var timesLeft = _.reject(times, function(time){
			return time >= begin + margin;
		})

		var combined = _.union(timesLeft, tempTimes);
		times = combined;
	});
}]);
