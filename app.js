var express = require('express'),
  http = require('http'),
  path = require('path'),
  midi = require('./node-midi/midi'),
  us = require('underscore');


var app = module.exports = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server, {log: false});

app.use(express.static(path.join(__dirname, 'public')));

var port = process.env.PORT || 5000;

/* Listen */
server.listen(port);

// Set up a new input.
var input = new midi.input();

// Configure a callback.
var i = 0;
input.on('message', function(deltaTime, message) {

		if(message[0] === 248){
			i++;
			if(i === (24 * 4)){
				var bpm = (1/deltaTime / 24) * 60;
				i=0;
				io.sockets.emit("currentBpm", {bpm: bpm, date: new Date().getTime()});
				console.log(bpm);
			}
		} else {
			i =0;
		}
});

// Create a virtual input port.
input.openVirtualPort("midiPad");

input.ignoreTypes(false, false, false);
//input.closePort();