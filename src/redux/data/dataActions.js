
import {
 Types
} from './dataTypes'

export const   fetchData = (data) => {
  let semesterStr=""
  return  (dispatch) => {

    dispatch(fetchRequest())
      if(data.semesterNo!==undefined)semesterStr="/"+data.semesterNo
      console.log("semesterStr",semesterStr)
      console.log( "llllllllllllllllllllllllllllllllllll","http://localhost:3004/"+data.arrayName+semesterStr+"/"+data.deparmentId)
      if(data.url=== undefined)data.url=data.arrayName
       return fetch("http://localhost:3004/"+data.url+semesterStr+"/"+data.deparmentId)
      .then(response => response.json())
      .then(d => {
         dispatch( fetchSuccess({data:d, arrayName:data.arrayName}))
         console.log("fetch bitti ",d)
         return d
      })
      .catch(error => {
        dispatch(fetchFailure(error.message))
      })
  }
  
}

export const  fetchRequest = () => {
  console.log("fetch data çalıştı -----------*1")
  return {
    type: Types.FETCH_REQUEST
  }
}

export const fetchSuccess =  (data) => {
  console.log("fetch data çalıştı -----------*2")
  return {
    type: Types.FETCH_SUCCESS,
    payload: data
  }
}

export const fetchFailure = error => {
  console.log("fetch data çalıştı -----------*3")
  return {
    type: Types.FETCH_FAILURE,
    payload: error
  }
}

export const updateChangedCourses = (payload) => {
  
  return {
    type: Types.UPDATE_CHANGED_COURSES,
    payload: payload
  }
  
}

export const filteredFetch = (data) => {
  
  let semesterStr=""
  return  (dispatch) => {

    dispatch(fetchRequest())
      if(data.semesterNo!==undefined)semesterStr="/"+data.semesterNo
      console.log("semesterStr",semesterStr)
      console.log( "llllllllllllllllllllllllllllllllllll","http://localhost:3004/"+data.arrayName+semesterStr+"/"+data.deparmentId)
      if(data.url=== undefined)data.url=data.arrayName
      return  fetch("http://localhost:3004/"+data.url+semesterStr+"/"+data.deparmentId)
      .then(response => response.json())
      .then(d => {
         dispatch( 
             {
              type: Types.FILTERD_FETCH,
              payload: {data:d, arrayName:data.arrayName,timetableId:data.timetableId}
            }
         )
        // dispatch( fetchSuccess({data:d.filter(evt=> evt.timetableId!=data.timetableId), arrayName:data.arrayName+"Exams"}))
         console.log("fetch bitti ")
         return(d)
      })
      .catch(error => {
        dispatch(fetchFailure(error.message))
      })
  }
  
}



