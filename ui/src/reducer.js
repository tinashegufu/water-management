

function updateDataReducer(state, payload) {

	const data = { ...state.data, ...payload };
	return { ...state, data };
}



export default function reducer(state, action) {

	const { type, payload } = action;

	switch (type) {

		case 'update-data':
			return updateDataReducer(state, payload);

		default:
			return state;
	}

}