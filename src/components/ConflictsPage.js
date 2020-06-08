import { Tree } from "primereact/tree";
import React, { Component } from "react";
import "primereact/resources/themes/nova-light/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Row, Col } from "react-bootstrap";
import { Card, Button, CardTitle, CardText } from "reactstrap";
import { printTeachers } from "../jsFiles/Conflicts";
import CourseDetails from "./CourseDetails";
import { connect } from "react-redux";
import { setConflicts } from "../jsFiles/Conflicts";
import { getGlobalCourses } from "../jsFiles/Functions";
import { getFitness } from "../jsFiles/GeneticAlgorithm";
import {
  get_Teacher_events,
  get_formated_Teacher_events,
} from "../jsFiles/Reports";
import Table from "react-bootstrap/Table";
import UpdateEvent from "./UpdateEvent";
import { Dropdown } from "primereact/dropdown";
class ConflictsPage extends Component {
  constructor(
    departments,
    changedCourses,
    semesterId,
    departmentId,
    courses,
    selectedTimetable,
    printTeachers
  ) {
    super();
    this.getLocalConflicts = this.getLocalConflicts.bind(this);
    this.getGlobalConflicts = this.getGlobalConflicts.bind(this);

    this.state = {
      nodes: null,
      expandedKeys: {},
      modal: false,
      course1: null,
      course2: null,
      conflictType: null,
      isloading: true,
      universityCourses: [],
      allConflicts: [],
      updateEventIsOpen: false,
      selectedEvent: null,
      selectedDepId: null,
    };
  }

  componentDidMount = () => {
    this.getUniversityCourses();
    // local conflicts
    setConflicts(
      this.props.changedCourses,
      this.props.changedCourses,
      "conflicts"
    );
  };
  close_details = () => {
    this.setState({
      updateEventIsOpen: false,
    });
    this.componentDidMount();
  };
  getUniversityCourses = () => {
    getGlobalCourses(
      this.props.semesterId,
      this.props.departmentId,
      this.props.selectedTimetable.id
    )
      .then((result) => {
        console.log("fitness", getFitness(this.props.changedCourses, result));
        console.log(
          this.props.teachers[0],
          this.props.openedCoursesEvents,
          result
        );

        //console.log(get_formated_Teacher_events(get_Teacher_events(this.props.teachers[0],this.props.openedCoursesEvents)))
        this.setState({
          universityCourses: result,
        });
      })
      .then(() => {
        setConflicts(
          this.props.changedCourses,
          this.state.universityCourses,
          "universityConflicts"
        );

        this.setState({
          isloading: false,
        });
        this.storeAllConflicts();
      });
  };

  getLocalConflicts = () => {
    let temp = [];
    let tempLocalConflicts = [];
    this.props.changedCourses.map((course) => {
      if (course.conflicts.length !== 0) {
        course.conflicts.map((conflict) => {
          //prevent show conflicts 2 time for each course
          if (
            conflict.conflictedCourse == undefined ||
            this.add_if_not_exists(
              [conflict.conflictedCourse.id, course.id],
              temp
            )
          ) {
            tempLocalConflicts.push({
              course1: course,
              course2: conflict.conflictedCourse,
              type: conflict.type,
              type2: "Depatment",
            });
          }
        });
      }
    });
    return tempLocalConflicts;
  };
  getGlobalConflicts = () => {
    let tempGlobalConflicts = [];
    this.props.changedCourses.map((course) => {
      if (course.universityConflicts.length !== 0) {
        course.universityConflicts.map((conflict) => {
          tempGlobalConflicts.push({
            course1: course,
            course2: conflict.conflictedCourse,
            type: conflict.type,
            type2: "global",
          });
        });
      }
    });
    return tempGlobalConflicts;
  };
  updateSelectedEvent = () => {
    this.setState({
      selectedEvent: null,
    });
  };

  storeAllConflicts = () => {
    this.setState((prev) => {
      return {
        allConflicts: this.getLocalConflicts().concat(
          this.getGlobalConflicts()
        ),
      };
    });
  };
  add_if_not_exists = (item, array) => {
    let result = true;
    array.map((item2) => {
      if (
        (item2[0] === item[0] && item2[1] === item[1]) ||
        (item2[0] === item[1] && item2[1] === item[0])
      )
        result = false;
    });
    if (result) array.push(item);
    return result;
  };

  render() {
    console.log("s", this.state);
    if (!this.state.isloading) {
      console.log("this.allConflicts", this.state, this.state.allConflicts);
    }
    return (
      <>
        {this.state.isloading ? (
          " loading"
        ) : (
          <Row style={{ marginTop: "2%", width: "100%" }}>
            <Col lg={1}></Col>
            <Col lg={11}>
              <Table bordered>
                <thead>
                  <tr
                    style={{
                      backgroundColor: "rgb(221, 232, 239)",
                      border: "3px solid rgb(212, 212, 212)",
                    }}
                  >
                    <td colSpan={4}>
                      <h5 style={{ textAlign: "center" }}>Çakışmalar</h5>
                    </td>
                  </tr>
                  <tr style={{ backgroundColor: "rgb(241, 245, 247)" }}>
                    <th></th>
                    <th>1. Ders Bilgileri</th>
                    <th>2. Ders Bilgileri</th>
                    <th>Çakışam tipi</th>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td>
                    <i class="fa fa-search" aria-hidden="true"
                     ></i>
                      <Dropdown
                        style={{marginLeft:"5%", width: "90%" }}
                        filter={true}
                        options={[{ label: "Tüm Bölümler", value: null }].concat(...this.props.departments.map((dep) => {
                          return { label: dep.name, value: dep.id };
                        }))}
                        value={this.state.selectedDepId}
                        onChange={(e) => {
                          this.setState({
                            selectedDepId: e.value,
                          });
                        }}
                      />
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {this.state.allConflicts
                    .filter((conf) => {
                      return (
                        (
                          this.state.selectedDepId == this.props.departmentId &&
                           conf.course2 == undefined)||
                        this.state.selectedDepId == null ||
                        (conf.course2 != undefined &&
                          conf.course2.Opened_course.Department_course
                            .departmentId == this.state.selectedDepId)
                      );
                    })
                    .map((conflict, index) => {
                      return (
                        <tr
                          style={{
                            borderBottom: "3px solid rgb(212, 212, 212)",
                          }}
                        >
                          <td>{index + 1}</td>
                          <td
                            onClick={() => {
                              console.log(conflict.course1);
                              this.setState({
                                selectedEvent: conflict.course1,
                                updateEventIsOpen: true,
                              });
                            }}
                            className="gri"
                          >
                            <CourseDetails
                              selectedCourse={conflict.course1}
                              conflictType={conflict.type}
                              timetableType={
                                this.props.selectedTimetable.timetableType
                              }
                            />
                            <pre>
                              Bölüm adı{"          :"}
                              {
                                this.props.departments.filter(
                                  (dep) =>
                                    dep.id ==
                                    conflict.course1.Opened_course
                                      .Department_course.departmentId
                                )[0].name
                              }
                            </pre>
                          </td>
                          <td
                            className={
                              conflict.course2 != undefined &&
                              conflict.course2.Opened_course.Department_course
                                .departmentId == this.props.departmentId
                                ? "gri"
                                : ""
                            }
                          >
                            {conflict.course2 == undefined ? (
                              ""
                            ) : (
                              <div
                                onClick={() => {
                                  if (
                                    conflict.course2 != undefined &&
                                    conflict.course2.Opened_course
                                      .Department_course.departmentId ==
                                      this.props.departmentId
                                  ) {
                                    this.setState({
                                      selectedEvent: conflict.course2,
                                      updateEventIsOpen: true,
                                    });
                                  }
                                }}
                              >
                                <CourseDetails
                                  selectedCourse={conflict.course2}
                                  conflictType={conflict.type}
                                  timetableType={
                                    this.props.selectedTimetable.timetableType
                                  }
                                />
                                <pre>
                                  Bölüm adı{"          :"}
                                  {
                                    this.props.departments.filter(
                                      (dep) =>
                                        dep.id ==
                                        conflict.course2.Opened_course
                                          .Department_course.departmentId
                                    )[0].name
                                  }
                                </pre>
                              </div>
                            )}
                          </td>
                          <td style={{ width: "15%" }}>
                            {" "}
                            {(() => {
                              switch (conflict.type) {
                                case "teacher_restriction":
                                  return "Öğretim üyesinin müsaitlik durumuna uygun değil";
                                case "classroom":
                                  return "Derslik çakışması";
                                case "teacher":
                                  return "Öğretim üyesi çakışması";
                                case "unsuitable classrom capacity":
                                  return "Sınıf kapasitesi uygun değil";
                                case "unsuitable classrom":
                                  return "sınıf özellikleri uygun değil";

                                default:
                                  return "";
                              }
                            })()}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
            </Col>
            <UpdateEvent
              addCourseEventIsOpen={this.state.updateEventIsOpen}
              close_details={this.close_details}
              selectedEvent={this.state.selectedEvent}
              updateSelectedEvent={this.updateSelectedEvent}
            />
          </Row>
        )}
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    semesterId: state.department.selectedSemester.id,
    departmentId: state.department.selectedDepartment.id,
    selectedTimetable: state.department.selectedTimetable,
    departments: state.data.departments,
    // need to be filtered now we paa all events
    openedCoursesEvents: state.data.openedCoursesEvents.map((evt) => {
      evt.startingHour =
        evt.startingHour == null ? null : new Date(evt.startingHour);
      return evt;
    }),
    changedCourses: state.data.ChangedOpenedCoursesEvents.map((evt) => {
      if (
        (course) => course.eventDate !== null && course.startingHour !== null
      ) {
        evt.startingHour =
          evt.startingHour == null ? null : new Date(evt.startingHour);
        return evt;
      }
    }),

    // unchanged
    courses: state.data.openedCoursesEvents,
    teachers: state.data.teachers,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ConflictsPage);
