var midi = require('./node-midi/midi');

// Set up a new input.
var input = new midi.input();

// Configure a callback.
var i = 0;
var totalTime = 0;
input.on('message', function(deltaTime, message) {

		if(message[0] === 248){
			i++;
			if(i === (24)){
				var bpm = (1/deltaTime / 24) * 60;
				i=0;
				console.log(bpm);
			}
		} else {
			i = 0;
			console.log(message[0]);
		}

    // if(i < 24){
    // 	totalTime += deltaTime;
    // 	i++;
    // } else {
  		// console.log(totalTime);
  		// totalTime = 0;
  		// i = 0;
    // }
});

// Create a virtual input port.
input.openVirtualPort("midiPad");

input.ignoreTypes(false, false, false);

// A midi device "Test Input" is now available for other
// software to send messages to.

// ... receive MIDI messages ...

// Close the port when done.
//input.closePort();