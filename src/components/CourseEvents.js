import React, { Component } from "react";

import { Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import Table from "react-bootstrap/Table";

import Button from "react-bootstrap/Button";
import { Alert } from "reactstrap";
import {
  get_changed_Courses,
  send_changedCourses_to_server,

  getformatedStartingEndingHours,
  getGlobalCourses,
  getTimetableName,
  getFormatedStrDateLocal,
  minutes_to_hours_convert
} from "../jsFiles/Functions";

import {
  get_AllEvents_ExcelList,
  get_Teacher_Excel_list
} from "../jsFiles/Reports";
import { filteredFetch } from "../redux";
import UpdateEvent from "./UpdateEvent";
import { setConflicts } from "../jsFiles/Conflicts";
import { days } from "../jsFiles/Constants";
//import ReactExport from 'react-export-excel';
import ReactExport from "react-data-export";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

class CourseEvents extends Component {
  constructor() {
    super();

    this.state = {
      didMount: false,
      alertVisble: false,
      updateEventIsOpen: false
    };
  }
  componentDidMount = () => {
    console.log("did mount");
   
      getGlobalCourses(
        this.props.selectedSemester.id,
        this.props.selectedDepartment.id,
        this.props.selectedTimetable.id
      ).then(globalCourses => {
        this.setState({
          didMount: true,
          globalCourses: globalCourses,
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
                  "Gün"
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
      });
  
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
  toggle_alert = () => {
    this.setState(prevState => {
      return { alertVisble: !prevState.alertVisble };
    });
  };

  getTeacherDataSet = () => {
    let result = [];
    this.props.teachers.map(teacher => {
      result.push(
        ...get_Teacher_Excel_list(
          teacher,
          this.props.changedOpenedCoursesEvents,
          this.state.globalCourses
        )
      );
    });
   // console.log("---------result------------", result);
    return result;
  };
  savaChanges=()=>{
    let changedEvents = get_changed_Courses(
      this.props.changedOpenedCoursesEvents,
      this.props.openedCoursesEvents
    );

    console.log("changedEvents", changedEvents);
    if (changedEvents.length != 0) {
      send_changedCourses_to_server(changedEvents).then(() => {
        // !!  must be controled and fetched after reqquest from db come
        setTimeout(() => {
          this.props
            .filteredFetch({
              deparmentId: this.props.selectedDepartment.id,
              selectedSemester: this.props.selectedSemester,
              arrayName: "openedCoursesEvents",
              selectedTimetable: this.props.selectedTimetable
            })
            .then(() => {
              this.toggle_alert();
              setTimeout(() => {
                this.changed = [];

                this.setState({
                  alertVisble: false
                });
              }, 2000);
            });
        }, 500);
      });
    }
  }

  render() {
    //console.log("this.props ---", this.props);
    return (
      <div>
        {this.state.didMount ? (
          <div>
               <Row style={{ marginTop: "0%", width: "100%" }}>
               <Col lg={1}></Col>

              <Col lg={9}>
                <div className="alert">
                  <Alert
                    color="success"
                    isOpen={this.state.alertVisble
                    }
                    toggle={this.toggle_alert}
                    fade={true}
                    style={{marginBottom:"0%"}}
                  >
                    değişiklikler kaydedildi
                  </Alert>
                </div>
              </Col>

              <Col lg={2}>
                <Button
                  className="kaydettbl"
                  onClick={this.savaChanges}
                >
                  Kaydet
                </Button>{" "}
              </Col>
            </Row>
            <Row style=
            {{ marginTop: this.state.alertVisble?"0%": "3%", width: "100%" }}>
              <Col lg={1}></Col>
              <Col lg={11}>
                <Table bordered hover id="table-to-xls">
                  <thead>
                    <tr style={{ backgroundColor: "rgb(221, 232, 239)" }}>
                      {/**number of cells will be merged  */}
                      <td colspan={this.state.tableHeaders.length}>
                        <h5 style={{ textAlign: "center" }}>
                          {this.state.timetableName}
                        </h5>
                      </td>
                    </tr>
                    <tr style={{ backgroundColor: "rgb(241, 245, 247)" }}>
                      {this.state.tableHeaders.map(element => (
                        <th>{element}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {this.props.changedOpenedCoursesEvents.map(evt => {
                      return (
                        <tr
                          key={evt.id}
                          onClick={() => {
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
                            {evt.Opened_course.Department_course.Course.name}
                          </td>
                          {this.props.selectedTimetable.timetableType ==
                          "Ders" ? (
                            <td style={{ width: "22%" }}>
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
                                <div>
                                  {t.title +
                                    " " +
                                    t.firstName +
                                    " " +
                                    t.lastName}
                                </div>
                              );
                            })}</td>
                          )}

                      
                          {// if weekly couse show only assistants
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
                            " "
                          ) : (
                            <td>{getFormatedStrDateLocal(new Date(evt.eventDate))}</td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </Col>
            </Row>
            <Row style={{ marginTop: "2%", width: "100%" }}>
              <Col lg={10}>
                <ExcelFile
                  element={<Button style={{ marginLeft: "12%" }}>indir</Button>}
                  filename={this.state.timetableName}
                >
                  <ExcelSheet
                    dataSet={get_AllEvents_ExcelList(
                      this.state.tableHeaders,
                      this.props.changedOpenedCoursesEvents,
                      this.props.selectedSemester,
                      this.props.selectedTimetable,
                      this.props.selectedDepartment
                    )}
                    name="Organization"
                  />
                </ExcelFile>
                {this.props.selectedTimetable.timetableType == "Ders" ? (
                  <ExcelFile
                    element={
                      <Button style={{ marginLeft: "2%" }}>
                        Öğretim üylerin takvimleri
                      </Button>
                    }
                    filename={this.state.timetableName}
                  >
                    <ExcelSheet
                      dataSet={
                        this.getTeacherDataSet()

                        // this.get_Teacher_Excel_list()
                      }
                      name="Organization"
                    />
                  </ExcelFile>
                ) : (
                  " "
                )}
              </Col>

            </Row>
           
            <UpdateEvent
              addCourseEventIsOpen={this.state.updateEventIsOpen}
              close_details={this.close_details}
              selectedEvent={this.state.selectedEvent}
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
    filteredFetch: data => dispatch(filteredFetch(data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CourseEvents);
