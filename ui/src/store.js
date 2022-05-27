
import { createStore } from 'redux';
import reducer from './reducer';

const initialStore = {};

export default createStore(reducer, initialStore);