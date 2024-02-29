//establish connection successfully
function establishConnection(ws_url) {
	const device = new WebSocket(ws_url);
	device.binaryType = 'arraybuffer';
	device.onopen = (event) => {
		console.log("cnxn open\n" + String(event.data));
		//authenticate webREPL
		device.send("sugadik\r");
	}
	device.onmessage = function (event) {
		var ret = String(event.data);
		console.log("rxd- "+ret);
	}
	return device;
}

function progamDevice(device, mpy_code) {
	//send character by character
	for (let index = 0; index < mpy_code.length; index++) {
		var chr = mpy_code[index];
		if (chr==='\n') {
			chr = '\r';
		}
		device.send(chr);
	}
}

//get mpy code and send
	//wait for ">>>" or "..." before sending each line