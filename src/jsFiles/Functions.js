import _ from "lodash";

import { hours } from "./Constants";

//--------------Course(event) functions---------------------------//
export const getGlobalCourses = (semesterId, departmentId, timetableId) => {
  let globalCourses = [];
  // NOt:!!! timetable id condition must be filtered in server side to avoid sending big ammount of data
  return fetch("/openedCoursesEvents/" + semesterId)
    .then(responce => responce.json())
    .then(data => {
      JSON.parse(JSON.stringify(data)).map(course => {
        // add courses not belongs to same department
        if (
          course.Opened_course.Department_course.departmentId !==
            departmentId &&
          course.timetableId == timetableId
        ) {
          course.startingHour =
            course.startingHour == null ? null : new Date(course.startingHour);

          globalCourses.push(course);
        }
      });
      let copyData = JSON.parse(JSON.stringify(globalCourses));
      // make teachers and classromms in global format
      globalCourses.map(evt => {
        for (let i = 0; i < copyData.length; i++) {
          if (copyData[i].id == evt.id) {
            evt.teachers = copyData[i].Event_teachers.map(ev => {
              let t = ev.Department_Teacher.Teacher;
              t.dapartmentTeacherId = ev.Department_Teacher.id;

              return t;
            });
            evt.classrooms = copyData[i].Event_classrooms.map(ev => {
              return ev.Classroom;
            });
            delete evt.Event_teachers;
            delete evt.Event_classrooms;
          }
        }
      });

      console.log("globalCourses", globalCourses);
      return globalCourses;
    });
};

export const get_changed_Courses = function(changedCourses, unChangedCourses) {
  // retun only info neede to be changed in database
  let newCourse, oldCourse;
  let tempChangedCourses = [];
  let deletedClassrooms;
  let classrooms;
  let deletedTeachers;
  let teachers;
  changedCourses.map(changedCourse => {
    deletedClassrooms = [];
    classrooms = [];
    teachers = [];
    deletedTeachers = [];
    unChangedCourses.map(unChangedCourse => {
      if (changedCourse.id == unChangedCourse.id) {
        let tempObject = {};
        newCourse = changedCourse;
        oldCourse = unChangedCourse;
        if (!_.isEqual("newCourse", oldCourse, "oldCourse", oldCourse)) {
          if (newCourse.duration !== oldCourse.duration) {
            tempObject.duration = newCourse.duration;
          }
          if (newCourse.studentNumber !== oldCourse.studentNumber) {
            tempObject.studentNumber = newCourse.studentNumber;
          }

          if (newCourse.eventDate !== oldCourse.eventDate) {
            tempObject.eventDate = newCourse.eventDate;
          }
          ///////////////
          if (
            newCourse.startingHour == null ||
            oldCourse.startingHour == null
          ) {
            tempObject.startingHour = newCourse.startingHour;
          } else if (
            newCourse.startingHour.getTime() !==
            oldCourse.startingHour.getTime()
          ) {
            tempObject.startingHour = newCourse.startingHour;
          }
          /////////////////////////
          let oldCourseClassroomIdes = oldCourse.classrooms.map(c => {
            return c.id;
          });
          let newCourseClassroomIdes = newCourse.classrooms.map(c => {
            return c.id;
          });
          newCourse.classrooms.map(classroom => {
            if (!oldCourseClassroomIdes.includes(classroom.id)) {
              classrooms.push(classroom);
            }
          });
          oldCourse.classrooms.map(classroom => {
            if (!newCourseClassroomIdes.includes(classroom.id)) {
              deletedClassrooms.push(classroom);
            }
          });
          // teachers controls

          let oldCourseTeachersIdes = oldCourse.teachers.map(t => {
            return t.id;
          });
          let newCourseTeachersIdes = newCourse.teachers.map(t => {
            return t.id;
          });
          newCourse.teachers.map(teacher => {
            if (!oldCourseTeachersIdes.includes(teacher.id)) {
              teachers.push(teacher);
            }
          });
          oldCourse.teachers.map(teacher => {
            if (!newCourseTeachersIdes.includes(teacher.id)) {
              deletedTeachers.push(teacher);
            }
          });

          if (
            !(
              _.isEmpty(tempObject) &&
              deletedClassrooms.length == 0 &&
              classrooms.length == 0 &&
              deletedTeachers.length == 0 &&
              teachers.length == 0
            )
          )
            tempChangedCourses.push({
              id: changedCourse.id,
              changedData: tempObject,
              deletedClassrooms: deletedClassrooms,
              classrooms: classrooms,
              teachers: teachers,
              deletedTeachers: deletedTeachers
            });
        }
      }
    });
  });
  console.log("temp changed course ", tempChangedCourses);
  if (tempChangedCourses.length !== 0) console.log(tempChangedCourses);
  return tempChangedCourses;
  //this.send_changedCourses_to_server(tempChangedCourses);
};
export const send_changedCourses_to_server = function(data) {
  return fetch("/updatecourses", {
    method: "put",
    body: JSON.stringify(data)
  }).then(response => {
    console.log("response ", response);
    if (response.ok) {
      console.log("degişikliker kaydedildi");
    }
  });
};

//--------------Days adn dates functions---------------------------//
export const getDaysDifference = function(date1, date2) {
  const diffTime = Math.abs(date2 - date1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};
export const getDaysBetween = function(date1, date2) {
  let dates = [];
  let temp;
  let diff = getDaysDifference(date1, date2);
  for (let i = 0; i < diff; i++) {
    temp = new Date(date1.setDate(date1.getDate() + i));
    dates.push({
      dateValue: getFormatedStrDate(temp),
      strValue: getFormatedStrDateLocal(temp),
      dayValue: temp.getDay()
    });

    date1.setDate(date1.getDate() - i);
  }
  console.log("dates", dates);
  return dates;
};
export const getFormatedStrDate = function(date) {
  return (
    date.getFullYear() +
    "-" +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + date.getDate()).slice(-2)
  );
};
export const getFormatedStrDateLocal = function(date) {
  // null coverted to date
  if (date.getFullYear() == 1970) return " ";
  return (
    ("0" + date.getDate()).slice(-2) +
    "-" +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    "-" +
    date.getFullYear()
  );
};

export const getTimetableFirstweekBoundary = function(date1) {
  let weekDay = -1;
  let i = 0;
  let temp;
  // try to find first day that equal to monday (week first day)
  while (weekDay != 1) {
    temp = new Date(date1.setDate(date1.getDate() + i));
    weekDay = temp.getDay();
    date1.setDate(date1.getDate() - i);
    i++;
  }
  let copiedDate = new Date(temp);
  //return first and lastweek day
  return {
    beginning: temp,
    ending: new Date(copiedDate.setDate(copiedDate.getDate() + 6))
  };
};

export const setTimeTableDays = function(selectedTimetable) {
  let boundary;
  if (selectedTimetable.timetableType == "Ders")
    boundary = getTimetableFirstweekBoundary(
      new Date(selectedTimetable.beginning)
    );

  let days =
    // for course program find first week
    selectedTimetable.timetableType == "Ders"
      ? getDaysBetween(boundary.beginning, boundary.ending)
      : // for exam programs find days between timetable begining and ending dates and fill
        // then in days array that schedule map headers eithh its values
        getDaysBetween(
          new Date(selectedTimetable.beginning),
          new Date(selectedTimetable.ending)
        );
  selectedTimetable.days = days;
};
export const getTimetableName = function(
  selectedDepartment,
  selectedSemester,
  selectedTimetable
) {
  return (
    selectedSemester.beginning +
    " - " +
    selectedSemester.ending +
    " " +
    selectedSemester.semesterType +
    " Dönemi " +
    selectedDepartment.name +
    " " +
    selectedTimetable.timetableType +
    " Programı"
  );
};
export const getformatedStartingEndingHours = function(hour, duration) {
  if (hour == null) return "";
  let ending = new Date(hour);
  ending.setMinutes(hour.getMinutes() + duration);
  return (
    hour.toTimeString().substring(0, 5) +
    " - " +
    ending.toTimeString().substring(0, 5)
  );
};
export const minutes_to_hours_convert = function(num) {
  var hours = Math.floor(num / 60);
  var minutes = num % 60;

  return minutes < 10 ? hours + ":" + minutes + "0" : hours + ":" + minutes;
};
