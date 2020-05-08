import React, { Component } from "react";

import { Row, Col } from "react-bootstrap";

import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { connect } from "react-redux";
import AddSemester from "./AddSemester";
import AddTimetable from "./AddTimetable";
import { Dropdown } from "primereact/dropdown";
import { filteredFetch, storeData,fetchTeachers } from "../redux";
import { TreeTable } from "primereact/treetable";
import { Column } from "primereact/column";
import { string } from "prop-types";
import {
  setTimeTableDays,
} from "../jsFiles/Functions";
class SemestersPage extends Component {
  constructor(
    semesters,
    selectedSemesterRedux,
    departmentId,
    filteredFetch,
    storeData,
    selectedTimetable,
  
  ) {
    super();

    this.state = {
      dropdownOpen: false,
      addSemesterIsOpen: false,
      addTimetableIsOpen: false,
      ismounted: false,
      nodes: []
    };
  }

  componentDidMount = () => {
    this.setState({
      selectedSemester: this.props.selectedSemesterRedux,
      selectedTimetable: this.props.selectedTimetable,
      nodes: this.getTabledata(this.props.semesters),
      ismounted: true
    });
  };
  updateStore=()=> {
    // if timetable or semester is changes fetch course events amd update 
    // semester and time table in redux store 
    if(this.props.selectedSemesterRedux!= this.state.selectedSemester ||
      this.props.selectedTimetable!= this.state.selectedTimetable
      ){
        console.log("xxxxxxxxxxxxxx", this.state.selectedSemester, this.state.selectedTimetable)
        this.props.storeData({varName:"selectedSemester" ,data: this.state.selectedSemester});
 
        setTimeTableDays(this.state.selectedTimetable)
        this.props.storeData({varName:"selectedTimetable" ,data: this.state.selectedTimetable});
    
        this.props.filteredFetch({
          deparmentId: this.props.departmentId,
          selectedSemester: this.state.selectedSemester,
          arrayName: "openedCoursesEvents",
          selectedTimetable: this.state.selectedTimetable
        }).then(r=>{
          console.log("xxxx filtered fetch",r)
        })

      
        console.log(this.props.selectedSemesterRedux== this.state.selectedSemester)
        console.log(this.props.selectedSemesterRedux, this.state.selectedSemester)
        console.log(this.props.selectedTimetable== this.state.selectedTimetable)
        console.log(this.props.selectedTimetable, this.state.selectedTimetable)
      }

  }

  getTabledata = semesters => {
    let i, j;
    let result = [];
    let tempRowData;
    for (i = 0; i < semesters.length; i++) {
      tempRowData = {
        key: String(i),
        data: {
          //id: semesters[i].id,
          type: semesters[i].semesterType,
          starting: semesters[i].beginning,
          ending: semesters[i].ending
        },
        children: []
      };
      for (j = 0; j < semesters[i].Timetables.length; j++) {
        tempRowData.children.push({
          key: String(i + "-" + j),
          data: {
            // id: semesters[i].Timetables[j].id,
            type: semesters[i].Timetables[j].timetableType + " Programı",
            starting: semesters[i].Timetables[j].beginning,
            ending: semesters[i].Timetables[j].ending
          }
        });
      }
      result.push(tempRowData);
    }
    return result;
  };
  close_details = () => {
    this.setState({
      addSemesterIsOpen: false,
      addTimetableIsOpen: false,
      nodes: this.getTabledata(this.props.semesters)
    });
    // update timetables in selected semester
    const selectedSemester = this.props.semesters.filter(
      semester1 => semester1.id == this.state.selectedSemester.id
    )[0];
    this.setState({ selectedSemester: selectedSemester });
    this.props.storeData({
      varName: "selectedSemester",
      data: selectedSemester
    });
  };

  toggle = () => {
    this.setState(prev => {
      return {
        dropdownOpen: !prev.dropdownOpen
      };
    });
  };
  changeTimetable = id => {
    const selectedTimetable1 = this.state.selectedSemester.Timetables.filter(
      timetable => timetable.id == id
    )[0];
    this.setState({
       selectedTimetable: selectedTimetable1 
  }, () => {
      this.updateStore();
  });
   // this.setState({ selectedTimetable: selectedTimetable1 });
  };
  changeSemester = id => {
    const selectedSemester = this.props.semesters.filter(
      semester1 => semester1.id == id
    )[0];
    this.setState({
      selectedSemester: selectedSemester,
      selectedTimetable: selectedSemester.Timetables[0]
 }, () => {
   // update teacher restriction (avalibality )if semester is changed
     this.props.fetchTeachers({ deparmentId: this.props.departmentId, arrayName: "teachers" ,semesterNo:this.state.selectedSemester.id})
     
     this.updateStore();
 });
  //  this.setState({ selectedSemester: selectedSemester });
  //  this.setState({ selectedTimetable: selectedSemester.Timetables[0] });

  };

  render() {
    console.log("render edili ------------");
    return (
      <>
        {this.state.ismounted ? (
          <div>
            <Row style={{ marginTop: "3%", width: "100%" }}>
              <Col lg={1}></Col>
              <Col lg={6}>
                <div>
                  <h3>Dönemler</h3>
                </div>
              </Col>
              <Col lg={3}>
                <Button
                  onClick={() => {
                    this.setState({ addSemesterIsOpen: true });
                  }}
                >
                  Dönem Ekle
                </Button>
              </Col>
            </Row>
            <Row style={{ marginTop: "1%", width: "100%" }}>
              <Col lg={1}></Col>

              <Col lg={7}>
                <TreeTable value={this.state.nodes} style={{ width: "104%" }}>
                  <Column field="type" header="Dönem Türü" expander></Column>
                  <Column field="starting" header="Başlangıç Tarihi"></Column>
                  <Column field="ending" header="Bitiş Tarihi"></Column>
                </TreeTable>
                <AddSemester
                  details_is_open={this.state.addSemesterIsOpen}
                  close_details={this.close_details}
                />
                <AddTimetable
                  details_is_open={this.state.addTimetableIsOpen}
                  close_details={this.close_details}
                  changeSemester={this.changeSemester}
                />
                <h1></h1>
              </Col>
            </Row>
            <Row style={{ marginTop: "3%", width: "100%" }}>
              <Col lg={1}></Col>
              <Col lg={3}>
                <div className="form-group">
                  <h1></h1>
                  <h3>Varsayılan dönem</h3>
                  <div>
                    <Dropdown
                      style={{ width: "100%" }}
                      options={this.props.semesters.map(semester => {
                        return {
                          label:
                            semester.beginning +
                            " - " +
                            semester.ending +
                            " " +
                            semester.semesterType +
                            " Dönemi",
                          value: semester.id
                        };
                      })}
                      value={this.state.selectedSemester.id}
                      onChange={e => {
                        this.changeSemester(e.value);
                      }}
                    />
                  </div>
                </div>
              </Col>

              <Col lg={3}  style={{ marginTop: "3%" }}>
                <div className="form-group">
                  <h1></h1>
                  

                  <div >
                    <Dropdown
                      style={{ width: "100%" }}
                      options={this.state.selectedSemester.Timetables.map(
                        timetable => {
                          return {
                            label: timetable.timetableType + " Programı"+ timetable.id,
                            value: timetable.id
                          };
                        }
                      )}
                      value={this.state.selectedTimetable.id}
                      onChange={e => {
                        this.changeTimetable(e.value);
                      }}
                    />
                  </div>
                </div>
              </Col>
              <Col lg={3} style={{ marginTop: "3.5%" }}>
                <Button
                  onClick={() => {
                    this.setState({ addTimetableIsOpen: true });
                  }}
                >
                  Takvim Ekle
                </Button>
              </Col>
            </Row>
          </div>
        ) : (
          ""
        )}
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    departmentId: state.department.selectedDepartment.id,
    selectedSemesterRedux: state.department.selectedSemester,
    semesters: state.data.Semesters,
    selectedTimetable: state.department.selectedTimetable,
    
  };
};

const mapDispatchToProps = dispatch => {
  return {
    filteredFetch: data => dispatch(filteredFetch(data)),
    storeData: data => dispatch(storeData(data)),
    fetchTeachers: data => dispatch(fetchTeachers(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SemestersPage);
