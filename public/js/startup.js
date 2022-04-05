// calls once when page is first loaded
window.onload = () => {
	socketInit();

	displayVector('apparentWindVector');
	displayVector('theoreticalWindVector');
	displayVector('currentHeadingVector');
	displayVector('intendedHeadingVector');
	displayCompass('compassImage');
	displayPitchRoll('pitchrollDisp', 65);
	gaugeInit();
    initMap();

};
