import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './index.scss';
// import './styles/_min.css';
// import './styles/sidebar.css';
import './fontawesome-free-5.12.0-web/css/regular.min.css'
// import './styles/min.scss';
// import './styles/colors.css';

import { App } from './App';
// import * as serviceWorker from './serviceWorker';
import { configureStore } from './state';

const store = configureStore();


window.store = store;

ReactDOM.render(   
    <Provider store={store}>
        <App />
    </Provider>, 
    document.getElementById('root')
);
    
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
