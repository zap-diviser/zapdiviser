import { combineReducers } from 'redux';
import menu from './menu';
import snackbar from './snackbar';
import chat from './chat';

const reducers = combineReducers({
  chat,
  menu,
  snackbar
});

export default reducers;
