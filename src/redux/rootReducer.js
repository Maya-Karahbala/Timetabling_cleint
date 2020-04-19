import { combineReducers } from 'redux'
/*
import cakeReducer from './cake/cakeReducer'
import iceCreamReducer from './iceCream/iceCreamReducer'
*/
import departmentReducer from './department/departmentReducer'
import dataReducer from './data/dataReducer'

const rootReducer = combineReducers({
  department:departmentReducer,
  data: dataReducer
})

export default rootReducer
