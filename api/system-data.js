
const { Router } = require('express');
const { Status } = require('./db');
const status_500 = require('./modules/status_500');
const Joi = require('./modules/Joi');
const { init: initML, calculateTodayWaterUsage, predictTodayWaterUsage,  } = require('./ml');
const { isItANewDay } = require('./utils');


const systemStatus =  {
	leakage: false,
	water_level: null,
	daily_usage: 0, // probably a good idea to retrieve 
	// anomalyDetected: false,
}



async function newDayCode() {

	// return if not a new day
	if (!isItANewDay())
		return;

	systemStatus.daily_usage = 0;

	// predict water usage
	systemStatus.predictedWaterUsageValue = await predictTodayWaterUsage();
	console.log(systemStatus)
	// systemStatus.maximumExpected = systemStatus.predictedWaterUsageValue * 1.05;
	// systemStatus.anomalyDetected = false;

}



function random(max) {
	return parseInt(max * Math.random());
}


async function getSystemData(req, res) {


	try {

		// retrieve last status 
		const status = await Status.findOne().sort({ created_at: -1 }); 

		if (!status)
			return res.status(404).send();

		const { water_level, inflow_rate, outflow_rate, } = status;

		const data = {
			water_level,
			inflow_rate,
			outflow_rate,
			leakage: systemStatus.leakage,
			daily_usage: systemStatus.daily_usage,
			// anomaly_detected: systemStatus.anomalyDetected,
			predicted_usage: systemStatus.predictedWaterUsageValue
		};

		res.send(data);


	} catch (err) {
		status_500(err, res);
	}

}


async function postSystemData(req, res) {


	try {


		// validation
		const schema = {
			water_level: Joi.number().min(0).required().strict(),
			outflow_rate: Joi.number().min(0).required().strict(),
			inflow_rate: Joi.number().min(0).required().strict(),
			dated: Joi.number().strict()
		}

		const error = Joi.getError(req.body, schema);
		if (error)
			return res.status(400).send(error)

		const { water_level, inflow_rate, outflow_rate, dated } = req.body;
		const created_at = dated || Date.now();
		const data = { water_level, inflow_rate, outflow_rate, created_at }
		await Status.create(data);

		res.send();

		// detect leakage

		try {


			const { water_level, inflow_rate, outflow_rate } = data;

			if (systemStatus.water_level !== null) {

				const { 
					water_level:prevWaterLevel,
					inflow_rate: prevInflowRate,
					outflow_rate: prevOutflowRate
				} = systemStatus;

				const averageInflowRate = (prevInflowRate + inflow_rate) / 2;
				const averageOutflowRate = (prevOutflowRate + outflow_rate) / 2;
				const TIME = (Date.now() - systemStatus.lastStatusUpdate) / 60000;
				const expectedWaterDelta = (averageOutflowRate - averageInflowRate)  * TIME;

				const actualWaterLevel = water_level;
				const expectedWaterLevel = prevWaterLevel - expectedWaterDelta;

				const deviation = (actualWaterLevel - expectedWaterDelta) / expectedWaterDelta * 100;

				systemStatus.leakage = Math.abs(deviation) > 3;

				// console.log({
				// 	prevWaterLevel,
				// 	deviation,
				// 	averageInflowRate,
				// 	averageInflowRate,
				// 	expectedWaterDelta,
				// 	expectedWaterLevel,
				// 	actualWaterLevel,
				// 	leakage: systemStatus.leakage,
				// });


				// update daily water usage
				systemStatus.daily_usage += TIME * averageOutflowRate;
				console.log({
					TIME, averageOutflowRate
				})

				// if (systemStatus.daily_usage > systemStatus.maximumExpected) {
				// 	// alert user about it
				// 	systemStatus.anomalyDetected = true;
				// }

			}


			systemStatus.lastStatusUpdate = Date.now();
			systemStatus.water_level = water_level;
			systemStatus.outflow_rate = outflow_rate;
			systemStatus.inflow_rate = inflow_rate;


		} catch (err) {
			console.log(err);
		}


	} catch (err) {
		status_500(err, res);
	}

}



async function getHistory(req, res) {

	try {

		// build query
		const { to=Date.now(), from=0 } = req.query;

		const query = {
			created_at: {
				$gte: from,
				$lte: to
			}
		}

		// retrieving
		const data = await Status.find(query, 'water_level inflow_rate outflow_rate created_at');

		res.send(data);


	} catch (err) {
		status_500(err, res);
	}
}



const router = new Router();

router.get('/', getSystemData);
router.post('/', postSystemData);
router.get('/history', getHistory);


module.exports = router;


(async() => {

	await initML();

	systemStatus.predictedWaterUsageValue = await predictTodayWaterUsage();
	// systemStatus.maximumExpected = systemStatus.predictedWaterUsageValue * 1.05;
	systemStatus.daily_usage = await calculateTodayWaterUsage();
	// systemStatus.anomalyDetected = false;


	setTimeout(newDayCode, 4000);
})()