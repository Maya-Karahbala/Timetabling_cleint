import React, { Component } from "react";


import { connect } from "react-redux";
import Table from "react-bootstrap/Table";
import {  Link } from "react-router-dom";

import nextId from "react-id-generator";

import {

    
  getformatedStartingEndingHours,
  getTimetableName,
  getFormatedStrDateLocal,
  minutes_to_hours_convert,
  orderByDateAndTime
} from "../jsFiles/Functions";



import UpdateEvent from "./UpdateEvent";
import { setConflicts } from "../jsFiles/Conflicts";
import { days } from "../jsFiles/Constants";


class EventsTable extends Component {
  constructor() {
    super();

    this.state = {
      didMount: false,
     
      updateEventIsOpen: false
    };
  }
  componentDidMount = () => {
    console.log("did mount");
   
     
        this.setState({
          didMount: true,

          timetableName: getTimetableName(
            this.props.selectedDepartment,
            this.props.selectedSemester,
            this.props.selectedTimetable
          ),
          selectedEvent: this.props.changedOpenedCoursesEvents[0],
          tableHeaders:
            this.props.selectedTimetable.timetableType == "Ders"
              ? [
                  "Dersin Kodu",
                  "Dersin Adı",
                  "Öğretim Üyesi",
                  "Araştırma Görevlisi",
                  "Derslik",
                  "Süre",
                  "Saat",
                  "Gün",
                  "Ders Türü"
                ]
              : [
                  "Dersin Kodu",
                  "Dersin Adı",
                  "Öğretim Üyesi",
                  "Gözetmen",
                  "Derslik",
                  "Süre",
                  "Saat",
                  "Gün",
                  "Tarih"
                ]
        });
        setConflicts(
          this.props.changedOpenedCoursesEvents,
          this.props.changedOpenedCoursesEvents,
          "conflicts"
        );
 
  
  };

  close_details = () => {
    this.setState({
      updateEventIsOpen: false
    });
    setConflicts(
      this.props.changedOpenedCoursesEvents,
      this.props.changedOpenedCoursesEvents,
      "conflicts"
    );
  };
 
  updateSelectedEvent=()=>{
    this.setState({
      selectedCourse:null
    })
   }



  render() {
    //console.log("this.props ---", this.props);
    return (
      <div>
        {this.state.didMount ? (
          <div>

           
      
           
             
                <Table bordered hover id="table-to-xls">
                  <thead>
                      {this.props.showDepartmentName?
                      (<tr style={{ backgroundColor: "rgb(221, 232, 239)" }}>
                      
                      <td colSpan={this.state.tableHeaders.length}>
                        <h5 style={{ textAlign: "center" }}>
                          {this.state.timetableName}
                        </h5>
                      </td>
                    </tr>)
                      :
                      ""}
                    
                    <tr style={{ backgroundColor: "rgb(241, 245, 247)" }}>
                      {this.state.tableHeaders.map(element => (
                        <th key={nextId()}>{element}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {this.props.changedOpenedCoursesEvents.sort(orderByDateAndTime).map(evt => {
                         if (
                             // if course id is not detrmined show all events other wise show only event under specific course
                            this.props.courseId== undefined ||
                            evt.Opened_course.Department_course.id ==
                            this.props.courseId
                          )
                      return (
                        <tr
                          key={evt.id}
                          onDoubleClick={() => {
                            console.log("cliked", evt.id);

                            this.setState({
                              selectedEvent: evt,
                              updateEventIsOpen: true
                            });
                          }}
                        >
                          <td>
                            {evt.Opened_course.Department_course.Course.code}
                          </td>
                          <td>

                              {// if all courses are shown allow routing to specific page
                              this.props.courseId== undefined?
                               <Link to={"/CourseGroups/"+evt.Opened_course.Department_course.id}
                          
                               >{evt.Opened_course.Department_course.Course.name}</Link>
                               :
                               evt.Opened_course.Department_course.Course.name
                              }
                         
                            
                          </td>
                          {this.props.selectedTimetable.timetableType ==
                          "Ders" ? (
                            <td style={{ width: "22%" }}
                            key={nextId()}>
                                 
                              {evt.teachers
                                .filter(teacher => teacher.role == 1)
                                .map(t => {
                                  return (
                                    <div>
                                   
                                      {t.title +
                                        " " +
                                        t.firstName +
                                        " " +
                                        t.lastName}
                                    </div>
                                  );
                                })}
                            </td>
                          ) : (
                            <td>{// if evet is exam show maincourse teachers
                              evt.mainCourseTeacher.map(t => {
                              return (
                                <div  key={nextId()}>
                                  
                                  {t.title +
                                    " " +
                                    t.firstName +
                                    " " +
                                    t.lastName}
                                </div>
                              );
                            })}</td>
                          )}

                      
                          {// if weekly course  show only assistants
                            this.props.selectedTimetable.timetableType ==
                          "Ders" ? (
                            <td style={{ width: "22%" }}>
                            {evt.teachers
                              .filter(teacher => teacher.role == 0)
                              .map(t => {
                                return (
                                  <div>
                                    {t.title +
                                      " " +
                                      t.firstName +
                                      " " +
                                      t.lastName}
                                  </div>
                                );
                              })}
                          </td>
                          ) : (
                            <td style={{ width: "22%" }}>
                            {// if exam show all assigned teachers(gözetmenler)
                              evt.teachers
                       
                              .map(t => {
                                return (
                                  <div>
                             

                                    {t.title +
                                      " " +
                                      t.firstName +
                                      " " +
                                      t.lastName}
                                     
                                  </div>
                                );
                              })}
                          </td>
                          )}
                     
                     

                     
                          <td>{evt.classrooms.map(c => c.code + " ")}</td>
                          <td>{minutes_to_hours_convert(evt.duration)}</td>
                          <td>
                            {
                              getformatedStartingEndingHours( evt.startingHour, evt.duration)
                              }
                          </td>
                          <td>
                            {evt.eventDate == null
                              ? ""
                              : days[new Date(evt.eventDate).getDay()]}
                          </td>
                          {this.props.selectedTimetable.timetableType ==
                          "Ders" ? (
                            <td>{evt.eventType}</td>
                          ) : (
                            <td>{getFormatedStrDateLocal(new Date(evt.eventDate))}</td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
           
           
           
           
            <UpdateEvent
              addCourseEventIsOpen={this.state.updateEventIsOpen}
              close_details={this.close_details}
              selectedEvent={this.state.selectedEvent}
              updateSelectedEvent={this.updateSelectedEvent}
            />
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    selectedDepartment: state.department.selectedDepartment,
    selectedSemester: state.department.selectedSemester,
    selectedTimetable: state.department.selectedTimetable,
    openedCoursesEvents: state.data.openedCoursesEvents.map(evt=>{
      evt.startingHour= evt.startingHour== null? null: new Date(evt.startingHour)
      return evt
    }),
    changedOpenedCoursesEvents: state.data.ChangedOpenedCoursesEvents.map(evt=>{
      evt.startingHour= evt.startingHour== null? null: new Date(evt.startingHour)
      return evt
    }),
    teachers: state.data.teachers
  };
};

const mapDispatchToProps = dispatch => {
  return {

  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EventsTable);
