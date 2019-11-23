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
                  this.props.selectedCourse.Opened_course.Department_course
                    .Course.code
                }{" "}
              </ModalHeader>
              <ModalBody>
              <pre>
                  Ders Adı :
                  {
                    this.props.selectedCourse.Opened_course.Department_course
                      .Course.name
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
                <pre>
                  Starting hour :{this.props.selectedCourse.startingHour}{" "}
                </pre>
            
              </ModalBody>
              <ModalFooter>
              <Button onClick={this.props.close_details}>Close</Button>
              </ModalFooter>
            </Modal>
    );
  }
}