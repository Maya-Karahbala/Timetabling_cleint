import React, { Component } from "react";

import { Row, Col } from "react-bootstrap";

import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { connect } from "react-redux";
import AddSemester from "./AddSemester"
import { fetchData,updateSelectedSemester } from "../redux";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";


 class SemestersPage extends Component {
  constructor(semesters,semesterId,departmentId,fetchData,updateSelectedSemester ) {
    super();

    this.state = {
      dropdownOpen:false,
      semesters:[],
      addSemesterIsOpen:false,
    };
  }
  
 componentDidMount=()=>{
 
   this.setState({
     semesters:this.props.semesters, 
     selectedSemester:this.props.semesterId
 
   })
 }
 close_details=()=>{
  this.setState({
    addSemesterIsOpen: false
  });
}
toggle = () => {
  this.setState(prev=>{
    return{
      dropdownOpen:!prev.dropdownOpen
    }
  })
}
 fillDropDownMenu = () => {
  const header = (
    <DropdownToggle caret className="logindepartment">
      {"  "}{"  "+this.state.selectedSemester+"  "}{"  "}
    </DropdownToggle>
  );

  // pop first department name because it is already shown in menu header
  return [
    header,
    this.state.semesters.map(semester => {
      if(semester.id!= this.state.selectedSemester){
        return (
          <DropdownItem
            onClick={() => {
             this.setState({
              selectedSemester:semester.id
             })
             
             this.props.updateSelectedSemester(semester.id)
             this.props.fetchData({deparmentId:this.props.departmentId ,semesterNo:semester.id ,  arrayName:"openedCoursesEvents"})
             this.props. fetchData({deparmentId:this.props.departmentId ,semesterNo:semester.id ,  arrayName:"ChangedOpenedCoursesEvents" ,url:"openedCoursesEvents"})
        
            }}
            key={semester.id}
          >
            {semester.id || ""}{" "}
          </DropdownItem>
        );
      }
  
    })
  ];
};

  render() {
    let semestersRows=this.props.semesters.map(semester=>{
      return(
        <tr>
        <td>{semester.id}</td>
        <td>{semester.beginning}</td>
        <td>{semester.ending}</td>
        <td>{semester.semesterType}</td>
      </tr>
      )
     
   })
    
    return (
      <>
        <Row style={{ marginTop: "3%", width:"100%" }}>
          <Col lg={1}></Col>
        
          <Col lg={5}>
            <h3>Dönemler</h3>
            <Table  bordered hover>
              <thead>
                <tr>
                  <th></th>
                  <th >Başlangıç Tarihi</th>
                  <th>Bitiş Tarihi</th>
                  <th>Dönem Türü</th>
                
                </tr>
              </thead>
              <tbody>
               {semestersRows}
              </tbody>
            </Table>
            <AddSemester details_is_open={this.state.addSemesterIsOpen} close_details={this.close_details}/>
            <Button onClick={()=>{this.setState({addSemesterIsOpen:true})}}>Dönem Ekle</Button>

         
          </Col>
        </Row>
        <Row style={{ marginTop: "3%", width:"100%" }}>
        <Col lg={1}></Col>
        <Col lg={5}>
        <div className="form-group">
              <h1></h1>
        <h3>Varsayılan dönem</h3>
        <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle} >
          {this.fillDropDownMenu()[0]}
          <DropdownMenu>{this.fillDropDownMenu()[1]}</DropdownMenu>
        </Dropdown>
      </div>
        </Col>
     
        </Row>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    departmentId: state.department.selectedDepartment.id,
    semesterId: state.department.selectedSemester,
    semesters:state.data.Semesters
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchData : data => dispatch(fetchData(data)),
    updateSelectedSemester: (semesterNo) => dispatch(updateSelectedSemester(semesterNo))
 
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SemestersPage);
