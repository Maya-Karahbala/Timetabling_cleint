import React, { Component } from "react";
import { Dropdown } from "primereact/dropdown";
import { Row, Col } from "react-bootstrap";
import { connect} from "react-redux";
import { compose} from "redux";

import AddCourseEvent from "./AddCourseEvent";

import Button from "react-bootstrap/Button";
import { withRouter } from 'react-router';
import EventsTable from "./EventsTable";
// table with groups of each course

class CourseGroups extends Component {
  constructor(
    departmentId,
    semesterId,
    depCourses,
    changedOpenedCoursesEvents,
  
  ) {
    super();

    this.state = {
      didMount: false,
      addCourseEventIsOpen: false,

    };
  }
  componentDidMount = () => {
    console.log("-------",this.props.match.params.id, this.props.history)
    this.props.depCourses.map(c => (c.name = c.Course.name));
    this.setState(
      { didMount: true,
        depCourse:
        (this.props.match.params.id==undefined)?
         this.props.depCourses[0]:
         
         this.props.depCourses.filter(depCourse => depCourse.id == this.props.match.params.id)[0]
          });
 
  };

  close_details = () => {
    console.log("close details ---- ",this.props.depCourses)
    this.setState({
      addCourseEventIsOpen: false,

    });
    
  };
  addOpenedCourse=(openedCourse, course)=>{
     course.Opened_courses.push(openedCourse)
  }
  render() {
  console.log(this.state,this.props)
    return (
      <div>
        {this.state.didMount ? (
          <div>
        
            <Row style={{ marginTop: "3%", width: "100%" }}>
              <Col lg={1}></Col>
              <Col lg={9}>
                <h4>Dersler</h4>
                  
                 
                <Dropdown
                  style={{ width: "30%" }}
                  optionLabel="name"
                  value={this.state.depCourse}
                  options={this.props.depCourses}
                  onChange={e => {
                    this.setState({ depCourse: e.value });
                    
                  }}
                  filter={true}
                  filterBy="label,value"
                />
              </Col>
            </Row>
            <Row style={{ marginTop: "3%", width: "100%" }}>
              <Col lg={1}></Col>
              <Col lg={9}>
                <div style={{ marginTop: "-3%" }}>
                  <h4>
                  {this.props.selectedTimetable.timetableType == "Ders"?
                  "Gruplar":"Sınavlar"}
                  </h4>
                </div>
              </Col>
             
            </Row>
            <Row style={{ marginTop: "1%", width: "100%" }}>
              <Col lg={1}></Col>
              <Col lg={11}>
                <EventsTable
                showDepartmentName={false}
                courseId={this.state.depCourse.id}
                />
            
                 
              </Col>
            </Row>
            <Row style={{ width: "100%" }}>
            <Col lg={10}></Col>
            <Col lg={2}>
                <Button
                  style={{ marginLeft: "40%" }}
                  onClick={() => {
                    this.setState({ addCourseEventIsOpen: true });
                  }}
                >
                  {this.props.selectedTimetable.timetableType == "Ders"?
                  "Grup Ekle":"Sınav Ekle"}
                  
                </Button>
              </Col>
            </Row>

            <AddCourseEvent
              addCourseEventIsOpen={this.state.addCourseEventIsOpen}
              close_details={this.close_details}
              selectedCourse={this.state.depCourse}
              addOpenedCourse={this.addOpenedCourse}
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
    departmentId: state.department.selectedDepartment.id,
    semesterId: state.department.selectedSemester.id,
    depCourses: state.data.courses,
    changedOpenedCoursesEvents: state.data.ChangedOpenedCoursesEvents,
    selectedTimetable: state.department.selectedTimetable
   
  };
};

const mapDispatchToProps = dispatch => {
  return {
    
  };
};


export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(CourseGroups);