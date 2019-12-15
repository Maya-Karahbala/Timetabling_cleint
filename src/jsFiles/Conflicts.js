export const consoleName = function (name) {
   console.log('""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""',name)
}

export const isTimeConsflicted = function (course1, course2) {
    if (Number(course1.startingHour) > Number(course2.startingHour)) {
      let temp = course1;
      course1 = course2;
      course2 = temp;
    }
    let course1endingHour =
      Number(course1.startingHour) + (Number(course1.duration) - 1);
    let course1startingHour = Number(course1.startingHour);
    let course2startingHour = Number(course2.startingHour);
    if (
      course2startingHour >= course1startingHour &&
      course2startingHour <= course1endingHour
    ) {
      return true;
    }
    return false;
  }
  export const isClassroomConsflicted = function (course1, course2) {
    for (const classroom1 of course1.Event_classrooms) {
      for (const classroom2 of course2.Event_classrooms) {
        if (classroom1.classroomId === classroom2.classroomId) {
          return true;
        }
      }
    }

    return false;
  }
  export const isTeacherConsflicted = function (course1, course2) {
    for (const teacher1 of course1.Event_teachers) {
      for (const teacher2 of course2.Event_teachers) {
        //   if (teacher1.dapartmentTeacherId === teacher2.dapartmentTeacherId) {
        if (
          teacher1.Department_Teacher.Teacher.id ===
          teacher2.Department_Teacher.Teacher.id
        ) {
          return true;
        }
      }
    }

    return false;
  }