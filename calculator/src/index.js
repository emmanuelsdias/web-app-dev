import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import store from './store/store';
import Calculator from './Calculator';


const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
      <Provider store={store}>
        <Calculator />
      </Provider>
  </React.StrictMode>
);
