

const axios = require('axios');



function injectDomain(config) {
	config.url = 'https://water-management.herokuapp.com' + config.url;
	return config;
}


if (window.location.href.indexOf('file://') === 0)
	axios.interceptors.request.use(injectDomain);

// axios.interceptors.request.use(injectDomain);

export default axios;