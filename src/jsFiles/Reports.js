import { days, hours } from "./Constants";
import { isTimeConflicted } from "../jsFiles/Conflicts";
import {
  minutes_to_hours_convert,
  getFormatedStrDateLocal,
  getformatedStartingEndingHours,
  getGlobalCourses
} from "./Functions";
let borderSingleStyle={ style:"thin",color: { rgb: "#78838a" }}
let borderStyle={ 
  right: borderSingleStyle,
  left: borderSingleStyle,
  top: borderSingleStyle,
  bottom: borderSingleStyle}
let cellsStyle = {
  font: { sz: "13" },
  alignment: { horizontal: "center", vertical: "center", wrapText: true },
  

  
};

let header1Style = {
  font: { sz: "17", bold: true },
  alignment: { horizontal: "center" },

  alignment: { horizontal: "center", vertical: "center" },
  
};

export const get_AllEvents_ExcelList = function(
  headers,
  events,
  selectedSemester,
  selectedTimetable,
  selectedDepartment
) {
  let columsHeaders = headers.map(header => {
    return {
      title: header,
      width: {
        wpx:
          header == "Öğretim Üyesi" ||
          header == "Gözetmen" ||
          header == "Dersin Adı"
            ? 200
            : 100
      },
      style: {
        fill: { fgColor: { rgb: "d0e1ed" } },
        font: { sz: "12", bold: true },
        alignment: { horizontal: "center" },
        
      }
    };
  });

  /*
    "Dersin Kodu",
              "Dersin Adı",,
              "öğretim üyesi"
              "Gözetmen",
              "Derslik",
              "Süre",
              "Saat",
              "Gün",
              */
  let data = events.map(evt => {
    return [
      {
        value: evt.Opened_course.Department_course.Course.code,
        style: cellsStyle
      },
      {
        value: evt.Opened_course.Department_course.Course.name,
        style: cellsStyle
      },
      {
        value:selectedTimetable.timetableType ==
        "Ders" ? (
          evt.teachers
              .filter(teacher => teacher.role == 1)
              .map(t => {
                return (
                 t.title +
                      " " +
                      t.firstName +
                      " " +
                      t.lastName
                
                );
              }) .join(",")
        
        ) : (
          // if evet is exam show maincourse teachers
            evt.mainCourseTeacher.map(t => {
            return (
              t.title +
                  " " +
                  t.firstName +
                  " " +
                  t.lastName
           
            );
          }) .join(",")
        ),
        style: cellsStyle
      },
        ////////////
      {
        value:selectedTimetable.timetableType ==
        "Ders" ? (
          evt.teachers
              .filter(teacher => teacher.role == 0)
              .map(t => {
                return (
                 t.title +
                      " " +
                      t.firstName +
                      " " +
                      t.lastName
                
                );
              }) .join(",")
        
        ) : (
          // if evet is exam show maincourse teachers
            evt.teachers.map(t => {
            return (
              t.title +
                  " " +
                  t.firstName +
                  " " +
                  t.lastName
           
            );
          }) .join(",")
        ),
        style: cellsStyle
      },
      ////////////
      {
        value: evt.classrooms.map(c => c.code + " ").join(","),
        style: cellsStyle
      },
      { value: minutes_to_hours_convert(evt.duration), style: cellsStyle },
      {
        value:   getformatedStartingEndingHours( evt.startingHour, evt.duration),
      
        style: cellsStyle
      },
      {
        value:
          evt.eventDate == null ? "" : days[new Date(evt.eventDate).getDay()],
        style: cellsStyle
      },
      {
        value:
          selectedTimetable.timetableType == "Ders"
            ? " "
            : getFormatedStrDateLocal(new Date(evt.eventDate)),
        style: cellsStyle
      }
    ];
  });
  console.log(data);
  return [
    // first line example "2019-2020 GÜZ YARIYILI  BÜTÜNLEME SINAVLARI "
    {
      xSteps: 2, // Will start putting cell with 1 empty cell on left most
      columns: [
        {
          title:
            selectedSemester.beginning +
            " - " +
            selectedSemester.ending +
            " " +
            selectedSemester.semesterType +
            "  Dönemi " +
            selectedTimetable.timetableType +
            " Programı",
          style: header1Style
        } //pixels width
      ],
      data: [[]]
    },
    // next line department name Ex Biligisayar müh
    {
      ySteps: -1,
      xSteps: 2, // Will start putting cell with 1 empty cell on left most
      columns: [
        {
          title: selectedDepartment.name,
          style: header1Style
        } //pixels width
      ],
      data: [[]]
    },
    // table of events (courses or exams)
    { ySteps: -1, columns: columsHeaders, data: data }
  ];
};
export const get_Teacher_Excel_list = function(

  teacher,
  events,
  global_events
) {
  let tableStaticCellsStyle = {
    font: { sz: "15", bold: true },
    alignment: { horizontal: "center", vertical: "center" },
    fill: { fgColor: { rgb: "d0e1ed" } },
    border: borderStyle ,
   
  };

      let formated_teacher_events = get_formated_Teacher_events(
        get_Teacher_events(teacher, events, global_events)
       
      );
      return [
        // first line Teacher full name "
        {
          ySteps: 2,
          xSteps:4, // Will start putting cell with 4 empty cell on left most
          columns: [
            {
              title:
                teacher.title +
                " " +
                teacher.firstName +
                " " +
                teacher.lastName +
                " ",
               
              style: header1Style,
              
            } //pixels width
          ],
          data: [[]]
        },
        // next line department name Ex Biligisayar müh
        {
          ySteps: -1,
          xSteps: 1, // Will start putting cell with 1 empty cell on left most
          // days sliced so holiday is not shown in program
          columns: [""].concat(days.slice(1, 7)).map(day => {
            return {
              title: day,
              width: {
                wpx:110
              },
              style: tableStaticCellsStyle
            };
          }),
          data: formated_teacher_events.map(evt => {
            let counter=0
            return [
              {
                value: evt[0],
                style: tableStaticCellsStyle
              },
              ...evt.slice(1).map(cell=>{
                counter++
                return ( 
                { value: typeof(evt[counter])=="object" && evt[counter].startingHour.getHours()==evt[0].substring(0,2)? 
                ( evt[counter].Opened_course.Department_course.Course.name+" "+
                  evt[counter].Opened_course.Department_course.Course.code+" "+
                  evt[counter].classrooms.map(c => c.code + " ").join(",")
                  )

                :"",
                 style: {...cellsStyle,
                  
                  fill:
                   { fgColor: { rgb:  typeof(evt[counter])=="object"?  "#FAFAD2":"" } ,patternType:"solid"}
                 //   }
                } }
                )
               
              })
            
            ];
          })
        } /*
            // table of events (courses or exams)
            { ySteps: -1, columns: columsHeaders, data: data }*/
      ];
   


};

///////////////////////////
export const get_Teacher_events =  function(
  teacher,
  events,
  global_events
) {
  let teacher_events = [];
  events.map(evt => {
    for (let i = 0; i < evt.teachers.length; i++) {
      if (evt.teachers[i].id == teacher.id) teacher_events.push(evt);
    }
  });
  global_events.map(evt => {
    for (let i = 0; i < evt.teachers.length; i++) {
      if (evt.teachers[i].id == teacher.id) teacher_events.push(evt);
    }
  });

  return teacher_events;
};
export const get_formated_Teacher_events = function(teacherEvents) {
  // format teacher events to convert it to excel
  let formated_events = [];
  let tempEvent;
  let tempList;
  hours.slice(1).map(hour => {
    tempList = [];
    tempList.push(hour)
    // exclude holidays
    for (let i = 1; i < days.length-1; i++) {

      tempEvent = teacherEvents.filter(
        // travers week hour by hour and check if teacher has event in that hour
        evt =>{
          return isTimeConflicted(evt, {
            startingHour: new Date(2001, 1, 1, hour.substring(0, 2), 0),
            duration: 60,
            eventDate: new Date(evt.eventDate).getDay() == i ? evt.eventDate: null
          }) 
        }
     
      );
      tempEvent.length == 0 ? tempList.push("") : tempList.push(tempEvent[0]);
    }
    formated_events.push(tempList);
  });
  return formated_events;
};
// return list with n*m when n week days and m hours in day. with 0,1 data value 1 if teacher 
// avalible and 0 if not
export const get_formated_Teacher_restrictions = function(teacherEvents) {
  // format teacher events to convert it to excel
  let formated_events = [];
  let tempEvent;
  let tempList;
  hours.slice(1).map(hour => {
    tempList = [];
    tempList.push(hour)
    // exclude holidays
    for (let i = 1; i < days.length-1; i++) {

      tempEvent = teacherEvents.filter(
        // travers week hour by hour and check if teacher has event in that hour
        evt =>{
          return isTimeConflicted(evt, {
            startingHour: new Date(2001, 1, 1, hour.substring(0, 2), 0),
            duration: 60,
            eventDate: new Date(evt.eventDate).getDay() == i ? evt.eventDate: null
          }) 
        }
     
      );
      tempEvent.length == 0 ? tempList.push(false) : tempList.push(true);
    }
    formated_events.push(tempList);
  });
  return formated_events;
};
