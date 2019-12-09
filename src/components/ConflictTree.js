import { Tree } from "primereact/tree";
import React, { Component } from "react";
import "primereact/resources/themes/nova-light/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Modal, Button, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import CourseDetails from"./CourseDetails";
export default class ConflictTree1 extends Component {
  constructor() {
    super();
    this.showDepartmentConflicts = this.showDepartmentConflicts.bind(this);
    this.showConflicts = this.showConflicts.bind(this);
    this.updateData = this.updateData.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.state = {
      nodes: null,
      expandedKeys: {},
      modal: false,
      course1:null,
      course2:null,
      conflictType:null

    };
  }
  depClassroomConflicts = [];
  depTeacherConflicts = [];
  ClassroomConflicts = [];
  TeacherConflicts = [];
  data = [];
  allConflicts = new Map();

  showDepartmentConflicts(array, type, order) {
    let temp = [];
    let counter = 0;
    this.props.scheduledCourses.map(course => {
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
                type:type
              });
              counter++;
            }
          }
        });
      }
    });
  }
  showConflicts(array, type, order) {
    let counter = 0;
    this.props.scheduledCourses.map(course => {
      if (course.universityConflicts.length !== 0) {
        course.universityConflicts.map(conflict => {
          if (conflict.type === type) {
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
              type:type
            });
            counter++;
          }
        });
      }
    });
  }
  add_if_not_exists(item, array) {
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
  }
  updateData() {
    this.data = [
      {
        key: "0",
        label: "Bölüm Çakışmaları",
        icon: "pi pi-th-large",
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
        label: "Üniversite Çakışmaları",
        icon: "pi pi-fw pi-home",
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
  }
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
    console.log(e.value);
    // open conflict details only if there is a selected conflict not header
    if (e.value.length > 3) {
      let conflict=this.allConflicts.get(e.value)
      this.setState({
          course1:conflict.course1,
          course2:conflict.course2,
          conflictType:conflict.type,
          modal:true
      }
      
      )
      
    }
  }
  toggleModal() {
    this.setState({
      modal: false
    });
  }
  
  render() {
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
    console.log("conflicts    ", this.allConflicts);
    return (
      <>
        <Tree
          
          value={this.data}
          expandedKeys={this.state.expandedKeys}
          onToggle={e => this.onToggle(e)}
          style={{ marginTop: ".5em" }}
          selectionMode="single"
          onSelectionChange={e => this.onSelectionChange(e)}
        />

        <Modal isOpen={this.state.modal}>
          
          <ModalBody >
          {(this.state.course1=== null)?
              "":
              <div>
                   <h7> 1. Ders Bilgileri</h7>   
                    <CourseDetails  selectedCourse={this.state.course1} conflictType={this.state.conflictType} />
                    <pre >Bölüm adı          :{this.props.departments.get(this.state.course1.Opened_course.Department_course.departmentId).name} </pre> 
                    <hr  style={{marginBottom:"0"}}></hr>
                    <h6 > 2. Ders Bilgileri</h6>   
                    <CourseDetails   selectedCourse={this.state.course2} conflictType={this.state.conflictType} />
                    <pre >Bölüm adı          :{this.props.departments.get(this.state.course2.Opened_course.Department_course.departmentId).name} </pre>
                  </div>
           }
          </ModalBody>
          <ModalFooter >   
            <Button color="secondary"  onClick={this.toggleModal}>
              Kapat
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}
