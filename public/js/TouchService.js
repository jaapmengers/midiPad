var app = angular.module('midiPadServices', []);
app.service('TouchService', ['$rootScope', 'socket', function($rootScope, socket){

	var me = { 
		color: {
			r: 0,
			g: 0,
			b: 0
		}
	};

	var element =  document.getElementById('main');

	Hammer(element).on('rotate', function(event){

		var center = event.gesture.center;
		var rot = Math.abs(event.gesture.rotation - 150);
			
		me.color.r = Math.round((rot / 360) * 255);
		me.color.g = Math.round((center.pageX / document.width) * 255);
		me.color.b = Math.round((center.pageY / document.height) * 255);

		$rootScope.$apply();
		event.gesture.preventDefault();
	});

	Hammer(element).on('release', function(event){
		socket.emit('updateColor', me.color);
	});

	return me;
}]);