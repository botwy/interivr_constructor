/** Created by Denis Goncharov on 04.08.18. */
import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';
import {Provider} from 'react-redux';
import App from './konva-transformer/AppKonva';
import reducer from './konva-transformer/reducer';

const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(thunk)),
  );

ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('app')
);
