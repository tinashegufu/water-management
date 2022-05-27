

function getDayStartTimestamp() {

	const d = new Date();
	d.setHours(0);
	d.setMinutes(0);
	d.setSeconds(0);
	d.setMilliseconds(0);

	return d.getTime();
}



let todayString = generateDayString();

function generateDayString() {

	const d = new Date();
	d.setHours(0);
	d.setMinutes(0);
	d.setSeconds(0);
	d.setMilliseconds(0);

	return d.toString();
}

function isItANewDay() {

	const str = generateDayString();

	if (str === todayString)
		return false;

	todayString = str;

	return true;


}



module.exports = {
	getDayStartTimestamp,
	isItANewDay
}