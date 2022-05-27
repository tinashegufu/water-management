

import Grid from '@mui/material/Grid';
import Component from '@xavisoft/react-component';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { css } from '@emotion/css';


const gridItemStyle = css({
	'--side-margin': '10px',
	'& b': {
		margin: '0 var(--side-margin)',
		fontSize: 25
	},
	'& input': {
		background: 'grey',
		color: 'white',
		border: 'none',
		margin: '0 var(--side-margin)',
		width: 'calc(100% - 2 * var(--side-margin))',
		boxShadow: '0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2)',
		padding: '5px 0',
		textAlign: 'center',
		cursor: 'pointer'
	}
});


class DatetimeRangePicker extends Component {


	state = {
		values: {}
	}


	constructor(...args) {

		super(...args);

		this.updateFrom = this.updateFrom.bind(this);
		this.updateTo = this.updateTo.bind(this);

	}


	updateParent() {

		if (!this.props.onChange) 
			return;

		const { values } = this.state;
		const { from=this.props.from, to=this.props.to } = values;
		this.props.onChange({ from , to });

	}


	async updateFrom(from) {

		const values = { ...this.state.values, from };
		await this.updateState({ values });
		this.updateParent();
	}

	async updateTo(to) {

		const values = { ...this.state.values, to };
		await this.updateState({ values });
		this.updateParent();
	}

	render() {

		const {
			from=this.state.values.from || new Date(),
			to=this.state.values.to || new Date(),
		} = this.props;

		return <div>
			<Grid container style={{ fontFamily: 'Arial' }}>

				<Grid item xs={6} sm={6} className={gridItemStyle}>

					<b>FROM</b>

					<br />
					<DatePicker placeholder="From" selected={from} onChange={this.updateFrom} />
				</Grid>

				<Grid item xs={6} sm={6} className={gridItemStyle}>

					<b>TO</b>
					<br />

					<DatePicker placeholder="To" selected={to} onChange={this.updateTo} />
				</Grid>

			</Grid>

		</div>

	}
}


export default DatetimeRangePicker;