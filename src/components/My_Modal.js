import React, { Component } from "react";
import { Modal, Button, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

export default class My_Modal extends Component {
  render() {
    
    return (
      <Modal isOpen={this.props.details_is_open}>
        <ModalHeader>
          {" "}
          Ders Kodu :{" "}
          {
            this.props.selectedCourse.Opened_course.Department_course.Course
              .code
          }{" "}
        </ModalHeader>
        <ModalBody>
          <pre>
            Ders Adı :
            {
              this.props.selectedCourse.Opened_course.Department_course.Course
                .name
            }
          </pre>
          <pre>
            Öğretim Elemanları :
            {this.props.selectedCourse.Event_teachers.map(
              t =>
                t.Department_Teacher.Teacher.firstName +
                " " +
                t.Department_Teacher.Teacher.lastName
            ) + " "}{" "}
          </pre>
          <pre>
            Derslik :
            {this.props.selectedCourse.Event_classrooms.map(
              e => e.Classroom.code + " "
            )}
          </pre>
          <pre>Ders :{this.props.selectedCourse.eventType}</pre>
          <pre>Başlangıç saat :{this.props.selectedCourse.startingHour} </pre>
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

           {this.props.selectedCourse.universityConflicts.length !== 0 ? (
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
          )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={this.props.close_details}>Kapat</Button>
        </ModalFooter>
      </Modal>
    );
  }
}
