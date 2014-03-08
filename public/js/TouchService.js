var module = angular.module('midiPadServices', []);
module.service('TouchService', ['$rootScope', function($rootScope){

	var me = {
		rotation: 0,
		center: {pageX: 0, pageY:0}
	};

	var element =  document.getElementById('main');

	Hammer(element).on('rotate', function(event){
		me.rotation = event.gesture.rotation;
		me.center = event.gesture.center;
		$rootScope.$apply();
		event.gesture.preventDefault();
	});

	return me;
}]);