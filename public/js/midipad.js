'use strict';

var app = angular.module('midiPadApp', ['midiPadControllers']);

var midiPadControllers = angular.module('midiPadControllers', []);

midiPadControllers.controller('MidiPadCtrl', ['$scope', 'socket', function ($scope, socket) {


	var interval;
	var times = [];
	var tempTimes = [];
	var timeDiffs = [];

	setInterval(function(){
		if(new Date().getTime() >= _.first(times)){
			var atTime = times.shift();
			$scope.active = true;
			$scope.$apply();
			setTimeout(function(){
				$scope.active = false;
				$scope.$apply();
			}, 100)
		}
	}, 5);

	var curDate;
	function startTime(){
		curDate = new Date().getTime();
		socket.emit('ping');
	}

	socket.on('pong', function(){
		var newDate = new Date().getTime();
		var diff = newDate - curDate;

		//Keep a running average of the last 10 response times. 
		timeDiffs = _.last(timeDiffs, 10);
		timeDiffs.push(diff/2);
	});


	//Get an initial reading of the response time between client and server
	//After that, update the average responsetime every 10 seconds.
	setInterval(function(){
		startTime();
	}, 10000);


	socket.on('changeColor', function(color){
			console.log("New color", color);
    	angular.element(document.querySelector('#adjustable')).html("body.active {background: -webkit-radial-gradient(center center, 80% 200%, rgb(" + color.r + ',' + color.g + ',' + color.b + "), black); }");
	});


	socket.on('currentBeatDelta', function(data){	

		var curDate = new Date().getTime();

		var curDiffs = timeDiffs;
		var sum = _.reduce(curDiffs, function(memo, num){ return memo + num}, 0);
		var deltaT = sum > 0 && curDiffs.length > 0 ? sum / curDiffs.length : 0;
		var freq = data.freq;

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
