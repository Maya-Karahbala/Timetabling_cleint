import React, { Component } from "react";
import { Calendar } from "primereact/calendar";
import { Row, Col } from "react-bootstrap";
import Form from "react-bootstrap/Form";
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
export default class Semesters extends Component {
  constructor() {
    super();

    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      startingDate: new Date(),
      endingDate: new Date()
    };
  }

  handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);

    console.log("data", data);
  }

  render() {
    return (
      <>
        <Row>
          
          <Col lg={6} style={{marginLeft:"10%"}}>
            <Form>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>Başlangıç Tarihi</Form.Label>
                <div>
                  <Calendar
                    locale={es}
                    value={this.state.startingDate}
                    onChange={e => this.setState({ startingDate: e.value })}
                    showIcon={true}
                  ></Calendar>
                </div>
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>Bitiş Tarihi</Form.Label>
                <div>
                  <Calendar
                    locale={es}
                    value={this.state.endingDate}
                    onChange={e => this.setState({ endingDatedate: e.value })}
                    showIcon={true}
                  ></Calendar>
                </div>
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>Dönem Türü</Form.Label>
                <Form.Control as="select" style={{width:"35%"}}>
                  <option>Bahar</option>
                  <option>Güz</option>
                </Form.Control>
              </Form.Group>
            </Form>
          </Col>
        </Row>
      </>
    );
  }
}

/*
  
          <label htmlFor="birthdate">Enter your birth date</label>
          <Calendar name="startingDate" locale={es}  value={this.state.date} onChange={(e) => this.setState({date: e.value})} showIcon={true} ></Calendar> */
