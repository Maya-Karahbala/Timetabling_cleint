import React, { Component } from "react";
import { Modal, Button, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import Form from "react-bootstrap/Form";
import { connect } from "react-redux";
import {fetchData} from "../redux";
class AddSemester extends Component {
  constructor(fetchData) {
    super();

    
    this.state = {
        startingYear:new Date().getFullYear(),
        endingYear:new Date().getFullYear(),
      SemesterType: "Bahar"
    };
  }
   
 
  getYears(){
    var result = [];
    let thisYear=new Date().getFullYear()
    for (let i =thisYear ; i < thisYear+10; i++) {
        result.push(i.toString());
    }
    return result.map(year=>{
        return      <option>{year}</option>
    })
    
  }
  handleSubmit = () => {
    fetch("http://localhost:3004/addSemester", {
      method: "post",
      body: JSON.stringify({
        semester: {
          semesterType: this.state.SemesterType,
          beginning: this.state.startingYear,
          ending: this.state.endingYear
        }
      })
    }).then(response => {
      if (response.ok) {
        //deparmentId is not recognized
        /*response.json().then(json => {
          console.log("----------",json);
        });*/
        this.props.fetchData({ arrayName: "Semesters" }).then((semesters)=>{
          console.log("semesters fetched ",semesters)
          this.props.close_details();
        
        })
        
      }
     
     
    })
  };
  render() {
    return (
      <Modal isOpen={this.props.details_is_open}>
        <ModalHeader> Dönem Ekle </ModalHeader>
        <ModalBody>
  
        <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>Başlangıç yılı</Form.Label>
                <Form.Control
                  as="select"
                  style={{width:"86%"}}
                  onChange={e =>
                    this.setState({ startingYear: e.target.value })
                  }
                >
                   {this.getYears()}
                   
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>Bitiş yılı</Form.Label>
                <Form.Control
                  as="select"
                  style={{width:"86%"}}
                  onChange={e =>
                    this.setState({ endingYear: e.target.value })
                  }
                >
                   {this.getYears()}
                   
                </Form.Control>
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
    fetchData : data => dispatch(fetchData(data)),
   
};
}

export default connect(mapStateToProps, mapDispatchToProps)(AddSemester);