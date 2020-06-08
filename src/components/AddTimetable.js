import React, { Component } from "react";
import { Modal, Button, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Calendar } from "primereact/calendar";
import { fetchData } from "../redux";
import { Row, Col } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { connect } from "react-redux";
var es = {
  //  firstDayOfWeek: 0,
  dayNamesMin: ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"],
  monthNames: [
    "Ocak",
    "Şubat",
    "Mart",
    "Nisan",
    "Mayıs",
    "Haziran",
    "Temmuz",
    "Ağustos",
    "Eylül",
    "Ekim",
    "Kasım",
    "Aralık"
  ],
  //dateFormat: "dd/MM/yy"
};
class AddTimetable extends Component {
  constructor(fetchData, selectedSemester) {
    super();

    this.state = {
      startingDate: new Date(),
      endingDate: new Date(),
      timetableType: "Vize"
    };
  }

  createExamEvents = createdTimetable => {
    let openedCoursesIdes = new Set();
    // get all departments  semester events
    let dersTimetableId = this.props.selectedSemester.Timetables.filter(
      timetable => timetable.timetableType == "Ders"
    )[0].id;
    console.log("kkkkkkkkkkkkkk  dersTimetableId ", dersTimetableId);
    fetch(
      "/openedCoursesEvents/" +
        this.props.selectedSemester.id
    )
      .then(response => response.json())
      .then(courceEvents => {
        console.log(
          "/openedCoursesEvents/" +
            this.props.selectedSemester.id
        );
        courceEvents.map(evt => {
          if (evt.timetableId == dersTimetableId) {
            console.log("evt", evt);
            openedCoursesIdes.add(evt.Opened_course.id);
          }
        });
        return openedCoursesIdes;
      })
      .then(openedCoursesIdes => {
        Array.from(openedCoursesIdes).map(id => {
          let evt = {
            timetableId: createdTimetable.id,
            student_number:30,
            openedCourseId: id,
            duration:120
           
          };
          console.log("event to create ", evt)
          fetch("/addEvent", {
            method: "post",
            body: JSON.stringify({
              courseEvent: evt
            })
          }).then(response => {
            console.log("response ",response)
            if (response.ok) {
              response.json().then(json => {
                console.log("event olusturuldu ",json);
              });
            }
          });
        });
      });
  };
  handleSubmit = () => {
    fetch("/addTimetable", {
      method: "post",
      body: JSON.stringify({
        timetable: {
          semesterId: this.props.selectedSemester.id,
          timetableType: this.state.timetableType,
          beginning: this.state.startingDate,
          ending: this.state.endingDate
        }
      })
    }).then(response => {
      if (response.ok) {
        response.json().then(createdTimetable => {
          this.createExamEvents(createdTimetable);
        });
        this.props.fetchData({ arrayName: "Semesters" }).then(() => {
          this.props.close_details();
        });
      }
    });
  };
  render() {
    console.log("redux departments", this.props.departments);
    return (
      <Modal isOpen={this.props.details_is_open}>
        <ModalHeader> Takvim Ekle </ModalHeader>
        <ModalBody>
          <Form.Group controlId="exampleForm.ControlInput1">
            <Form.Label>Başlangıç Tarihi</Form.Label>
            <div>
              <Calendar
                locale={es}
                value={this.state.startingDate}
                onChange={e => this.setState({ startingDate: e.value })}
                showIcon={true}
                style={{ width: "80%" }}
              ></Calendar>
            </div>
          </Form.Group>
          <Form.Group controlId="exampleForm.ControlInput1">
            <Form.Label>Bitiş Tarihi</Form.Label>
            <div>
              <Calendar
                locale={es}
                value={this.state.endingDate}
                onChange={e => this.setState({ endingDate: e.value })}
                showIcon={true}
                style={{ width: "80%" }}
              ></Calendar>
            </div>
          </Form.Group>
          <Form.Group controlId="exampleForm.ControlSelect1">
            <Form.Label>program Türü</Form.Label>
            <Form.Control
              as="select"
              style={{ width: "86%" }}
              onChange={e => this.setState({ timetableType: e.target.value })}
            >
            
              <option key={"Vize"}>Vize</option>
              <option  key={"Final"}>Final</option>
              <option  key={"Bütünleme"}>Bütünleme</option>
            </Form.Control>
          </Form.Group>
        </ModalBody>
        <ModalFooter>
          <Button variant="primary" type="submit" onClick={this.handleSubmit}>
            Kaydet
          </Button>
          <Button onClick={this.props.close_details}>Kapat</Button>
        </ModalFooter>
      </Modal>
    );
  }
}
const mapStateToProps = state => {
  return {
    selectedSemester: state.department.selectedSemester,
    departments: state.data.departments,
    selectedDepartment: state.department.selectedDepartment
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchData: data => dispatch(fetchData(data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddTimetable);
