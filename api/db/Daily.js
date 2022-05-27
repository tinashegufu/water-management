

const mongoose = require('mongoose');
const { Schema } = mongoose;


const DailySchema = new Schema({
	usage: {
		type: Number,
		required: true
	},
	date: {
		required: true,
		type: String
	}
});

const Daily = mongoose.model('Daily', DailySchema);
module.exports = Daily;