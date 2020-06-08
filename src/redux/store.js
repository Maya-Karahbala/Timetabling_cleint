import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import logger from 'redux-logger'
import thunk from 'redux-thunk'

import rootReducer from './rootReducer'

export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  } catch {
    // ignore write errors
  }
};
export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('state');
    console.log("serializedState",serializedState)
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
}; 
const browserState=loadState()

const store = createStore(
 
  rootReducer,
  browserState,
  composeWithDevTools(applyMiddleware(logger, thunk,
    )),

)
store.subscribe(() => saveState( store.getState()));



export default store
