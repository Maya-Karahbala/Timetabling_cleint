import { Tree } from "primereact/tree";
import React, { Component } from "react";
import "primereact/resources/themes/nova-light/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Row, Col } from "react-bootstrap";
import { Card, Button, CardTitle, CardText } from "reactstrap";

import CourseDetails from "./CourseDetails";
import { connect } from "react-redux";
import {

  setConflicts
} from "../jsFiles/Conflicts";
import{
getGlobalCourses
}from "../jsFiles/Functions"
import{
  getFitness
} from "../jsFiles/GeneticAlgorithm";
import{
  get_Teacher_events,
  get_formated_Teacher_events
  }from "../jsFiles/Reports"
class ConflictsPage extends Component {
  constructor(departments, changedCourses, semesterId, departmentId, courses,timetableId) {
    super();
    this.showDepartmentConflicts = this.showDepartmentConflicts.bind(this);
    this.showConflicts = this.showConflicts.bind(this);
    this.updateData = this.updateData.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.state = {
      nodes: null,
      expandedKeys: {},
      modal: false,
      course1: null,
      course2: null,
      conflictType: null,
      isloading: true,
      universityCourses: []
    };
  }
  depClassroomConflicts = [];
  depTeacherConflicts = [];
  ClassroomConflicts = [];
  TeacherConflicts = [];
  data = [];
  allConflicts = new Map();
  componentDidMount = () => {
    this.getUniversityCourses();
    setConflicts(this.props.changedCourses,this.props.changedCourses,"conflicts");
  };


  getUniversityCourses = () => {
 
        getGlobalCourses(this.props.semesterId,this.props.departmentId,this.props.timetableId)
        .then(result=>{
          console.log("fitness",
          getFitness(this.props.changedCourses,result))
          console.log(this.props.teachers[0],this.props.openedCoursesEvents,result)

          //console.log(get_formated_Teacher_events(get_Teacher_events(this.props.teachers[0],this.props.openedCoursesEvents)))
          this.setState({
            universityCourses: result
          });
          
        })
        .then(()=>{
          setConflicts(this.props.changedCourses,this.state.universityCourses,"universityConflicts");
          
        this.setState({
          isloading: false
        }
        )})
       
    
      
  };


  



  showDepartmentConflicts = (array, type, order) => {
    let temp = [];
    let counter = 0;
    this.props.changedCourses.map(course => {
      if (course.conflicts.length !== 0) {
        course.conflicts.map(conflict => {
          if (conflict.type === type) {
            //prevent show conflicts 2 time for each course
            if (
              this.add_if_not_exists(
                [conflict.conflictedCourse.id, course.id],
                temp
              )
            ) {
              array.push({
                key: order + counter,
                label:
                  conflict.conflictedCourse.Opened_course.Department_course
                    .Course.code +
                  /*
                  " (id: " +
                  conflict.conflictedCourse.id +
                  ")" +*/
                  " , " +
                  course.Opened_course.Department_course.Course.code
                /*" +(id: " +
                  course.id +
                  ")"*/
              });
              this.allConflicts.set(order + counter, {
                course1: course,
                course2: conflict.conflictedCourse,
                type: type
              });
              counter++;
            }
          }
        });
      }
    });
  };
  showConflicts = (array, type, order) => {
   
    let counter = 0;
    this.props.changedCourses.map(course => {
      if (course.universityConflicts.length !== 0) {
        course.universityConflicts.map(conflict => {
          if (conflict.type === type) {
            array.push({
              key: order + counter,
              label:
                conflict.conflictedCourse.Opened_course.Department_course.Course
                  .code +
                /*
              " (id: " +
              conflict.conflictedCourse.id +
              ")" +*/
                " , " +
                course.Opened_course.Department_course.Course.code
              /*" +(id: " +
              course.id +
              ")"*/
            });
            this.allConflicts.set(order + counter, {
              course1: course,
              course2: conflict.conflictedCourse,
              type: type
            });
            counter++;
          }
        });
      }
    });
  };
  add_if_not_exists = (item, array) => {
    let result = true;
    array.map(item2 => {
      if (
        (item2[0] === item[0] && item2[1] === item[1]) ||
        (item2[0] === item[1] && item2[1] === item[0])
      )
        result = false;
    });
    if (result) array.push(item);
    return result;
  };
  updateData = () => {
    this.data = [
      {
        key: "0",
        label: "  Bölüm Çakışmaları",
        icon: "fa fa-map-marker fa-lg",
        children: [
          {
            key: "0-0",
            label: "Sınıf Çakışmaları",

            children: this.depClassroomConflicts
          },
          {
            key: "0-1",
            label: "Öğretmen Çakışmaları",
            children: this.depTeacherConflicts
          }
        ]
      },
      {
        key: "1",
        label: "  Bölümler Arası Çakışmalar",
        icon: "fa fa-university",
        children: [
          {
            key: "1-0",
            label: "Sınıf Çakışmaları",
            children: this.ClassroomConflicts
          },
          {
            key: "1-1",
            label: "Öğretmen Çakışmaları",
            children: this.TeacherConflicts
          }
        ]
      }
    ];
  };
  clear() {
    this.depClassroomConflicts = [];
    this.depTeacherConflicts = [];
    this.ClassroomConflicts = [];
    this.TeacherConflicts = [];
    this.allConflicts = new Map();
  }
  onToggle(e) {
    this.setState({ expandedKeys: e.value });
  }
  onSelectionChange(e) {
    
    // open conflict details only if there is a selected conflict not header
    if (e.value.length > 3) {
      let conflict = this.allConflicts.get(e.value);
      this.setState({
        course1: conflict.course1,
        course2: conflict.course2,
        conflictType: conflict.type,
        modal: true
      });
    }
  }
  toggleModal() {
    this.setState({
      modal: false
    });
  }

  render() {
    if (!this.state.isloading) {
      this.clear();
      this.showDepartmentConflicts(
        this.depClassroomConflicts,
        "classroom",
        "0-0-"
      );
      this.showDepartmentConflicts(this.depTeacherConflicts, "teacher", "0-1-");
      this.showConflicts(this.ClassroomConflicts, "classroom", "1-0-");
      this.showConflicts(this.TeacherConflicts, "teacher", "1-1-");
      this.updateData();
      
    }
    return (
      <>
        {this.state.isloading ? (
          ""
        ) : (
          <Row style={{ marginTop: "2%", width: "100%" }}>
            <Col lg={3} style={{ marginLeft: "5%" }}>
              <Tree
                value={this.data}
                expandedKeys={this.state.expandedKeys}
                onToggle={e => this.onToggle(e)}
                style={{ marginTop: ".5em" }}
                selectionMode="single"
                onSelectionChange={e => this.onSelectionChange(e)}
              />
            </Col>

            <Col lg={6} style={{ marginTop: "0%", marginLeft: "5%" }}>
              {this.state.course1 === null ? (
                ""
              ) : (
                <div>
                  <Row>
                    <Card body>
                      <CardTitle> 1. Ders Bilgileri</CardTitle>
                      <CardText>
                        {" "}
                        <CourseDetails
                          selectedCourse={this.state.course1}
                          conflictType={this.state.conflictType}
                        />
                        <pre>
                          Bölüm adı{"          :"}
                          {
                            this.props.departments.get(
                              this.state.course1.Opened_course.Department_course
                                .departmentId
                            ).name
                          }{" "}
                        </pre>
                      </CardText>
                    </Card>
                  </Row>
                  <Row style={{ marginTop: "-6%"}}>
                    <Card body>
                      <CardTitle> 2. Ders Bilgileri</CardTitle>
                      <CardText>
                        {" "}
                        <CourseDetails
                          selectedCourse={this.state.course2}
                          conflictType={this.state.conflictType}
                        />
                        <pre>
                          Bölüm adı{"          :"}
                          {
                            this.props.departments.get(
                              this.state.course2.Opened_course.Department_course
                                .departmentId
                            ).name
                          }{" "}
                        </pre>
                      </CardText>
                    </Card>
                  </Row>
                </div>
              )}
            </Col>
          </Row>
        )}
      </>
    );
  }
}
const mapStateToProps = state => {
  return {
    semesterId: state.department.selectedSemester.id,
    departmentId: state.department.selectedDepartment.id,
    timetableId:state.department.selectedTimetable.id,
    departments: state.department.departments,
    // need to be filtered now we paa all events
    openedCoursesEvents:state.data.openedCoursesEvents.map(evt=>{
      evt.startingHour= evt.startingHour== null? null: new Date(evt.startingHour)
      return evt
    }),
    changedCourses: state.data.ChangedOpenedCoursesEvents.map(evt=>{
     if( course => course.eventDate !== null && course.startingHour !== null){
      evt.startingHour= evt.startingHour== null? null: new Date(evt.startingHour)
      return evt
     }
    }),
    
    // unchanged
    courses: state.data.openedCoursesEvents,
    teachers:state.data.teachers
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ConflictsPage);

