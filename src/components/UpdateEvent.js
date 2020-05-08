import React, { Component } from "react";
import { Modal, Button, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

import Form from "react-bootstrap/Form";
import { connect } from "react-redux";
import { MultiSelect } from "primereact/multiselect";
import { Calendar } from "primereact/calendar";
import { filteredFetch, updateChangedCourses } from "../redux";
import { hours, days } from "../jsFiles/Constants";
import { InputText } from "primereact/inputtext";
import { getFormatedStrDate } from "../jsFiles/Functions";
import nextId from "react-id-generator";
class UpdateEvent extends Component {
  constructor() {
    super();

    this.state = {
      didMount: false
    };
  }
  componentWillReceiveProps = newProps => {
    console.log("bbb", this.props);

    let selectedTeachers = newProps.selectedEvent.teachers.map(t => {
      // let t = event_teacher.Department_Teacher.Teacher;
      t.fullName = " " + t.firstName + " " + t.lastName + "  ";

      return t;
      // make all teacher passed as a props has same structure
      // return { id: t.id, fullName: t.fullName, firstName: t.firstName, lastName:t.lastName,title:t.title };
    });
    console.log("selectedTeachers", selectedTeachers);
    // format date

    this.setState(
      {
        //   teachers:teachers1,

        selectedTeachers: selectedTeachers,
        selectedClassrooms: newProps.selectedEvent.classrooms,

        selectedStartingHours:
          newProps.selectedEvent.startingHour == null
            ? ""
            : new Date(newProps.selectedEvent.startingHour).getHours(),
        /*selectedEndingHours: String(
          new Date(newProps.selectedEvent.startingHour).getHours() +
            newProps.selectedEvent.duration -
            1
        ),*/
        selectedDate:
          newProps.selectedEvent.eventDate == null
            ? null
            : new Date(newProps.selectedEvent.eventDate),
        durationHours: Math.floor(newProps.selectedEvent.duration / 60),
        durationMinutes: newProps.selectedEvent.duration % 60,
        student_number: newProps.selectedEvent.studentNumber,
        formHeaders:
          // set headers according to timetable kind
          // may be in different languages
          newProps.selectedTimetable.timetableType == "Ders"
            ? [
                "Öğretim Üyesi",
                "Derslik",
                "Süre",
                "Başlangıç Saati",
                "Gün",
                "Süre"
              ]
            : [
                "Gözetmen",
                "Derslik",
                "Süre",
                "Başlangıç Saati",
                "Tarih",
                "Süre"
              ]

        //
      },
      () => {
        if (this.props != undefined) this.setState({ didMount: true });
      }
    );
  };
  componentDidMount = () => {
    // create teachers arry with only full name and id to make similar strcture withh passed exam teachers
    let teachers1 = this.props.teachers.map(t => {
      t.fullName = " " + t.firstName + " " + t.lastName + "  ";
      return {
        id: t.id,
        firstName: t.firstName,
        lastName: t.lastName,
        title: t.title,
        mail: t.mail,
        fullName: t.fullName,
        role: t.role,
        dapartmentTeacherId: t.Department_Teacher.id
      };
    });
    console.log("teachers1", teachers1);
    this.setState({
      teachers: teachers1,
      days: ["", ...days]
    });
  };
  changeDurationMinutes = event => {
    let { value, min, max } = event.target;
    let durationMinutes = Math.max(
      Number(min),
      Math.min(Number(max), Number(value))
    );

    this.setState({ durationMinutes });
  };
  changeDurationHours = event => {
    let { value, min, max } = event.target;
    let durationHours = Math.max(
      Number(min),
      Math.min(Number(max), Number(value))
    );

    this.setState({ durationHours });
  };
  changeCalender = e => {
    let d = e.value;
    var datestring =
      d.getFullYear() +
      "-" +
      ("0" + (d.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + d.getDate()).slice(-2);

    console.log("datestring ", datestring);
    this.setState({ selectedDate: datestring });
  };
  handleSubmit = () => {
    console.log("this.state", this.state);

    let temp_changedEvents = this.props.changedOpenedCoursesEvents.map(evt => {
      if (evt.id == this.props.selectedEvent.id) {
        evt.duration =
          this.state.durationHours * 60 + this.state.durationMinutes;
        evt.classrooms = this.state.selectedClassrooms;
        evt.teachers = this.state.selectedTeachers;
        evt.studentNumber = this.state.student_number;

        evt.startingHour =
          this.state.selectedStartingHours == ""
            ? null
            : new Date(2001, 1, 1, this.state.selectedStartingHours, 0);
        // evt.eventDate=
        if (this.state.selectedDate != null) {
          evt.eventDate =
            //if date is not converted to string convert it
            typeof this.state.selectedDate === typeof ""
              ? this.state.selectedDate
              : getFormatedStrDate(this.state.selectedDate);
        } else evt.eventDate = null;
      }
      return evt;
    });
    console.log("with diff", temp_changedEvents);
    this.props.updateChangedCourses({
      //data:   JSON.parse(JSON.stringify(allChangedCourse))  ,
      data: temp_changedEvents,
      arrayName: "ChangedOpenedCoursesEvents"
    });
    this.props.close_details();
  };

  render() {
    console.log("State is ------1------", this.state);
    return (
      <div>
        {this.state.didMount ? (
          <Modal isOpen={this.props.addCourseEventIsOpen}>
            <ModalHeader>
              <span>
                {" "}
                {this.props.selectedEvent.Opened_course.Department_course.Course
                  .name + "      "}
                {this.props.selectedTimetable.timetableType == "Ders"
                  ? ""
                  : this.props.selectedEvent.mainCourseTeacher.map(t => {
                      return (
                        <h6>
                          {"Öğretim üyesi: " +
                            t.title +
                            " " +
                            t.firstName +
                            " " +
                            t.lastName}
                        </h6>
                      );
                    })}
              </span>
            </ModalHeader>
            <ModalBody>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label> {this.state.formHeaders[0]}</Form.Label>
                <div>
                  <MultiSelect
                    key={nextId()}
                    style={{ width: "100%" }}
                    optionLabel="fullName"
                    value={this.state.selectedTeachers}
                    options={this.state.teachers}
                    onChange={e => {
                      console.log("değişti", e.value);
                      this.setState({ selectedTeachers: e.value });
                    }}
                    filter={true}
                  />
                </div>
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>{this.state.formHeaders[1]}</Form.Label>
                <div>
                  <MultiSelect
                    key={nextId()}
                    style={{ width: "100%" }}
                    optionLabel="code"
                    value={this.state.selectedClassrooms}
                    options={this.props.classrooms}
                    onChange={e => {
                      this.setState({ selectedClassrooms: e.value });
                    }}
                    filter={true}
                  />
                </div>
              </Form.Group>

              <Form.Group controlId="exampleForm.ControlSelect1">
                <p>{this.state.formHeaders[3]}
                
                {
                    this.props.selectedTimetable.timetableType == "Ders"?
                    <span style={{float :"right"}}>
                    {"Süre: "+this.state.durationHours+" : "+this.state.durationMinutes}
                </span>
                  
                :""
                }
                </p>
                <Form.Control
                  as="select"
                  style={{ width: "100%" }}
                  onChange={e => {
                    this.setState({
                      selectedStartingHours: e.target.value
                    });
                  }}
                  value={this.state.selectedStartingHours}
                >
                  {// prevent event from be out of schedule bounda
                  hours
                    .slice(
                      0,
                      hours.length -
                        (this.state.durationHours +
                          Math.ceil(this.state.durationMinutes / 60) -
                          1)
                    )
                    .map(item => {
                      return (
                        <option value={Number(item.substring(0, 2))} key={item}>
                          {item}
                        </option>
                      );
                    })}
                </Form.Control>
              </Form.Group>
              {
                this.props.selectedTimetable.timetableType == "Ders"?
                "":
                <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>{this.state.formHeaders[5]}
             
                </Form.Label>
                <div>
                  <input
                    value={this.state.durationHours}
                    onChange={this.changeDurationHours}
                    type="number"
                    min="1"
                    max="5"
                  />
                  -
                  <input
                    value={this.state.durationMinutes}
                    onChange={this.changeDurationMinutes}
                    type="number"
                    min="1"
                    max="59"
                  />
                </div>
              </Form.Group>
              }
         
              {this.props.selectedTimetable.timetableType == "Ders" ? (
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Form.Label>{this.state.formHeaders[4]}</Form.Label>

                  <Form.Control
                    as="select"
                    style={{ width: "100%" }}
                    onChange={
                      e => {
                        console.log("e", e.target.value);
                        let tempSelectedDate;
                        try {
                          tempSelectedDate = new Date(
                            this.props.selectedTimetable.days.filter(
                              day =>
                                day.dayValue == days.indexOf(e.target.value)
                            )[0].dateValue
                          );
                        } catch {
                          tempSelectedDate = null;
                        }
                        this.setState(
                          {
                            selectedDate: tempSelectedDate
                          },
                          () => {
                            console.log(this.state.selectedDate);
                          }
                        );
                      }
                      //this.setState({ selectedDay: e.target.value })
                    }
                    value={
                      this.state.selectedDate == null
                        ? ""
                        : this.state.days[this.state.selectedDate.getDay() + 1]
                    }
                  >
                    {this.state.days.map(item => {
                      return (
                        <option value={item} key={item}>
                          {item}
                        </option>
                      );
                    })}
                  </Form.Control>
                </Form.Group>
              ) : (
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>{this.state.formHeaders[4]}</Form.Label>
                  <div>
                    <Calendar
                      // locale={es}
                      value={this.state.selectedDate}
                      //onChange={e => this.setState({ selectedDate: e.value })}
                      onChange={e => this.changeCalender(e)}
                      showIcon={true}
                      style={{ width: "92%" }}
                      dateFormat={"yy-mm-dd"}
                      minDate={new Date(this.props.selectedTimetable.beginning)}
                      maxDate={new Date(this.props.selectedTimetable.ending)}
                    ></Calendar>
                  </div>
                </Form.Group>
              )}
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>Kontenjan</Form.Label>
                <div>
                  <InputText
                    type="text"
                    keyfilter="pint"
                    value={this.state.student_number}
                    onChange={e =>
                      this.setState({ student_number: e.target.value })
                    }
                  />
                </div>
              </Form.Group>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="primary"
                type="submit"
                onClick={this.handleSubmit}
              >
                Kaydet
              </Button>
              <Button onClick={this.props.close_details}>Kapat</Button>
            </ModalFooter>
            {this.props.selectedEvent.conflicts != undefined &&
            this.props.selectedEvent.conflicts.length != 0 ? (
              <div style={{ marginLeft: "3%" }}>
                <div>Çakışmalar:</div>
                <div style={{ color: "red" }}>
                  {this.props.selectedEvent.conflicts.map(conflict => {
                    if (conflict.type === "classroom") {
                      return (
                        <div>
                          {"* " +
                            conflict.conflictedCourse.Opened_course
                              .Department_course.Course.name +
                            "(" +
                            conflict.conflictedCourse.Opened_course
                              .Department_course.Course.code +
                            "," +
                            conflict.conflictedCourse.id +
                            ")" +
                            " dersi ile sınıf çakışması var"}
                        </div>
                      );
                    } else if (conflict.type === "teacher") {
                      return (
                        <div>
                          {"* " +
                            conflict.conflictedCourse.Opened_course
                              .Department_course.Course.name +
                            "(" +
                            conflict.conflictedCourse.Opened_course
                              .Department_course.Course.code +
                            "," +
                            conflict.conflictedCourse.id +
                            ")" +
                            " dersi ile öğretmen çakışması var"}
                        </div>
                      );
                    
                    } else if   ( conflict.type .startsWith("unsuitable classrom")){
                      return (
                        <div>
                          {(conflict.type === "unsuitable classrom")?
                           "* sınıf özellikleri uygun değil":
                            "* sınıf kapasitesi uygun değil"}
                        </div>
                      );
                    } 
                    
                    
                    else if (conflict.type === "teacher_restriction") {
                      return (
                        <p style={{ textAlign: "left" }}>
                          {this.props.teachers
                            .filter(
                              teacher =>
                                teacher.id ==
                                conflict.conflictedRestriction.teacherId
                            )
                            .map(teacher => (
                              <div>
                                {"* " +
                                  " " +
                                  teacher.fullName +
                                  " Öğretim üyesinin müsaitlik durumuna uygun değil"}
                              </div>
                            ))}
                        </p>
                      );
                    }
                  })}
                </div>
              </div>
            ) : (
              ""
            )}
          </Modal>
        ) : (
          ""
        )}
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    departmentId: state.department.selectedDepartment.id,
    semesterId: state.department.selectedSemester.id,
    teachers: state.data.teachers,
    classrooms: state.data.classrooms,
    selectedSemester: state.department.selectedSemester,
    changedOpenedCoursesEvents: state.data.ChangedOpenedCoursesEvents,
    openedCoursesEvents: state.data.openedCoursesEvents,
    selectedTimetable: state.department.selectedTimetable
  };
};

const mapDispatchToProps = dispatch => {
  return {
    filteredFetch: data => dispatch(filteredFetch(data)),
    updateChangedCourses: data => dispatch(updateChangedCourses(data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdateEvent);
