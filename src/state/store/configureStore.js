import { createStore, applyMiddleware } from 'redux';
//import thunk from 'redux-thunk';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import rootReducer from '../reducers';

const loggerMiddleware = createLogger();

export function configureStore() {
//    console.log("configureStore");
    return createStore(
        rootReducer,
        applyMiddleware(
          thunkMiddleware,
          loggerMiddleware
        )
//        applyMiddleware(thunk)
    );
}