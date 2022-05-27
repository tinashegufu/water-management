

"use strict"

const Joi = require('joi');

Joi.getError = function (data, schema) {

	const isValid = Joi.object(schema).validate(data);

	if (isValid.error)
		return isValid.error.details[0].message;

	return null;

}

module.exports = Joi;