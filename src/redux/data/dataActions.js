
import {
 Types
} from './dataTypes'

export const   fetchData = (data) => {
  let semesterStr=""
  return  (dispatch) => {

    dispatch(fetchRequest())
      if(data.semesterNo!==undefined)semesterStr="/"+data.semesterNo
      console.log("semesterStr",semesterStr)
      console.log( "llllllllllllllllllllllllllllllllllll","/"+data.arrayName+semesterStr+"/"+data.deparmentId)
      if(data.url=== undefined)data.url=data.arrayName
       return fetch("/"+data.url+semesterStr+"/"+data.deparmentId)
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

  return {
    type: Types.FETCH_REQUEST
  }
}

export const fetchSuccess =  (data) => {

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

export const updateChangedCourses =   (payload) => {
  
  return {
    type: Types.UPDATE_CHANGED_COURSES,
    payload: payload
  }
  
}

export const filteredFetch = (data) => {
  
  let semesterStr=""
  return  (dispatch) => {

    dispatch(fetchRequest())
      if(data.selectedSemester.id!==undefined)semesterStr="/"+data.selectedSemester.id
      console.log("semesterStr",semesterStr)
      console.log( "llllllllllllllllllllllllllllllllllll","/"+data.arrayName+semesterStr+"/"+data.deparmentId)
      if(data.url=== undefined)data.url=data.arrayName
      return  fetch("/"+data.url+semesterStr+"/"+data.deparmentId)
      .then(response => response.json())
      .then(d => {
        let copyData=JSON.parse(JSON.stringify(d));
          // for exams get maincourses and store basic teachers info in events
          let mainCourses
          if(data.selectedTimetable.timetableType!="Ders"){
          let CourseTimetable= data.selectedSemester.Timetables.filter(timetable => timetable.timetableType == "Ders")[0]
           mainCourses= copyData.filter(evt=>
            evt.timetableId== CourseTimetable.id
          )
          }
         d.map(evt=>{
           // update structure of events come from database to meet program requirements
                
                
                evt.teachers=evt.Event_teachers.map(ev=>{
                   let t = ev.Department_Teacher.Teacher
                   t.dapartmentTeacherId= ev.Department_Teacher.id
             
                   return t
                })
                evt.classrooms=evt.Event_classrooms.map(ev=>{
                  return ev.Classroom
                })
                delete evt.Event_teachers;
                delete evt.Event_classrooms;
                // store main course teacher
                if(data.selectedTimetable.timetableType!="Ders"){
                 let course =mainCourses.filter(course=> course.Opened_course.id== evt.Opened_course.id)[0]
                 
                 evt.mainCourseTeacher= course.Event_teachers.map(ev=> ev.Department_Teacher.Teacher).filter(t=> t.role==1)
                }
         })
         dispatch( 
             {
              type: Types.FILTERD_FETCH,
              payload: {data:d, arrayName:data.arrayName,timetableId:data.selectedTimetable.id}
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



