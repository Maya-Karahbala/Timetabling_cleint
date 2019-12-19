import React, { Component } from "react";
import { Modal, Button, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

import { Row, Col } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { connect } from "react-redux";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { fetchData } from "../redux";
const eventTypes = [
  { label: " Teorik ", value: "Teorik" },
  { label: " Lab ", value: "Lab" }
];
class AddCourseEvent extends Component {
  constructor(departmentId, semesterId, teachers, classrooms,fetchData) {
    super();

    this.state = {
      didMount: false
    };
  }
  componentDidMount = () => {
    console.log(this.props.selectedCourse);
    this.props.teachers.map(t => {
      t.fullName = " " + t.firstName + " " + t.lastName + "  ";
    });
    this.setState({
      eventType: eventTypes[0].value,
      selectedTeachers: [this.props.teachers[0]],
      selectedClassrooms: [this.props.classrooms[0]],
      didMount: true
    });
  };
  getOpenCourseId = () => {
    console.log(this.props.selectedCourse);
    for (let i = 0; i < this.props.selectedCourse.Opened_courses.length; i++) {
      if (
        this.props.selectedCourse.Opened_courses[i].semesterId ===
        this.props.semesterId
      ) {
        console.log(this.props.selectedCourse.Opened_courses[i].id);
        return this.props.selectedCourse.Opened_courses[i].id;
      }
    }

    console.log(-1);
    return -1;
  };
  getDuration = () => {
    if (this.state.eventType === "Teorik") {
      return this.props.selectedCourse.Course.teoriHour;
    }
    return this.props.selectedCourse.Course.labHour;
  };
  openedCourseId = undefined;
  CourseEventId = undefined;
  addOpenedCourse = openCourse => {
    return fetch("http://localhost:3004/addOpendCourse", {
      method: "post",
      body: JSON.stringify({
        opened_course: openCourse
      })
    }).then(response => {
      if (response.ok) {
        //deparmentId is not recognized
        response
          .json()
          .then(json => {
            console.log("---*-----", json);
            this.openedCourseId = json.id;
          })
          .then(() => {
            console.log("this.openedCourseId", this.openedCourseId);
            let evt = {
              eventType: this.state.eventType,
              duration: this.getDuration(),
              startingHour: "",
              weekDay: "",
              openedCourseId: this.openedCourseId
            };
            this.addCourseEvent(evt);
          });
      }
    });
  };

  addCourseEvent = evt => {
    console.log("event", evt);
    return fetch("http://localhost:3004/addEvent", {
      method: "post",
      body: JSON.stringify({
        courseEvent: evt
      })
    })
      .then(response => {
        if (response.ok) {
          //deparmentId is not recognized
          response.json().then(json => {
            console.log("---*-----", json);
            this.CourseEventId = json.id;
          });
        }
      })
      .then(() => {
        // add event classrooms
        this.addEventTeachers();
        this.addEventClassrooms();
      }).then(()=>{
        this.props.fetchData({deparmentId:this.props.departmentId ,semesterNo:this.props.semesterId,  arrayName:"openedCoursesEvents"})
        this.props. fetchData({deparmentId:this.props.departmentId ,semesterNo:this.props.semesterId ,  arrayName:"ChangedOpenedCoursesEvents" ,url:"openedCoursesEvents"})
        this.props.close_details()
    });
  };
  addEventTeachers=()=>{
    this.state.selectedTeachers.map(teacher => {
        let eventTeacher = {
          eventId:  this.CourseEventId,
          dapartmentTeacherId: teacher.Department_Teacher.id
        };
        console.log("eventTeacher",eventTeacher)
        fetch("http://localhost:3004/addEventTeacher", {
          method: "post",
          body: JSON.stringify({
              evtTeacher: eventTeacher
          })
        }).then(response => {
          if (response.ok) {
            //deparmentId is not recognized
            response.json().then(json => {
              console.log("---*-----", json);
             
            });
          }
        });
      });
  }
  addEventClassrooms=()=>{
    this.state.selectedClassrooms.map(classroom => {
        let eventClassroom = { eventId: this.CourseEventId, classroomId: classroom.id };
       
        console.log("eventTeacher",eventClassroom)
        fetch("http://localhost:3004/addEventClassroom", {
          method: "post",
          body: JSON.stringify({
            evtClassroom: eventClassroom
          })
        }).then(response => {
          if (response.ok) {
            //deparmentId is not recognized
            response.json().then(json => {
              console.log("---*-----", json);
            
            });
          }
        });
      });
  }
  handleSubmit = () => {
    let opendCourseId1 = this.getOpenCourseId();
    if (opendCourseId1 === -1) {
      // this cours has no opend course we have to add it
      let openCourse = {
        semesterId: this.props.semesterId,
        departmentCourseId: this.props.selectedCourse.id
      };
      //update openedCourseId1
      this.addOpenedCourse(openCourse);
    }
    else{
        this.openedCourseId=opendCourseId1
        let evt = {
            eventType: this.state.eventType,
            duration: this.getDuration(),
            startingHour: "",
            weekDay: "",
            openedCourseId: this.openedCourseId
          };
          this.addCourseEvent(evt);
    }

  };

  render() {
    return (
      <div>
        {this.state.didMount ? (
          <Modal isOpen={this.props.addCourseEventIsOpen}>
            <ModalHeader> Grup Ekle </ModalHeader>
            <ModalBody>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label> Ders Türü</Form.Label>
                <div style={{ width: "100%" }}>
                  <Dropdown
                    value={this.state.eventType}
                    options={eventTypes}
                    onChange={e => {
                      this.setState({ eventType: e.value });
                    }}
                  />
                </div>
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label> Öğretim Üyesi</Form.Label>
                <div>
                  <MultiSelect
                    style={{ width: "100%" }}
                    optionLabel="fullName"
                    value={this.state.selectedTeachers}
                    options={this.props.teachers}
                    onChange={e => {
                      this.setState({ selectedTeachers: e.value });
                    }}
                    filter={true}
                  />
                </div>
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>Derslik</Form.Label>
                <div>
                  <MultiSelect
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
    semesterId: state.department.selectedSemester,
    teachers: state.data.teachers,
    classrooms: state.data.classrooms
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchData : data => dispatch(fetchData(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddCourseEvent);
