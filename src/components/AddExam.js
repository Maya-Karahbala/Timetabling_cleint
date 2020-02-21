
import React, { Component } from "react";
import { Modal, Button, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

import { Row, Col } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { connect } from "react-redux";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { filteredFetch } from "../redux";
const eventTypes = [
  { label: "Vize", value: "Vize" },
  { label: "Final", value: "Final" },
  { label: "Bütünleme", value: "Bütünleme" }
];
class AddExam extends Component {
  constructor(departmentId, semesterId, teachers, classrooms,filteredFetch,selectedSemester) {
    super();

    this.state = {
      didMount: false
      
    };
  }
  componentDidMount = () => {
   
    this.props.teachers.map(t => {
      t.fullName = " " + t.firstName + " " + t.lastName + "  ";
    });
    this.setState({
      eventType: eventTypes[0].value,
      selectedTeachers: [this.props.teachers[0]],
      selectedClassrooms: [this.props.classrooms[0]],
      dersTimeTableId:this.getDersTimeTableId(this.props.selectedSemester),
     
   
    },()=>{
      if(this.props!= undefined)this.setState( {didMount: true})
      console.log("   componentDidMount           this.props.selectedCourse            ",this.props.selectedCourse);
      console.log("",this.openedCourseId)
      console.log("",this.openedCourseId)
      console.log( "this.state.selectedTeachers ",this.state.selectedTeachers)
      console.log( "this.state.selectedClassrooms ",this.state.selectedClassrooms)
      console.log("dersTimeTableId", this.getDersTimeTableId(this.props.selectedSemester))
    }
   
    );
    
   
  };
  componentWillUnmount=()=> {
  }
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
  getDersTimeTableId=(selectedSemester)=>{
     return selectedSemester.Timetables.filter(timetable=>timetable.timetableType=="Ders")[0].id
    
  }
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
            console.log("-------------data came from database openCourse-----", json);
               //update opened courses
               this.props.addOpenedCourse(json,this.props.selectedCourse)
            this.openedCourseId = json.id;
            //this.selectedCourse.Opened_courses.push(json)
          })
          .then(() => {
            console.log("this.openedCourseId", this.openedCourseId);
            let evt = {
              eventType: this.state.eventType,
              duration: this.getDuration(),
              timetableId:this.state.dersTimeTableId,
              startingHour: "",
              weekDay: "",
              openedCourseId: this.openedCourseId
            };
            this.addCourseEvent(evt);
          });
      }
    });
  };
  async  secondFunction(){
    return await this.addEventTeachers();
    // now wait for firstFunction to finish...
    // do something else
  };
  async  secondFunction2(){
    return await this.addEventClassrooms();
    // now wait for firstFunction to finish...
    // do something else
  };
  addCourseEvent = evt => {
    console.log("event to add", evt);
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
            console.log("-----------------------data came from database courseEvent  -----", json);
            this.CourseEventId = json.id;
            console.log(" this.CourseEventId", this.CourseEventId)
             /*this.addEventTeachers();
             this.addEventClassrooms();*/
             Promise.all([
             this.secondFunction(),
             this.secondFunction2()
             ]).then(()=>{
              //this.props.fetchData({deparmentId:this.props.departmentId , arrayName:"courses"})
              let courseTimetableId= this.props.selectedSemester.Timetables.filter(timetable=>timetable.timetableType=="Ders")[0].id
             


              this.props.filteredFetch({deparmentId:this.props.departmentId ,semesterNo:this.props.semesterId,  arrayName:"openedCoursesEvents",timetableId:courseTimetableId})
             //  this.props. filteredFetch({deparmentId:this.props.departmentId ,semesterNo:this.props.semesterId ,  arrayName:"ChangedOpenedCoursesEvents" ,url:"openedCoursesEvents",timetableId:courseTimetableId})
           
             })
             console.log("  fetch ekleme bitti            this.props.selectedCourse            ",this.props.selectedCourse);
             setTimeout(() => {
              console.log("kapandı ...............................")
              this.props.close_details()
             }, 100);
          
            });
         
        }
      
      })
     .then(()=>{
       //must be controled
     
      
    })
  };
  addEventTeachers=()=>{
    console.log("addEventTeachers  this.CourseEventId", this.CourseEventId)
    console.log("addEventTeachers  this.state.selectedTeachers", this.state.selectedTeachers)
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
              console.log("--------------------data came from database  eventTeacher-----", json);
             
            });
          }
        });
      });
  }
  addEventClassrooms=()=>{
     console.log("addEventClassrooms  this.CourseEventId", this.CourseEventId)
    console.log("addEventClassrooms  this.state.selectedClassrooms", this.state.selectedClassrooms)
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
              console.log("---------------data came from database  eventClassroom------", json);
            
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
      console.log("       else girdi  ")
        this.openedCourseId=opendCourseId1
        console.log("       else girdi  ",  this.openedCourseId)
        let evt = {
            eventType: this.state.eventType,
            duration: this.getDuration(),
            timetableId:this.state.dersTimeTableId,
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
            <ModalHeader> Sınav Ekle </ModalHeader>
            <ModalBody>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label> Sınav Türü</Form.Label>
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
                <Form.Label> Gözetmen</Form.Label>
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
              <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>Süre</Form.Label>
                <Form.Control
                  as="select"
                  style={{width:"86%"}}
                  onChange={e =>
                    this.setState({ timetableType: e.target.value })
                  }
                >
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                </Form.Control>
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
    semesterId: state.department.selectedSemester.id,
    teachers: state.data.teachers,
    classrooms: state.data.classrooms,
    selectedSemester:state.department.selectedSemester
  };
};

const mapDispatchToProps = dispatch => {
  return {
    filteredFetch : data => dispatch(filteredFetch(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddExam);
