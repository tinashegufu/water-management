import Page from './Page';
import Component from '@xavisoft/react-component';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import DatetimeRangePicker from '../components/DatetimeRangePicker';
import { connect } from 'react-redux';
import actions from '../actions';
import axios from '../axios';
import { Line } from "react-chartjs-2";
import Divider from '@mui/material/Divider';

// format
function twoDigits(d) {

	if (d < 10)
		return '0' + d;

	return d.toString();

}

function formatDate(timestamp) {

	const date = new Date(timestamp);

	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();

	const m = twoDigits(date.getMinutes());
	const s = twoDigits(date.getSeconds());
	const h = twoDigits(date.getHours());

	return `${year}-${month}-${day}@${h}:${m}:${s}`;
}


class Dashboard extends Page {


	_componentDidMount() {

		this.fetchDataTimer = setInterval(this.fetchData.bind(this), 3000);
		this.fetchData();
	}


	fetchData() {
		actions.fetchData();
	}


	componentWillUnmount() {
		clearInterval(this.fetchDataTimer);
	}

	_render() {

		const data = this.props.data;
		const { water_level } = data;
		const water_level_percentage = water_level / 2000 * 100;

		return <>
			<div style={{ paddingTop: 'var(--navbar-height)' }}>


				<TankLevel level={water_level_percentage} />

				<Divider />

				<SystemData data={{ ...data, water_level_percentage }} />

				<History />

			</div>

		</>
	}
}

function mapStateToProps(state) {
	const { data={} } = state;
	return { data };
}

export default connect(mapStateToProps)(Dashboard);

function TankLevel({ level }) {

	return <div
		style={{
			margin: 20
		}}
	>
		<span
			style={{
				display: 'block',
				textAlign: 'center',
				color:'grey',
				fontSize: 30,
				marginBottom: 20
			}}
		>
			Tank Level ({level}%)
		</span>

		<div
			style={{
				border: '1px solid #ccc',
				padding: 0,
				height: 30
			}}
		>
			<div
				style={{
					background: 'var(--secondary-color)',
					height: 30,
					display: 'inline-block',
					width: `${level}%`,
					margin: 0,
					padding: 0
				}} 
			/>
		</div>
	</div>
}



function Row({ data, label }) {

	return <TableRow>

		<TableCell>
			<b>{label}</b>
		</TableCell>

		<TableCell>{data}</TableCell>
	</TableRow>
}


function SystemData(props) {

	const { data } = props;
	const { 
		outflow_rate, 
		inflow_rate, 
		leakage, 
		water_level, 
		water_level_percentage,  
		daily_usage,
		predicted_usage
	} = data;

	const level_data = `${water_level} litres (${water_level_percentage}%)`;

	let anomalyColor, anomalyCaption;

	if (daily_usage > predicted_usage * 1.05) {
		anomalyCaption = 'YES'
		anomalyColor = 'red';
	} else {
		anomalyColor = 'green';
		anomalyCaption = 'NO'
	}


	const anomalyDetectedJSX = <b style={{ color: anomalyColor }}>
		{anomalyCaption}
	</b>

	const dailyUsageJSX = `${parseInt(daily_usage)} litres`;
	const predictedUsageJSX = `${parseInt(predicted_usage)} litres`;


	return <Table>

		<TableBody>
			<Row label="Level" data={level_data} />
			<Row label="Outflow rate" data={outflow_rate} />
			<Row label="Inflow rate" data={inflow_rate} />
			<Row label="Leakage" data={ leakage ? 'YES' : 'NO' } />	
			<Row label="Daily Usage" data={dailyUsageJSX}  />
			<Row label="Predicted Usage" data={predictedUsageJSX}  />	
			<Row label="Anomaly Detected" data={anomalyDetectedJSX}  />		
		</TableBody>

	</Table>
}



class History extends Component {

	state = {
		from: (new Date()),
		to: (new Date()),
		fromTimeStamp: (new Date()).getTime(),
		toTimeStamp: (new Date()).getTime() + 24 * 3600 * 1000 + 1,
		data: {
			datasets: [],
			labels: []
		}
	}


	constructor(...args) {
		super(...args);

		this.onRangeChange = this.onRangeChange.bind(this);
	}


	async onRangeChange(values) {


		let { from, to } = values;;


		from = (new Date(from)).getTime();
		to = (new Date(to)).getTime();

		if (from === to)
			return alert('Invalid range.');

		if (from > to) {
			const temp = from;
			from = to;
			to = temp;
		}

		const toTimeStamp = to + 24 * 3600 * 1000 - 1;
		const fromTimeStamp = from;

		await this.updateState({ from, to, toTimeStamp, fromTimeStamp });
		await this.fetchData();

	}


	async fetchData() {
		const { fromTimeStamp:from, toTimeStamp:to } = this.state;

		try {

			const response = await axios.get(`/api/system-data/history?from=${from}&to=${to}`);
			const data =  this.prepareDataForChart(response.data);

			await this.updateState({ data });
		} catch (err) {
			console.log(err);

			const { response } = err;
			console.log(response);

			alert('Something bad happened.');
		}

	}


	prepareDataForChart(data) {

		const waterLevelDataset = {
			data: [],
			label: 'Water Level',
			backgroundColor: 'green',
			borderColor: 'green',
			lineTension: 0.4
		};

		const inflowRateDataset = {
			data: [],
			label: 'Inflow rate',
			backgroundColor: 'blue',
			borderColor: 'blue',
			lineTension: 0.4
		};

		const outflowRateDataset = {
			data: [],
			label: 'Outflow Rate',
			backgroundColor: 'red',
			borderColor: 'red',
			lineTension: 0.4
		};


		const labels = [];
		const datasets = [ waterLevelDataset, outflowRateDataset, inflowRateDataset ];

		console.log(data);

		data.forEach(datum => {

			const { water_level, created_at, inflow_rate, outflow_rate } = datum;
			labels.push(formatDate(created_at));

			console.log(created_at);

			outflowRateDataset.data.push(outflow_rate);
			waterLevelDataset.data.push(water_level);
			inflowRateDataset.data.push(inflow_rate);
			
		});


		return {
			datasets,
			labels
		}
	}


	componentDidMount() {
		this.fetchData();
	}



	render() {

		return <>

			<div style={{ margin: '20px 0' }}>
				<DatetimeRangePicker onChange={this.onRangeChange} from={this.state.from} to={this.state.to}/>
			</div>

			<Line data={this.state.data} />
		</>
	}
}