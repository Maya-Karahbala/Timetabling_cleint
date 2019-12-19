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
class AddSemester extends Component {
  constructor(fetchData) {
    super();

    this.state = {
      startingDate: new Date(),
      endingDate: new Date(),
      SemesterType: "Bahar"
    };
  }
  handleSubmit = () => {
    fetch("http://localhost:3004/addSemester", {
      method: "post",
      body: JSON.stringify({
        semester: {
          semesterType: this.state.SemesterType,
          beginning: this.state.startingDate,
          ending: this.state.endingDate
        }
      })
    }).then(response => {
      if (response.ok) {
        //deparmentId is not recognized
        /*response.json().then(json => {
          console.log("----------",json);
        });*/
        this.props.fetchData({ arrayName: "Semesters" });
        this.props.close_details();
      }
      console.log(response);
    });
  };
  render() {
    return (
      <Modal isOpen={this.props.details_is_open}>
        <ModalHeader> Dönem Ekle </ModalHeader>
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
                <Form.Label>Dönem Türü</Form.Label>
                <Form.Control
                  as="select"
                  style={{width:"86%"}}
                  onChange={e =>
                    this.setState({ SemesterType: e.target.value })
                  }
                >
                  <option>Bahar</option>
                  <option>Güz</option>
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
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    fetchData: data => dispatch(fetchData(data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddSemester);
