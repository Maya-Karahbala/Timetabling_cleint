import React, { Component } from "react";
import { Modal, Button, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import CourseDetails from"./CourseDetails";
export default class My_Modal extends Component {
  render() {
    
    return (
      <Modal isOpen={this.props.details_is_open}>
        <ModalHeader>
          {" "}
          Ders Bilgileri
          {" "}
        </ModalHeader>
        <ModalBody>
          <CourseDetails  selectedCourse={this.props.selectedCourse}/>
          {this.props.selectedCourse.conflicts.length !== 0 ? (
            <pre>
            <div >Bölüm çakışmaları :</div>
            <div style={{color: "red"}}>
              
              {this.props.selectedCourse.conflicts.map(conflict => (
                conflict.type==="classroom"?
                <p>{ conflict.conflictedCourse.Opened_course.Department_course.Course
                  .name+"("+conflict.conflictedCourse.Opened_course.Department_course.Course
                  .code +")"+" dersi ile sınıf çakışması var"}</p>:
                  <p>{ conflict.conflictedCourse.Opened_course.Department_course.Course
                    .name+"("+conflict.conflictedCourse.Opened_course.Department_course.Course
                    .code +")"+" dersi ile Öğretmen çakışması var"}</p>
              ))}
            </div>
            </pre>
          ) : (
            ""
          )}

           {/*this.props.selectedCourse.universityConflicts.length !== 0 ? (
            <pre>
            <div >Üniversite çakışmaları :</div>
            <div style={{color: "red"}}>
              
              {this.props.selectedCourse.universityConflicts.map(conflict => (
                conflict.type==="classroom"?
                <p>{ conflict.conflictedCourse.Opened_course.Department_course.Course
                  .name+"("+conflict.conflictedCourse.Opened_course.Department_course.Course
                  .code +")"+" dersi ile sınıf çakışması var"}</p>:
                  <p>{ conflict.conflictedCourse.Opened_course.Department_course.Course
                    .name+"("+conflict.conflictedCourse.Opened_course.Department_course.Course
                    .code +")"+" dersi ile Öğretmen çakışması var"}</p>
              ))}
            </div>
            </pre>
          ) : (
            ""
          )*/}
        </ModalBody>
        <ModalFooter>
          <Button onClick={this.props.close_details}>Kapat</Button>
        </ModalFooter>
      </Modal>
    );
  }
}
