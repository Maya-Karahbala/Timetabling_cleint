
import {
 Types
} from './departmentTypes'

export const fetchDepartments = () => {
  return (dispatch) => {
    dispatch(fetchDepartmentsRequest())
      let departments=new Map()
      return fetch("/departments")
      .then(response => response.json())
      .then(data => {
        
        JSON.parse(JSON.stringify(data)).map(dep => {
          departments.set(dep.id, dep);
        });
        dispatch(fetchDepartmentsSuccess(departments))
        return data
      })
      .catch(error => {
        // error.message is the error message
        dispatch(fetchDepartmentsFailure(error.message))
      })
  }
}

export const fetchDepartmentsRequest = () => {
  return {
    type: Types.FETCH_DEPARTMENT_REQUEST
  }
}

export const fetchDepartmentsSuccess = departments => {
  return {
    type: Types.FETCH_DEPARTMENT_SUCCESS,
    payload: departments
  }
}

export const fetchDepartmentsFailure = error => {
  return {
    type: Types.FETCH_DEPARTMENT_FAILURE,
    payload: error
  }
}

// set delected department and loged in user info

export const updateSelcectedDepartment = (payload) => {
    return {
      type: Types.UPDATE_SELECTED_DEPARTMENT,
      payload: payload
    }
    
  }
  export const storeData = (payload) => {
  
    return {
      type: Types.STORE_DATA,
      payload: payload
    }
    
  }
  export const updateSelectedSemester = (payload) => {
  
    return {
      type: Types.STORE_DATA,
      payload: payload
    }
    
  }
  




