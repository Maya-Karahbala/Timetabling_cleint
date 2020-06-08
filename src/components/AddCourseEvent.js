import React, { Component } from "react";
import { Modal, Button, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import Form from "react-bootstrap/Form";
import { connect } from "react-redux";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import {InputText} from 'primereact/inputtext';
import { filteredFetch } from "../redux";
const eventTypes = [
  { label: " Teorik ", value: "Teorik" },
  { label: " Lab ", value: "Lab" }
];
class AddCourseEvent extends Component {
  constructor(departmentId, selectedTimetable,semesterId, teachers, classrooms,filteredFetch,selectedSemester) {
    super();

    this.state = {
      didMount: false
      
    };
  }
  clearState=()=>{
    this.setState({
      eventType: eventTypes[0].value,
      selectedTeachers: [],
      selectedClassrooms: [],
      student_number:30})
  }
  componentDidMount = () => {
   
    this.props.teachers.map(t => {
      t.fullName = " " + t.firstName + " " + t.lastName + "  ";
    });
    this.clearState();
    if(this.props!= undefined)this.setState( {didMount: true})

   
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

     // round course duration to up value
    if (this.state.eventType === "Teorik") {
      return this.props.selectedCourse.teoriDuration
    }
    return this.props.selectedCourse.labDuration  

  };
  openedCourseId = undefined;


  addOpenedCourse = openCourse => {
    return fetch("/addOpendCourse", {
      method: "post",
      body: JSON.stringify({
        opened_course: openCourse
      })
    }).then(response => {
      if (response.ok) {
        response
          .json()
          .then(json => {

            this.props.addOpenedCourse(json,this.props.selectedCourse)
            this.openedCourseId = json.id;
          })
          .then(() => {
            let evt = {
              eventType: this.state.eventType,
              duration: this.getDuration(),
              timetableId:this.props.selectedTimetable.id,
              studentNumber: this.state.student_number,
        
              openedCourseId: this.openedCourseId
              ,startingHour:null
            };
            this.addCourseEvent(evt);
          });
      }
    });
  };

 
  addCourseEvent = evt => {
    evt.Event_teachers=this.state.selectedTeachers.map(teacher => {
      return {
        dapartmentTeacherId: teacher.Department_Teacher.id
      }
      
     
    })
    evt.Event_classrooms= this.state.selectedClassrooms.map(classroom => {
      return {  classroomId: classroom.id };
     
    })
    console.log("event to add", evt);
    return fetch("/addEvent", {
      method: "post",
      body: JSON.stringify({
        courseEvent: evt
      })
    })
      .then(response => {
        if (response.ok) {
          this.props.filteredFetch({deparmentId:this.props.departmentId ,selectedSemester:this.props.selectedSemester,  arrayName:"openedCoursesEvents",selectedTimetable:this.props.selectedTimetable})
          .then(res=>{
            this.clearState()
            this.props.close_details()
          })
         
         
        }
      
      })
     
  };


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
     
        //temp.setHours(0,0)
        let evt = {
            eventType: this.state.eventType,
            duration: this.getDuration(),
            timetableId:this.props.selectedTimetable.id,    
            studentNumber: this.state.student_number,
            openedCourseId: this.openedCourseId
            ,startingHour:null
          };
          this.addCourseEvent(evt);
    }

  };

  render() {
    return (
      <div>
        
        {this.state.didMount ? (
        
          <Modal isOpen={this.props.addCourseEventIsOpen}>
            <ModalHeader> 
            {this.props.selectedTimetable.timetableType == "Ders"?
          "Grup Ekle ":"Sınav Ekle"  
          }
              
              </ModalHeader>
            <ModalBody>
            {this.props.selectedTimetable.timetableType == "Ders"?
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
              </Form.Group>:""}
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label> 
                {this.props.selectedTimetable.timetableType == "Ders"?
                  "Öğretim Üyesi/Araştırma görevlisi":
                  "Gözetmen"}</Form.Label>
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
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>Kontenjan</Form.Label>
                <div>
                <InputText type="text" keyfilter="pint" value={this.state.student_number} onChange={(e) => this.setState({student_number: e.target.value})} />
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
    semesterId: state.department.selectedSemester.id,
    teachers: state.data.teachers,
    classrooms: state.data.classrooms,
    selectedSemester:state.department.selectedSemester,
    selectedTimetable:state.department.selectedTimetable
  };
};

const mapDispatchToProps = dispatch => {
  return {
    filteredFetch : data => dispatch(filteredFetch(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddCourseEvent);
