
console.clear();


function random(min, max) {

	min = parseInt(min);
	max = parseInt(max)

	const diff = max - min;
	return  min + 1 + parseInt(Math.random() * diff);
}

function twoDigits(n) {

	if (n < 10)
		return `0${n}`;

	return n;

}

function formatDate(date) {

	const y = date.getFullYear();
	let m = date.getMonth() + 1;
	let d = date.getDate();

	d = twoDigits(d);
	m = twoDigits(m);

	return `${y}-${m}-${d}`; 

} 


const NUMBER_OF_DAYS = 300;
const WEEK_DAY_MEAN = 150;
const WEEKEND_DAY_MEAN = 200;
const DAY_MILLIS = 24 * 3600 * 1000;




function cookData() {

	const data = [];
	let time = Date.now() - DAY_MILLIS * (NUMBER_OF_DAYS);


	console.log('Generating data...');

	for (let i = 0; i < NUMBER_OF_DAYS; i++) {

		const date = new Date(time);
		const day = date.getDay();

		const isWeekend = day > 4;
		let value;

		if (isWeekend)
			value = WEEKEND_DAY_MEAN + random(-3, 3);
		else
			value = WEEK_DAY_MEAN + random(-3, 3);

		// value = random(0, 200);

		data.push({
			date: formatDate(date),
			usage: value
		});

		time += DAY_MILLIS;

	}

	return data;
}



module.exports = {
	cookData
}
