

export const isTimeConflicted = function (course1, course2) {

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
      course1.eventDate === course2.eventDate
      
    ) {
      return true;
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
          isTimeConflicted(course1, course2) 
        ) {
          if (isClassroomConflicted(course1, course2)) {
            numberOfConflicts++
            course1[arrayName].push({
              type: "classroom",
              conflictedCourse: course2
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
          //! global enevts must be controled
          if(course1.Opened_course.Department_course.semesterNo==
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
    });
 //   console.log("çalıştı set conflicts",numberOfConflicts,allConf)
    return numberOfConflicts
  };