
// import AppWrapper, { Route } from '@xavisoft/app-wrapper';
import { Routes, HashRouter as Router, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard';
import Splashscreen from './pages/Splashscreen';
import Login from './pages/Login'
import Navbar from './components/Navbar';
import { Provider } from 'react-redux';
import store from './store';

import './App.css';


import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);



function App() {
	return (
		
		<Provider store={store}>

			<Navbar />

			<Router>
        <Routes>
          <Route exact path="/" element={<Splashscreen />} />
          <Route exact path="/dashboard" element={<Dashboard />} />
          <Route exact path="/login" element={<Login />} />
        </Routes>
    	</Router>
		</Provider>
	);
}

export default App;
