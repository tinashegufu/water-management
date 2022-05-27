
const { Status, Daily } = require('./db');
const { getDayStartTimestamp } = require('./utils');
const CSV = require('objects-to-csv');
const { exec } = require('child_process');
const { cookData } = require('./simulation'); 



function calculatePeriodWaterUsage(start, end) {

	const period = Math.abs(end.time - start.time) / 60000;
	const averageOutflowRate = (start.outflow_rate + end.outflow_rate) / 2;

	console.log(start, end);
	return period * averageOutflowRate;

}

async function calculateTodayWaterUsage() {

	// build query
	const todayMidnight = getDayStartTimestamp();
	const query = {
		created_at: {
			$gte: todayMidnight
		}
	}

	// run query
	const statuses = await Status.find(query, "created_at outflow_rate");

	// iterate the data
	if (statuses.length === 0)
		return 0;

	let { created_at:prevTimestamp, outflow_rate:prevOutflowRate } = statuses[0]; 

	if (statuses.length === 1) {
		// needs revision
		const start = { time: todayMidnight, outflow_rate: prevOutflowRate };
		const end = { time: prevTimestamp, outflow_rate: prevOutflowRate };
		return calculatePeriodWaterUsage(start, end);
	}


	let totalUsage = 0;

	for (let i = 1; i < statuses.length; i++) {

		const { created_at, outflow_rate } = statuses[i];
		const start = { time: prevTimestamp, outflow_rate: prevOutflowRate };
		const end = { time: created_at, outflow_rate }; 
		totalUsage += calculatePeriodWaterUsage(start, end);

		prevTimestamp = created_at;
		prevOutflowRate = outflow_rate;


	}

	return totalUsage;

}


function runPythonPredection() {

	return new Promise((resolve, reject) => {

		const pyFile = `${__dirname}/ml.py`;

		exec(`python3 ${pyFile}`, function(err, stdout, stderr) {

			if (err)
				return reject(err);

			console.warn(stderr);
			resolve(parseFloat(stdout.trim()));

		});
	});
}


async function predictTodayWaterUsage() {

	// get past data
	let data = await Daily.find({}, 'usage date -_id').sort({ $natural: -1 }).limit(210);
	
	// console.log(data[0]);
	// throw "Under maintenance"

	data = data.map(datum => {
		const { usage, date } = datum;
		return { usage, date }
	})

	data.reverse()

	// save to csv
	const csv = new CSV(data);
	await csv.toDisk(__dirname + '/data.csv');

	// create model and prediction
	return await runPythonPredection();
}


async function init() {

	// cook data if no past data is available
	const documentCount = await Daily.countDocuments();

	if (documentCount === 0) {
		const data = cookData();
		await Daily.insertMany(data);
	}

}


module.exports = {
	calculateTodayWaterUsage,
	predictTodayWaterUsage,
	init
}