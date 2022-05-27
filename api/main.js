
'use strict';


console.clear();


const express = require('express');
const { init: initDB } = require('./db');


const app = express();

// middlewares
const cors = require('cors');

const corsOptions = {
	origin: "*",
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	preflightContinue: false,
	optionsSuccessStatus: 200,
	credentials: true,
	allowedHeaders: 'Content-Type,openstack-xavisoft-auth-token',
	exposedHeaders: 'openstack-xavisoft-auth-token'
}

app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

app.use(express.json());

// routes
const systemData = require('./system-data');

app.use('/api/system-data', systemData);


const PORT = process.env.PORT || 8080;

(async function() {

	await initDB();

	app.listen(PORT, function() {
		console.log('Server started at PORT', PORT);
	});
})();