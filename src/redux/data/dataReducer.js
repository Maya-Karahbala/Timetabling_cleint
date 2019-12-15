import {
  Types
 } from './dataTypes'

const initialState = {
  teachers:[]
};

const teacherReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.FETCH_REQUEST:
      return {
        ...state,
        loading: true
      };
    case Types.FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        [action.payload.arrayName]: action.payload.data,
        error: ""
      };
    case Types.FETCH_FAILURE:
      return {
        loading: false,
        error: action.payload
      };
      case Types.UPDATE_CHANGED_COURSES:
      return {
        ...state,
      [action.payload.arrayName]:    action.payload.data,
      };
      

    default:
      return state;
  }
};

export default teacherReducer;
