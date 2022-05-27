
const mongoose = require('mongoose');
const Status = require('./Status');
const Daily = require('./Daily');

const password = encodeURIComponent('coolFEB&#16');
// console.log(password);

if (process.env.NODE_ENV === 'production') 
	mongo_url = `mongodb+srv://water-management:${password}@cluster0.mmpvp.mongodb.net/water-management?retryWrites=true&w=majority`;
else
	mongo_url = 'mongodb://localhost:27017/water-leakage';

async function init() {
	await mongoose.connect(mongo_url);

	const count = await Status.countDocuments();

	if (count === 0) {
		await Status.create({
			water_level: 0,
			inflow_rate: 0,
			outflow_rate: 0,
		});
	}
}


module.exports = {
	Daily,
	Status,
	init,
}