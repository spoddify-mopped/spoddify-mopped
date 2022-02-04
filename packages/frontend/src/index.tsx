import './index.css';

import { applyMiddleware, createStore } from 'redux';

import App from './App';
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import ReduxThunk from 'redux-thunk';
import combineReducers from './redux/reducers';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSocketIoMiddleware from 'redux-socket.io';
import io from 'socket.io-client';
import { playerActions } from './redux/player/actions';

const ACTION_PREFIX = 'WS_TO_SERVER_';

let socket: SocketIOClient.Socket;

if (process.env.REACT_APP_WS_URL) {
  socket = io(process.env.REACT_APP_WS_URL);
} else {
  socket = io('http://localhost:8080');
}

const socketIoMiddleware = createSocketIoMiddleware(socket, ACTION_PREFIX);
const createStoreWithMiddlewares = composeWithDevTools(
  applyMiddleware(ReduxThunk, socketIoMiddleware)
)(createStore);
const store = createStoreWithMiddlewares(combineReducers);

socket.on('connect', () => {
  store.dispatch(playerActions.getPlayer());
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
