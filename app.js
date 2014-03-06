var express = require('express'),
  http = require('http'),
  path = require('path'),
  // midi = require('./node-midi/midi'),
  us = require('underscore');


var app = module.exports = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server, {log: false});

app.use(express.static(path.join(__dirname, 'public')));

var port = process.env.PORT || 5000;

/* Listen */
server.listen(port);

// Set up a new input.
// var input = new midi.input();

// Configure a callback.
var i = 0;
var deltas = [];
// input.on('message', function(deltaTime, message) {

// 		if(message[0] === 248){
// 			deltas.push(deltaTime);
// 			i++;
// 			if(i === (24 * 2)){
// 				var avgDeltas = us.reduce(deltas, function(memo, num){ return memo + num; }, 0) / deltas.length;
// 				var avgDeltasMs = (1/avgDeltas) * 10;
				
// 				io.sockets.emit("currentBeatDelta", {freq: avgDeltasMs});
// 				i=0;
// 				deltas = [];
// 				console.log("Average", avgDeltasMs);
// 			}
// 		} else {
// 			i =0;
// 		}
// });

setInterval(function(){
	io.sockets.emit("currentBeatDelta", {freq: 1000});
	console.log("Blalalala");
}, 10000)

io.sockets.on('connection', function(socket){

	console.log('Connection');

	socket.on('ping', function(){
		console.log("Receiving ping");
		socket.emit('pong');
	});
});

// Create a virtual input port.
// input.openVirtualPort("midiPad");

// input.ignoreTypes(false, false, false);

//input.closePort();