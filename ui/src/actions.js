

import store from './store';
import axios from 'axios';


async function fetchData() {

	const response = await axios.get('/api/system-data');
	const { data } = response;

	const action = {
		type: 'update-data',
		payload: data
	}

	store.dispatch(action);

}


const actions = {
	fetchData
}

export default actions;