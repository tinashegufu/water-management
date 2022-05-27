import AppBar from '@mui/material/AppBar';
import Component from '@xavisoft/react-component';
import WaterIcon from '@mui/icons-material/Opacity';



function setNavbarDimensions() {
	const navbarHeight = document.getElementById('appbar').offsetHeight + 'px'
	document.documentElement.style.setProperty('--navbar-height', navbarHeight);
}

class Navbar extends Component {


	componentDidMount() {
		window.addEventListener('resize', setNavbarDimensions);
		setNavbarDimensions();

	}

	render() {

		return <AppBar style={{ padding: 10, position: 'fixed' }} id="appbar">
			<div style={{ textAlign: 'center' }}>
				<WaterIcon fontSize="large" className="rotate" />
			</div>
		</AppBar>
	}
}

export default Navbar;