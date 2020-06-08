import React, { Component } from "react";
import { Modal, Button, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import _ from "lodash";
import Form from "react-bootstrap/Form";
import { connect } from "react-redux";
import { MultiSelect } from "primereact/multiselect";
import { Calendar } from "primereact/calendar";
import { filteredFetch, updateChangedCourses } from "../redux";
import { hours, days } from "../jsFiles/Constants";
import { InputText } from "primereact/inputtext";
import { getFormatedStrDate } from "../jsFiles/Functions";
import nextId from "react-id-generator";
import { Dialog } from "primereact/dialog";
import { setConflicts } from "../jsFiles/Conflicts";
import { getAvailabile_Times_Classrooms } from "../jsFiles/GeneticAlgorithm";
import {Dropdown} from 'primereact/dropdown';
class UpdateEvent extends Component {
  constructor() {
    super();

    this.state = {
      didMount: false,
    };
  }

  componentWillReceiveProps = (newProps) => {
  
   if(newProps.selectedEvent!= undefined){

 
    let selectedTeachers = newProps.selectedEvent.teachers.map((t) => {
      // let t = event_teacher.Department_Teacher.Teacher;
      t.fullName = " " + t.firstName + " " + t.lastName + "  ";

      return t;
      // make all teacher passed as a props has same structure
      // return { id: t.id, fullName: t.fullName, firstName: t.firstName, lastName:t.lastName,title:t.title };
    });
    let selectedClassrooms = newProps.selectedEvent.classrooms.map((c) => {
     
      c.lable=
      c.departmentId==this.props.departmentId?
      c.code+" "+"*":
      c.code

      return c;
  
    });

  
    // format date

    this.setState(
      {
        selectedSuggestion:null,
        selectedEvent: _.cloneDeep(newProps.selectedEvent),
        delete_verification: false,
        selectedTeachers: selectedTeachers,
        selectedClassrooms: selectedClassrooms,
         
        selectedStartingHours:
          newProps.selectedEvent.startingHour == null
            ? ""
            : new Date(newProps.selectedEvent.startingHour).getHours(),
        
        selectedDate:
          newProps.selectedEvent.eventDate == null
            ? null
            : new Date(newProps.selectedEvent.eventDate),
        durationHours: Math.floor(newProps.selectedEvent.duration / 60),
        durationMinutes: newProps.selectedEvent.duration % 60,
        student_number: newProps.selectedEvent.studentNumber,
        delete_verification: false,
        formHeaders:
          // set headers according to timetable kind
          // may be in different languages
          newProps.selectedTimetable.timetableType == "Ders"
            ? [
                "Öğretim Üyesi/Araştırma görevlisi",
                "Derslik",
                "Süre",
                "Başlangıç Saati",
                "Gün",
                "Süre",
              ]
            : [
                "Gözetmen",
                "Derslik",
                "Süre",
                "Başlangıç Saati",
                "Tarih",
                "Süre",
              ],

        //
      },
      () => {
        
        if (this.props.selectedEvent != undefined &&this.state.selectedEvent != undefined ) {
          console.log("girdi ",this.state.selectedEvent)
          this.setSuggestions()
          this.setState({ didMount: true })
        };
      }
    );
  };
}
  setConflictsLocal = (evts) => {
    this.state.selectedEvent.duration =
      this.state.durationHours * 60 + this.state.durationMinutes;
    this.state.selectedEvent.classrooms = this.state.selectedClassrooms;
    this.state.selectedEvent.teachers = this.state.selectedTeachers;
    this.state.selectedEvent.studentNumber = this.state.student_number;

    this.state.selectedEvent.startingHour =
      this.state.selectedStartingHours == ""
        ? null
        : new Date(2001, 1, 1, this.state.selectedStartingHours, 0);
    // evt.eventDate=
    if (this.state.selectedDate != null) {
      this.state.selectedEvent.eventDate =
        //if date is not converted to string convert it
        typeof this.state.selectedDate === typeof ""
          ? this.state.selectedDate
          : getFormatedStrDate(this.state.selectedDate);
    } else this.state.selectedEvent.eventDate = null;

    setConflicts(
      [this.state.selectedEvent],
      this.props.changedOpenedCoursesEvents,
      "conflicts"
    );
    this.setState({});
  };
  componentDidMount = () => {
    // create teachers arry with only full name and id to make similar strcture withh passed exam teachers
    let teachers1 = this.props.teachers.map((t) => {
      t.fullName = " " + t.firstName + " " + t.lastName + "  ";
      return {
        id: t.id,
        firstName: t.firstName,
        lastName: t.lastName,
        title: t.title,
        mail: t.mail,
        fullName: t.fullName,
        role: t.role,
        dapartmentTeacherId: t.Department_Teacher.id,
      };
    });
    let classrooms1 = this.props.classrooms.map((c) => {
     
      c.lable=
      c.departmentId==this.props.departmentId?
      c.code+" "+"*":
      c.code

      return c;
  
    });
    this.setState({
      teachers: teachers1,
      classrooms:classrooms1,
      days: ["", ...days],
    });
  };
  changeDurationMinutes = (event) => {
    let { value, min, max } = event.target;
    let durationMinutes = Math.max(
      Number(min),
      Math.min(Number(max), Number(value))
    );

    this.setState({ durationMinutes });
  };
  changeDurationHours = (event) => {
    let { value, min, max } = event.target;
    let durationHours = Math.max(
      Number(min),
      Math.min(Number(max), Number(value))
    );

    this.setState({ durationHours });
  };
  changeCalender = (e) => {
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
  hideDeleteVerefication = () => {
    this.setState({ delete_verification: false });
  };
  setSuggestions=()=>{
    let tempDays=this.props.selectedTimetable.days.map(
      (d) => d.dateValue
    )
    let data = {
      classrooms: this.props.classrooms.filter(c=>c.departmentId==this.props.departmentId),

      hours: ["09", "13", "16"],
      //hours.slice(1,hours.length-2),
      courses: this.props.changedOpenedCoursesEvents,
      dates:
        this.props.selectedTimetable.timetableType == "Ders"
          ? //if course timetable exclude holiday hafta sonu
          tempDays.slice(0, tempDays.length - 2)
          : // if exam timetable include all days
          tempDays,
    };
    console.log("data",data)
    this.setState({
      availabile_Times_Classrooms:getAvailabile_Times_Classrooms(
        this.state.selectedEvent,
        this.props.changedOpenedCoursesEvents,
        data
      ).map(evt=>{
       
        let tempDay=
        this.props.selectedTimetable.timetableType == "Ders"?
        ("Gün : "+
        this.state.days[
          new Date(evt.eventDate).getDay() + 1
        ])
        :("Tarih : "+evt.eventDate)
        evt.lable= tempDay+",    "+
        "  Saat : "+evt.startingHour.getHours()+
        ",    Derslik : "+ evt.classrooms.map(c => c.code + " ").join(",")
        
        return evt
      })
    },()=>{
      console.log( "availabile_Times_Classrooms",
      this.state.availabile_Times_Classrooms.map(e=>{
        return{
          startingHour:e.startingHour,
          classrooms:e.classrooms[0].code,
          eventDate:e.eventDate        }
      }))
    })
    
  }
  

  updateReduxOpenedCourses=()=>{
    return  this.props
     .filteredFetch({
       deparmentId: this.props.departmentId,
       selectedSemester: this.props.selectedSemester,
       arrayName: "openedCoursesEvents",
       selectedTimetable: this.props.selectedTimetable
     })
   }


  
  handleSubmit = () => {
    console.log("this.state", this.state);

    let temp_changedEvents = this.props.changedOpenedCoursesEvents.map(
      (evt) => {
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
      }
    );
    console.log("with diff", temp_changedEvents);
    this.props.updateChangedCourses({
      //data:   JSON.parse(JSON.stringify(allChangedCourse))  ,
      data: temp_changedEvents,
      arrayName: "ChangedOpenedCoursesEvents",
    });
    this.props.close_details();
  };

  render() {
    console.log("State is ------1------", this.state);
    return (
      <div>
        {this.state.didMount && this.state.selectedEvent!= undefined ? (
          <div>
            <Modal isOpen={this.props.addCourseEventIsOpen}>
              <ModalHeader>
                <span>
                  {" "}
                  {this.props.selectedEvent.Opened_course.Department_course
                    .Course.name + "      "}
                  {this.props.selectedTimetable.timetableType == "Ders"
                    ? ""
                    : this.props.selectedEvent.mainCourseTeacher.map((t) => {
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
                <span
                  className="remove"
                  style={{ marginTop: "3%", marginRight: "3%" }}
                  onClick={() => {
                    this.props.close_details();
                  }}
                >
                  <i
                    className="fa fa-times-circle fa-lg"
                    aria-hidden="true"
                  ></i>
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
                      onChange={(e) => {
                        this.setState(
                          {
                            selectedTeachers: e.value,
                          },
                          () => {
                            //work

                            this.setConflictsLocal();
                          }
                        );
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
                      optionLabel={"lable"}
                      
                      
                      value={this.state.selectedClassrooms}
                      options={this.state.classrooms}
                      onChange={(e) => {
                        this.setState({ selectedClassrooms: e.value }, () => {
                          //work

                          this.setConflictsLocal();
                        });
                      }}
                    
                      filter={true}
                    />
                  </div>
                </Form.Group>

                <Form.Group controlId="exampleForm.ControlSelect1">
                  <p>
                    {this.state.formHeaders[3]}

                    {this.props.selectedTimetable.timetableType == "Ders" ? (
                      <span style={{ float: "right" }}>
                        {"Ders süresi: " +
                          this.state.durationHours +
                          " : " +
                          this.state.durationMinutes}
                      </span>
                    ) : (
                      ""
                    )}
                  </p>
                  <Form.Control
                    as="select"
                    style={{ width: "100%" }}
                    onChange={(e) => {
                      this.setState(
                        {
                          selectedStartingHours: e.target.value,
                        },
                        () => {
                          //work

                          this.setConflictsLocal();
                        }
                      );
                    }}
                    value={this.state.selectedStartingHours}
                  >
                    {
                      // prevent event from be out of schedule bounda
                      hours
                        .slice(
                          0,
                          hours.length -
                            (this.state.durationHours +
                              Math.ceil(this.state.durationMinutes / 60) -
                              1)
                        )
                        .map((item) => {
                          return (
                            <option
                              value={Number(item.substring(0, 2))}
                              key={item}
                            >
                              {item}
                            </option>
                          );
                        })
                    }
                  </Form.Control>
                </Form.Group>
                {this.props.selectedTimetable.timetableType == "Ders" ? (
                  ""
                ) : (
                  <Form.Group controlId="exampleForm.ControlSelect1">
                    <Form.Label>{this.state.formHeaders[5]}</Form.Label>
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
                )}

                {this.props.selectedTimetable.timetableType == "Ders" ? (
                  <Form.Group controlId="exampleForm.ControlSelect1">
                    <Form.Label>{this.state.formHeaders[4]}</Form.Label>

                    <Form.Control
                      as="select"
                      style={{ width: "100%" }}
                      onChange={
                        (e) => {
                          console.log("e", e.target.value);
                          let tempSelectedDate;
                          try {
                            tempSelectedDate = new Date(
                              this.props.selectedTimetable.days.filter(
                                (day) =>
                                  day.dayValue == days.indexOf(e.target.value)
                              )[0].dateValue
                            );
                          } catch {
                            tempSelectedDate = null;
                          }
                          this.setState(
                            {
                              selectedDate: tempSelectedDate,
                            },
                            () => {
                              this.setConflictsLocal();
                            }
                          );
                        }
                        //this.setState({ selectedDay: e.target.value })
                      }
                      value={
                        this.state.selectedDate == null
                          ? ""
                          : this.state.days[
                              this.state.selectedDate.getDay() + 1
                            ]
                      }
                    >
                      {this.state.days.map((item) => {
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
                        onChange={(e) => this.changeCalender(e)}
                        showIcon={true}
                        style={{ width: "92%" }}
                        dateFormat={"yy-mm-dd"}
                        minDate={
                          new Date(this.props.selectedTimetable.beginning)
                        }
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
                      onChange={(e) =>
                        this.setState(
                          { student_number: e.target.value },
                          () => {
                            this.setConflictsLocal();
                          }
                        )
                      }
                    />
                  </div>
                </Form.Group>
              </ModalBody>
              <ModalFooter>
              
              <Dropdown
                      key={nextId()}
                      style={{marginLeft:"-20%", width:"10%"}}
                      placeholder="Öneriler"
                      optionLabel={"lable"}
                      value={this.state.selectedSuggestion}
                      options={this.state.availabile_Times_Classrooms}
                      onChange={(e) => {
                        console.log("e",e)
                        this.state.selectedEvent=e.value;
                        console.log("ethis.state.selectedEvent",this.state.selectedEvent)
                        this.setState({
                        
                          selectedClassrooms: this.state.selectedEvent.classrooms,
    
                          selectedStartingHours: new Date(
                            this.state.selectedEvent.startingHour
                          ).getHours(),
    
                          selectedDate: new Date(
                            this.state.selectedEvent.eventDate
                          ),
                        },()=>{
                          setConflicts(
                            [this.state.selectedEvent],
                            this.props.changedOpenedCoursesEvents,
                            "conflicts"
                          )
                        } );
                       
                      }}
                    
                      filter={true}
                    />
                <div
                style={{width:"13%"}}>

                </div>
                <Button
                  className="darkred"
                  onClick={() => {
                    this.setState({ delete_verification: true });
                  }}
                >
                  {" "}
                  Sil{" "}
                </Button>
                <Button
                  style={{ width: "20%" }}
                  className="save"
                  variant="primary"
                  type="submit"
                  onClick={this.handleSubmit}
                >
                  Kaydet
                </Button>
              
              </ModalFooter>
              {this.state.selectedEvent.conflicts != undefined &&
              this.state.selectedEvent.conflicts.length != 0 ? (
                <div style={{ marginLeft: "3%" }}>
                  <div>Çakışmalar:</div>
                  <div style={{ color: "red" }}>
                    {this.state.selectedEvent.conflicts.map((conflict) => {
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
                              " dersi ile derslik çakışması var"}
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
                              " dersi ile öğretim üyesi çakışması var"}
                          </div>
                        );
                      } else if (
                        conflict.type.startsWith("unsuitable classrom")
                      ) {
                        return (
                          <div>
                            {conflict.type === "unsuitable classrom"
                              ? "* sınıf özellikleri uygun değil"
                              : "* sınıf kapasitesi uygun değil"}
                          </div>
                        );
                      } else if (conflict.type === "teacher_restriction") {
                        return (
                          <p style={{ textAlign: "left" }}>
                            {this.props.teachers
                              .filter(
                                (teacher) =>
                                  teacher.id ==
                                  conflict.conflictedRestriction.teacherId
                              )
                              .map((teacher) => (
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
              {/** delete verfecation */}
              <Dialog
                header="Ders Sil"
                footer={
                  <div>
                    <Button
                      icon="pi pi-check"
                      onClick={() => {
                        fetch(
                          "/deleteEvent/" + this.props.selectedEvent.id
                        ).then((response) => {
                          if (response.ok) {
                            
                           
                            this.setState({
                              selectedEvent:undefined
                            },()=>{
                             console.log("filtered",this.props.changedOpenedCoursesEvents.filter(
                              (evt) => evt.id != this.props.selectedEvent.id
                            ))
                             this.props.updateSelectedEvent()
                              this.props.updateChangedCourses({
                                //data:   JSON.parse(JSON.stringify(allChangedCourse))  ,
                                data: this.props.changedOpenedCoursesEvents.filter(
                                  (evt) => evt.id != this.props.selectedEvent.id
                                ),
                                arrayName: "ChangedOpenedCoursesEvents",
                              });
                              this.updateReduxOpenedCourses();
                              this.hideDeleteVerefication();
                              setTimeout(() => {
                                this.props.close_details(); 
                              }, 50);
                              
                              if(this.props.parent=="Schedule"){
                                this.props.updateSchedule()
                              }
                              
                            })
                           
                          }
                        });
                      }}
                    >
                      Evet
                    </Button>
                    <Button
                      label="No"
                      icon="pi pi-times"
                      onClick={this.hideDeleteVerefication}
                    >
                      Hayır
                    </Button>
                  </div>
                }
                visible={this.state.delete_verification}
                style={{ width: "50vw", height: "50%" }}
                modal={true}
                onHide={this.hideDeleteVerefication}
              >
                Silmek istediğinizden emin misiniz ?
              </Dialog>
            </Modal>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    departmentId: state.department.selectedDepartment.id,
    semesterId: state.department.selectedSemester.id,
    teachers: state.data.teachers,
    classrooms: state.data.classrooms,
    selectedSemester: state.department.selectedSemester,
    changedOpenedCoursesEvents: state.data.ChangedOpenedCoursesEvents,
    openedCoursesEvents: state.data.openedCoursesEvents,
    selectedTimetable: state.department.selectedTimetable,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    filteredFetch: (data) => dispatch(filteredFetch(data)),
    updateChangedCourses: (data) => dispatch(updateChangedCourses(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdateEvent);
