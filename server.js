const fs = require('fs');
const http = require('http');
const express = require('express');


const app = express();
const server = http.createServer(app);

const io = require("socket.io")(server, {
	cors: {
	  origin: "*",
	  methods: ["GET", "POST"],
	  allowedHeaders: ['Content-Type', 'Authorization'],
	  credentials: true
	}
  });
const bodyParser = require('body-parser');

//const io = socketIO(server);
const port = process.env.PORT || 3000;

// Headers needed so data is in the correct order to be appended to the csv file (from a json) (also its faster this way trust me)
const airmarHeaders = {'rate-of-turn': 0,'Latitude': 1,'Latitude-direction': 2,'Longitude': 3,'Longitude-direction': 4,'track-degrees-true': 5,'track-degrees-magnetic': 6,'speed-knots': 7,'speed-kmh': 8,'outside-temp': 9,'atmospheric-pressure': 10,'magnetic-sensor-heading': 11,'magnetic-deviation': 12,'magnetic-deviation-direction': 13,'magnetic-variation': 14,'magnetic-variation-direction': 15,'wind-angle-true': 16,'wind-speed-true-knots': 17,'wind-speed-true-meters': 18,'wind-angle-relative': 19,'wind-speed-relative-meters': 20,'roll': 21,'pitch': 22};
const trimtabHeaders = {'state': 0,'angle': 1};
const rcHeaders = {'state1': 0,'ballast': 1,'rudder': 2,'manual': 3,'state2': 4};

app.use(bodyParser.json()); //pre parse request bodys into jsons
app.use(express.static('public')); // only expose files in public folder

let countData = true;  // variable to not record too much data
let dataTimeDiff = 200; // holds the amount of time for saving trim tab or rc reciever data
let writing = false; // whether or not we are currently writing to a csv file


// callback for the '/boat' url that recieves data and sends it out to all of the browser clients while addting the data to respective database
app.post('/boat', (req, res) => {

	let data = req.body; // pulls data, from http request. Is assumed to be sent in a json format and is preprocessed with bodyparser
	//console.log("data:");
	//console.log(data);

	// saves the airmar data, it is just checking if these keys are in the json because there are rc and trim tab data as well
	if (data.hasOwnProperty('currentHeading'))
	{
		console.log("MAG HEADING - GET");
		io.to('clients').emit('updateMagHeading', req.body); // emits to client data about CURRENT HEADING
	}

	if (data.hasOwnProperty('apparentWind'))
	{
		console.log("APP. WIND - GET");
		console.log(data);
		io.to('clients').emit('updateApparentWind', req.body); // emits to client data about APPARENT WIND DIRECTION/SPEED
	}
	if (data.hasOwnProperty('trueWind'))
	{
		console.log("TRUE WIND - GET");
		//console.log("data:");
		console.log(data);
		io.to('clients').emit('updateTrueWind', req.body); // emits to client data about TRUE WIND DIRECTION/SPEED
	}
	if (data.hasOwnProperty('pitchroll'))
	{
		console.log("PITCH  & ROLL - GET");
		io.to('clients').emit('updatePitchRoll', req.body); // emits to client data about PITCH AND ROLL
	}
	//TODO - add more updates for each type of input.

	if (data.hasOwnProperty('boatSpeedKnots') || data.hasOwnProperty('track-degrees-true'))
	{
		console.log('BOAT SPEED - GET')
		console.log(data.boatSpeedKnots);
		io.to('clients').emit('updateBoatSpeed', req.body); // emits to client data about THE BOATS SPEED IN KNOTS
	}
	if (data.hasOwnProperty('voltageDiscrete'))
	{
		console.log("HULL VOLTAGE - GET");
		io.to('clients').emit('updateHullBattery', req.body); // emits to client data about HULL BATTERY
	}
	if (data.hasOwnProperty('Latitude-direction') || data.hasOwnProperty('Latitude') || data.hasOwnProperty('Longitude')){
		console.log("LAT/LONG - GET");
		//console.log("data:");
		console.log(data);
		io.to('clients').emit('updateGPS', req.body); // emits to client data about GPS POSITION
		// COMMENTED OUT BY JARIUS ON 4/5/2022 --- io.to('clients').emit('updateAirmarDash', req.body); // emits to airmar client data
		// COMMENTED OUT BY JARIUS ON 4/5/2022 --- updateDashboard is TOO BROAD!! -- io.to('clients').emit('updateDashboard', req.body); // emits to airmar client data
		addToDB(data, 'airmarOut.csv', airmarHeaders); // update airmar db
	} 

	if (countData && !writing) {
		countData = false;
		
		if (data.hasOwnProperty('state')) { // only pulls data that is from the trim tab
			writing = !writing; // currently writing
			io.to('clients').emit('updateTrimDash', req.body); // emit to clients with trim tab data (not currently used)
			addToDB(data, 'trimtabOut.csv', trimtabHeaders); // saved to trim tab db
		}
		else if (data.hasOwnProperty('state1')) { // only pulls data that is from the rc controller
			writing = !writing; // currently writing
			io.to('clients').emit('updateSerialControls', req.body); // emits to clients with rc data
			addToDB(data, 'rcInput.csv', rcHeaders); // save to rc db
		}

		setTimeout(() => countData = true, dataTimeDiff); // resets countData after time interval
	}
	//res.send(200); // sends ok back
	res.sendStatus(200); // sends ok back
});

// Inits Socket Connection from each client
io.on('connection', (socket) => {
	// If designated as a client, socket is sent to a room where the data will be emitted once recieved
	socket.on('client', () => {
		socket.join('clients');
		console.log("New Client.");
	});

	// once data is recieved emits to all clients in clients room
	socket.on('data', (data) => {
		var today = new Date();
		var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
		console.log(time)
		console.log(data);
		io.to('clients').emit('updateDashboard', data);
		addToDB(data);
	});
});


// Function that will add to a database for each different data type
//		data - data to be saved in json format, file - file to save data, headers - headers of file so csv can be correctly ordered
const addToDB = async (data, file, headers) => {
	/*   --- COMMENTED OUT BY JARIUS ON 4/5/2022 FOR TESTING. ---
	if (headers==null)
	{
		//do nothing
		return 0;
	}
	let out = Object.keys(headers).map((val) => 0); // save an array with length of headers and default value to 0
	Object.entries(data).forEach((entry, ind) => out[headers[entry[0]]] = entry[1]); // set each value at corresponding header location
	fs.appendFile(file, ['\n' + getDateTime(), ...Object.values(out)], (err) => // appends to csv with organized data w date time
		{if(!err) writing = false}); // allows function to be called again once writing is complete without errors
		*/
}

// just returns the current date time formatted
const getDateTime = () => {
	let currentdate = new Date();
	return currentdate.getDate() + "/"+ (parseInt(currentdate.getMonth()) + 1)
	   + "/" + currentdate.getFullYear() + " "  
	   + currentdate.getHours() + ":"  
	   + currentdate.getMinutes() + ":" + currentdate.getSeconds();
}


// Server listen function
server.listen(port, () => console.log('Listening on port: ' + port));