
const mongoose = require('mongoose');
const { Schema } = mongoose;


const StatusSchema = new Schema({
	water_level: Number,
	inflow_rate: Number,
	outflow_rate: Number,
	created_at: {
		type: Number,
		default: Date.now
	}
});

const Status = mongoose.model('Status', StatusSchema);
module.exports = Status;