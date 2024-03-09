import { combineReducers } from 'redux';
import menu from './menu';
import snackbar from './snackbar';

const reducers = combineReducers({
  menu,
  snackbar
});

export default reducers;
