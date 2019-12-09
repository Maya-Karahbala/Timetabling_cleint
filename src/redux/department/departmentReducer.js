import {
  Types
 } from './departmentTypes'

const initialState = {
  loading: false,
  departments: new Map(),
  selectedDepartment: {},
  user: {},
  error: ""
};

const departmentReducer = (state = initialState, action) => {
  console.log(action.type)
  switch (action.type) {
    case Types.UPDATE_SELECTED_DEPARTMENT:
        return {
          ...state,
          selectedDepartment: action.payload.department,
          user: action.payload.user,

        };
    case Types.FETCH_DEPARTMENT_REQUEST:
      return {
        ...state,
        loading: true
      };
    case Types.FETCH_DEPARTMENT_SUCCESS:
      return {
        loading: false,
        departments: action.payload,
        selectedDepartment: action.payload.values().next().value,
        error: ""
      };
    case Types.FETCH_DEPARTMENT_FAILURE:
      return {
        loading: false,
        departments: new Map(),
        error: action.payload
      };
  

    default:
      return state;
  }
};

export default departmentReducer;
