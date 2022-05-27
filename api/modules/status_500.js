

module.exports = function(err, res) {
	res.status(500).send('Something bad happened.');
	console.log(err);
}