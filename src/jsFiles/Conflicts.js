
import store from "../redux/store";

export const printTeachers = function () {

  return store.getState().data.teachers
}
export const isTimeConflicted = function (course1, course2,type) {

if (course1.startingHour== null || course2.startingHour==null ) return false
    if (course1.startingHour.getHours()> 
        course2.startingHour.getHours()) {
      let temp = course1;
      course1 = course2;
      course2 = temp;
    }
    let course1endingHour =
    // round course duratiın as a hour to up limit
    course1.startingHour.getHours() + (Math.ceil( course1.duration/60) - 1);
    let course1startingHour = course1.startingHour.getHours()
    let course2startingHour = course2.startingHour.getHours();
    if (
      course2startingHour >= course1startingHour &&
      course2startingHour <= course1endingHour &&
      course1.eventDate!= null&&
      course2.eventDate!= null
 
    ) {
      // compare according to date
      if(type=="weekday" && 
      new Date(course1.eventDate).getDay() == new Date(course2.eventDate).getDay()
       )return true;
      else if(course1.eventDate==course2.eventDate){
        // by comparing only week day we can get true result for course timetables
        return true;
      }
      
    }
    return false;
  }
  
 
 
  export const isClassroomConflicted = function (course1, course2) {
  
    for (const classroom1 of course1.classrooms) {
      for (const classroom2 of course2.classrooms) {
        if (classroom1.id === classroom2.id) {
          return true;
        }
      }
    }

    return false;
  }
  export const isClassroomCapacitySuitable=function(course){
  
      for (const classroom of course.classrooms) {
        if(classroom.capacity<course.studentNumber)
        return false;
      }
      return true
  
 
    
  }

  export const isClassroomSuitable=function(course){
    
   
       for (const classroom of course.classrooms) {
        if(course.Opened_course.Department_course.eventType==null||
          course.eventType==null) {
            // event is an exam or in course defination there is no special reqirement
            //course must be in regula classroom not in labs
            if(classroom.classroomType!="amphitheater")
            return false 
          }
        else if(course.Opened_course.Department_course.eventType=="All"
        ||course.Opened_course.Department_course.eventType== course.eventType
         
          ){
          if( course.Opened_course.Department_course.classroomType!= classroom.classroomType){
           return false
          }
         
        }
       }
       return true
     
     
     
   }
  export const isTeacherConflicted = function (course1, course2) {
   
    for (const teacher1 of course1.teachers) {
      for (const teacher2 of course2.teachers) {
        if (
          teacher1.id ===
          teacher2.id
        ) {
          return true;
        }
      }
    }

    return false;
  }

  export const setConflicts = function (courses1,courses2,arrayName)  {
   let allConf=[]
    let numberOfConflicts=0
    courses1.map(course1 => {
      course1[arrayName] = [];
   
      courses2.map(course2 => {
        if (
          course1.id !== course2.id &&  // dont compare course with itself
          isTimeConflicted(course1, course2 ) 
        ) {
          if (isClassroomConflicted(course1, course2)) {
            numberOfConflicts++
            course1[arrayName].push({
              type: "classroom",
              conflictedCourse: course2,
             
            });
            allConf.push(course1)
          }
          if (isTeacherConflicted(course1, course2)) {
            numberOfConflicts++
            course1[arrayName].push({
              type: "teacher",
              conflictedCourse: course2
            });
            allConf.push(course1)
          }
         

          // courses is belonged to same year semester // student conflicts
          //calculated only with local conflicts if we calculate glocal events ignore this part 
          if(arrayName=="conflicts"&&
            course1.Opened_course.Department_course.semesterNo==
            course2.Opened_course.Department_course.semesterNo){
              numberOfConflicts++
              course1[arrayName].push({
                type: "student",
                conflictedCourse: course2
              });
              allConf.push(course1)
   
              
            }
        }
      });

       // check if course is in teachers avalibaility time
       if(arrayName=="conflicts"){
         let temp_teachers=course1.teachers
         if(course1.mainCourseTeacher!=undefined){
          temp_teachers=  [...course1.teachers,...course1.mainCourseTeacher.filter(ele=> !course1.teachers.map(e=>e.id).includes(ele.id))]
        }
        temp_teachers.map(teacher1=>{
          let Teacher_with_ristriction=store.getState().data.teachers.filter(teacher=> teacher.id==teacher1.id)[0]
          Teacher_with_ristriction.Teacher_restrictions.map(restriction=>{
            restriction.startingHour= new Date(restriction.startingHour)
            if(  isTimeConflicted(course1, restriction,"weekday") ){
             
          
  
              //
              numberOfConflicts+=2
              course1[arrayName].push({
                type: "teacher_restriction",
                conflictedRestriction: restriction
              });
              allConf.push(course1)
              //
            }
          })
         })
         //
         if(!isClassroomCapacitySuitable(course1)||!isClassroomSuitable(course1)){
          numberOfConflicts+=2
          course1[arrayName].push({
            
            
            type: isClassroomCapacitySuitable(course1)? "unsuitable classrom":"unsuitable classrom capacity"
          });
         }
       }
     
    });
 //   console.log("çalıştı set conflicts",numberOfConflicts,allConf)
    return numberOfConflicts
  };