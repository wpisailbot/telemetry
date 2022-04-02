const socket = io("http://localhost:3000/"); 
// const socket = io(); 

// inits the socket connection and joins the room for client in the server, also creates an event handler
// 	for when data is recieved

const socketInit = () => {
    const ease = d3.easeElasticOut;
    console.log('ready to be a socket....');
	
    socket.emit('client');
	

    // Creates callback for when data is recieved from the server (updates all the page components)
	socket.on('updateDashboard', (data) => {
		console.log("SAILGOAT Dashboard is Connected.");
		console.log(data);
    /********** Apparent Wind **********/
        let appSpeed = (data.apparentWind.speed ? data.apparentWind.speed : 60);
        let appDirection = (data.apparentWind.direction ? data.apparentWind.direction : 0);
        let appOldAngle = document.querySelector('#apparentWindVectorLine').transform.baseVal[0].angle;
        let appX = appSpeed * Math.cos(0 * (Math.PI / 180));
        let appY = appSpeed * Math.sin(0 * (Math.PI / 180));


	// 	let appSpeed = (data['wind-speed-relative-meters'] ? data['wind-speed-relative-meters'] : 60);
	// 	let appDirection = (data['wind-angle-relative'] ? data['wind-angle-relative'] : 0);
 	//	let appOldAngle = document.querySelector('#apparentWindVectorLine').transform.baseVal[0].angle;
	// 	let appX = appSpeed * Math.cos(0 * (Math.PI / 180));
	// 	let appY = appSpeed * Math.sin(0 * (Math.PI / 180));
        
        // sets the correct Length of the Vector at the 0 angle
	  	d3.select('#apparentWindVectorLine')
	    	.attr('x1', (30 - appX/2).toString())
	    	.attr('y1', (30 - appY/2).toString())
	    	.attr('x2', (30 + appX/2).toString())
	    	.attr('y2', (30 + appY/2).toString());

	    // Sets the trnsition from the vector's oldAngle to the new angle
	  	d3.select('#apparentWindVectorLine')
            .transition()
            .duration(1000)
            .ease(d3.easeElasticOut, 1, 0.9)
            .attrTween("transform", () => d3.interpolateString('rotate('+ appOldAngle +', 30, 30)', 'rotate('+ -appDirection +', 30, 30)'));

        // d3.select('#apparentWindAngle')
        //     .transition()
        //     .duration(1000)
        //     .ease(d3.easeElasticOut,1,0.9)
        //     .tween("text", (d) => {
        //         var i = d3.interpolateString(d3.select('#apparentWindAngle').text(), data.appDirection)
        //         return (t) => Math.round(i(t));
        //     });

		document.querySelector('#apparentWindAngle').innerHTML = appDirection;
		document.querySelector('#apparentWindMag').innerHTML = appSpeed;

	// /********** Theoretical Wind **********/

        let theoSpeed = (data.trueWind.speed ? data.trueWind.speed : 60);
        let theoDirection = (data.trueWind.direction ? data.trueWind.direction : 0);
        let theoOldAngle = document.querySelector('#theoreticalWindVectorLine').transform.baseVal[0].angle;
        let theoX = theoSpeed * Math.cos(0 * (Math.PI / 180));
        let theoY = theoSpeed * Math.sin(0 * (Math.PI / 180));
        
        // sets the correct Length of the Vector at the 0 angle
        d3.select('#theoreticalWindVectorLine')
            .attr('x1', (30 - theoX/2).toString())
            .attr('y1', (30 - theoY/2).toString())
            .attr('x2', (30 + theoX/2).toString())
            .attr('y2', (30 + theoY/2).toString());

        // Sets the trnsition from the vector's oldAngle to the new angle
        d3.select('#theoreticalWindVectorLine')
            .transition()
            .duration(1000)
            .ease(d3.easeElasticOut, 1, 0.9)
            .attrTween("transform", () => d3.interpolateString('rotate('+ theoOldAngle +', 30, 30)', 'rotate('+ -theoDirection +', 30, 30)'));

        document.querySelector('#theoreticalWindAngle').innerHTML = theoDirection;
        document.querySelector('#theoreticalWindMag').innerHTML = theoSpeed;
    
    // /********** INTENDEAD HEADING  -- 2022 NEW - TBD**********/

    //let theoSpeed = (data.theoreticalWind.speed ? data.theoreticalWind.speed : 60);
    magnitude = 24;
    let intendedHeading = (data.intendedHeading ? data.intendedHeading : 0);
    let IHoldAngle = document.querySelector('#intendedHeadingVectorLine').transform.baseVal[0].angle;
    let intendedHeading_x = magnitude * Math.cos(0 * (Math.PI / 180));
    let intendedHeading_y = magnitude * Math.sin(0 * (Math.PI / 180));
    
    // sets the correct Length of the Vector at the 0 angle
    d3.select('#intendedHeadingVectorLine')
        .attr('x1', (30 - intendedHeading_x/2).toString())
        .attr('y1', (30 - intendedHeading_y/2).toString())
        .attr('x2', (30 + intendedHeading_x/2).toString())
        .attr('y2', (30 + intendedHeading_y/2).toString());

    // Sets the trnsition from the vector's oldAngle to the new angle
    d3.select('#intendedHeadingVectorLine')
        .transition()
        .duration(1000)
        .ease(d3.easeElasticOut, 1, 0.9)
        .attrTween("transform", () => d3.interpolateString('rotate('+ IHoldAngle +', 30, 30)', 'rotate('+ -intendedHeading +', 30, 30)'));

    document.querySelector('#intendedHeadingAngle').innerHTML = intendedHeading;
    //  ignore document.querySelector('#theoreticalWindMag').innerHTML = theoSpeed;

    // /********** MAG. HEADING  -- 2022 NEW - TBD**********/

    //let theoSpeed = (data.theoreticalWind.speed ? data.theoreticalWind.speed : 60);
    //magnitude = 24;
    let magneticHeading = (data.currentHeading ? data.currentHeading : 0);
    let MHoldAngle = document.querySelector('#currentHeadingVectorLine').transform.baseVal[0].angle;
    let magneticHeading_x = magnitude * Math.cos(0 * (Math.PI / 180));
    let magneticHeading_y = magnitude * Math.sin(0 * (Math.PI / 180));
    
    // sets the correct Length of the Vector at the 0 angle
    d3.select('#currentHeadingVectorLine')
        .attr('x1', (30 - magneticHeading_x/2).toString())
        .attr('y1', (30 - magneticHeading_y/2).toString())
        .attr('x2', (30 + magneticHeading_x/2).toString())
        .attr('y2', (30 + magneticHeading_y/2).toString());

    // Sets the trnsition from the vector's oldAngle to the new angle
    d3.select('#currentHeadingVectorLine')
        .transition()
        .duration(1000)
        .ease(d3.easeElasticOut, 1, 0.9)
        .attrTween("transform", () => d3.interpolateString('rotate('+ MHoldAngle +', 30, 30)', 'rotate('+ -magneticHeading +', 30, 30)'));

    document.querySelector('#currentHeadingAngle').innerHTML = magneticHeading;
    //  ignore document.querySelector('#theoreticalWindMag').innerHTML = theoSpeed;
	// /********** Compass **********/ 

		// .attr('transform', 'rotate(' + Math.atan2(data.compass.y, data.compass.x) * (180/Math.PI) + ', 50, 50) translate(17, 16) scale(0.30)');
	d3.select('#compassBoat')
            .transition()
            .duration(1000)
            .ease(d3.easeElasticOut, 1, 0.9)
            //.attrTween("transform", () => d3.interpolateString('rotate('+ document.querySelector('#compassBoat').transform.baseVal[0].angle +', 50, 50) translate(17, 16) scale(0.30)', 'rotate('+ data['magnetic-sensor-heading'] * (180/Math.PI) +', 50, 50) translate(17, 16) scale(0.30)'));
            //.attrTween("transform", () => d3.interpolateString('rotate('+ document.querySelector('#compassBoat').transform.baseVal[0].angle +', 50, 50) translate(17, 16) scale(0.30)', 'rotate('+ -Math.atan2(data.compass.y, data.compass.x) * (180/Math.PI) +', 50, 50) translate(17, 16) scale(0.30)'));
            .attr('transform', 'rotate(' + Math.atan2(data.compass.y, data.compass.x) * (180/Math.PI) + ', 50, 50) translate(17, 16) scale(0.30)');

	// /*** Air Temp **********/

	//    // airtemp.updateGauge(data['outside-temp'] ? data['outside-temp'] : 0);

	// /*** Wind Chill **********/

 //    	// windchill.updateGauge(data.windchill ? data.windchill : 0);

	// /********** Barometric Pressure **********/

	//    // pressure.updateGauge(data.pressure ? data.pressure : 950);
	

	// /********** Pitch and Roll **********/

		// .attr('transform', 'rotate('+ (data.pitchroll.roll ? data.pitchroll.roll : 30) +' 65, 65)');
        // d3.select('#compassBoat')
    	d3.select('#rollIndicator')
            .transition()
            .duration(1000)
            .ease(d3.easeElasticOut, 1, 0.9)
            .attrTween("transform", () => d3.interpolateString('rotate('+ document.querySelector('#rollIndicator').transform.baseVal[0].angle +', 65, 65)', 'rotate('+ (data.pitchroll.roll ? data.pitchroll.roll : 30) +' 65, 65)')); 
        d3.select('#pitchIndicator')
            .transition()
            .duration(1000)
            .ease(d3.easeElasticOut, 1, 0.9)
            .attrTween("transform", () => d3.interpolateString('translate(0, '+ (document.querySelector('#pitchIndicator').transform.baseVal[0].matrix.f) +')', 'translate(0, '+ (data.pitchroll.pitch ? data.pitchroll.pitch : 0) +')'));
    	// d3.select('#pitchIndicator')
    	// 	.attr('transform', 'translate(0, '+ (data.pitchroll.pitch ? data.pitchroll.pitch : 0) +')');

	// /********** Ground Speed **********/

     	groundspeed.updateGauge(data.groundspeed ? data.groundspeed : 0);
    	
	// /********** Rate Gyro **********/

    	document.querySelector('#phi').innerHTML = data.gyro.phi ? data.gyro.phi : 0;
    	document.querySelector('#theta').innerHTML = data.gyro.theta ? data.gyro.theta : 0;
    	document.querySelector('#psi').innerHTML = data.gyro.psi ? data.gyro.psi : 0;

    // /********** Electronics Status **********/

    document.querySelector('#voltage').innerHTML = data.hullVoltage ? data.hullVoltage + " V" : 0 + " V";
    document.querySelector('#trimtab-voltage').innerHTML = data.trimtabVoltage ? data.trimtabVoltage + " V" : 0 + " V";
    
    //document.querySelector('#theta').innerHTML = data.gyro.theta ? data.gyro.theta : 0;
    //document.querySelector('#psi').innerHTML = data.gyro.psi ? data.gyro.psi : 0;

	/********** Relative Humidity **********/

    	// document.querySelector('#humidityVal').innerHTML = (data.groundspeed ? data.groundspeed : 0) + '%';

	/********** GPS **********/

        if (data.gps.hasOwnProperty('longitude') || data.gps.hasOwnProperty('latitude'))
        {   
            console.log("Lat/Long: " + data.gps.latitude + ", " + data.gps.longitude);      //added .gps
            boatPath.getPath().push(new google.maps.LatLng(data.gps.latitude, data.gps.longitude));
        }

	});
    
    socket.on('updateTrimDash', (data) => {
        
    });

    socket.on('updateSerialControls', (data) => {
        
    });
};
