
import {
 Types
} from './dataTypes'

export const fetchData = (data) => {
  return (dispatch) => {
    dispatch(fetchRequest())
    //deparmentId:selectedDep.id ,  arrayName:"teachers"
      fetch("http://localhost:3004/"+data.arrayName+"/"+data.deparmentId)
      .then(response => response.json())
      .then(d => {
        dispatch(fetchSuccess({data:d, arrayName:data.arrayName}))
      })
      .catch(error => {
        dispatch(fetchFailure(error.message))
      })
  }
  
}

export const fetchRequest = () => {
  return {
    type: Types.FETCH_REQUEST
  }
}

export const fetchSuccess = data => {
  return {
    type: Types.FETCH_SUCCESS,
    payload: data
  }
}

export const fetchFailure = error => {
  return {
    type: Types.FETCH_FAILURE,
    payload: error
  }
}




