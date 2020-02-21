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
  dateFormat: "dd/mm/yy"
};
class AddTimetable extends Component {
  constructor(fetchData,selectedSemester) {
    super();

    this.state = {
      startingDate: new Date(),
      endingDate: new Date(),
      timetableType: "Vize"
    };
  }
  handleSubmit = () => {
    fetch("http://localhost:3004/addTimetable", {
      method: "post",
      body: JSON.stringify({
        timetable: {
            semesterId:this.props.selectedSemester.id,
        timetableType: this.state.timetableType,
          beginning: this.state.startingDate,
          ending: this.state.endingDate
        }
      })
    }).then(response => {
      if (response.ok) {
        this.props.fetchData({ arrayName: "Semesters" }).then(()=>{
            this.props.close_details();
        })
        
      }
     
    })
  };
  render() {
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
                    style={{width:"80%"}}
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
                    style={{width:"80%"}}
                  ></Calendar>
                </div>
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>program Türü</Form.Label>
                <Form.Control
                  as="select"
                  style={{width:"86%"}}
                  onChange={e =>
                    this.setState({ timetableType: e.target.value })
                  }
                >
                  <option>Vize</option>
                  <option>Final</option>
                  <option>Bütünleme</option>
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
    selectedSemester:state.department.selectedSemester
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchData: data => dispatch(fetchData(data))
    
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddTimetable);