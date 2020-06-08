import React, { Component } from "react";

import { Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import Table from "react-bootstrap/Table";

import Button from "react-bootstrap/Button";
import nextId from "react-id-generator";
import {Growl} from 'primereact/growl';
import {
  get_changed_Courses,
  send_changedCourses_to_server,
  getformatedStartingEndingHours,
  getTimetableName,
  getFormatedStrDateLocal,
  minutes_to_hours_convert,
  orderByDateAndTime
} from "../jsFiles/Functions";

import {
  get_AllEvents_ExcelList,
} from "../jsFiles/Reports";
import { filteredFetch } from "../redux";
import UpdateEvent from "./UpdateEvent";
import { setConflicts } from "../jsFiles/Conflicts";
import { days } from "../jsFiles/Constants";
import ReactExport from "react-data-export";
import EventsTable from "./EventsTable";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
//  contanis table that show all events in one table and include file downloads
class CourseEvents extends Component {
  constructor() {
    super();

    this.state = {
      didMount: false,
     
      updateEventIsOpen: false
    };
  }
  componentDidMount = () => {
    console.log("did mount");
   
     
        this.setState({
          didMount: true,

          timetableName: getTimetableName(
            this.props.selectedDepartment,
            this.props.selectedSemester,
            this.props.selectedTimetable
          ),
        
          tableHeaders:
            this.props.selectedTimetable.timetableType == "Ders"
              ? [
                  "Dersin Kodu",
                  "Dersin Adı",
                  "Öğretim Üyesi",
                  "Araştırma Görevlisi",
                  "Derslik",
                  "Süre",
                  "Saat",
                  "Gün"
                ]
              : [
                  "Dersin Kodu",
                  "Dersin Adı",
                  "Öğretim Üyesi",
                  "Gözetmen",
                  "Derslik",
                  "Süre",
                  "Saat",
                  "Gün",
                  "Tarih"
                ]
        });
        setConflicts(
          this.props.changedOpenedCoursesEvents,
          this.props.changedOpenedCoursesEvents,
          "conflicts"
        );
 
  
  };


  


  savaChanges=()=>{
    console.log("dikkat",this.props.changedOpenedCoursesEvents,
    this.props.openedCoursesEvents)
    let changedEvents = get_changed_Courses(
      this.props.changedOpenedCoursesEvents,
      this.props.openedCoursesEvents
    );

    console.log("changedEvents", changedEvents);
    if (changedEvents.length != 0) {
      send_changedCourses_to_server(changedEvents).then(() => {
        // !!  must be controled and fetched after reqquest from db come
        setTimeout(() => {
          this.props
            .filteredFetch({
              deparmentId: this.props.selectedDepartment.id,
              selectedSemester: this.props.selectedSemester,
              arrayName: "openedCoursesEvents",
              selectedTimetable: this.props.selectedTimetable
            })
            .then(() => {
              this.growl.show({severity: 'success', summary: '', detail: 'değişiklikler kaydedildi'});
              this.changed = [];

            });
        }, 500);
      });
    }
  }

  render() {
    //console.log("this.props ---", this.props);
    return (
      <div>
        {this.state.didMount ? (
          <div>

            <Row style=
            {{ marginTop: this.state.alertVisble?"0%": "3%", width: "100%" }}>
              <Col lg={1}>
              <Growl ref={(el) => this.growl = el} />
              </Col>
              <Col lg={11}>
              <EventsTable
              showDepartmentName={true}
              />
              </Col>
            </Row>
            <Row 
            style=
            {{  width: "100%" }}
            >
              <Col lg={8}></Col>
              <Col lg={2}>
           
                </Col>
                <Col lg={2} >
                <ExcelFile
                  element={<Button style={{ marginRight: "3%" }}>
                    <i className="fa fa-file-excel-o" aria-hidden="true"></i>
                    {"  "}indir</Button>}
                  filename={this.state.timetableName}
                >
                  <ExcelSheet
                    dataSet={get_AllEvents_ExcelList(
                      this.state.tableHeaders,
                      this.props.changedOpenedCoursesEvents,
                      this.props.selectedSemester,
                      this.props.selectedTimetable,
                      this.props.selectedDepartment
                    )}
                    name="Organization"
                  />
                </ExcelFile>
                <Button
               
                  onClick={this.savaChanges}
                >
                  Kaydet
                </Button>
              </Col>

            </Row>
           
         
          
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    selectedDepartment: state.department.selectedDepartment,
    selectedSemester: state.department.selectedSemester,
    selectedTimetable: state.department.selectedTimetable,
    openedCoursesEvents: state.data.openedCoursesEvents.map(evt=>{
      evt.startingHour= evt.startingHour== null? null: new Date(evt.startingHour)
      return evt
    }),
    changedOpenedCoursesEvents: state.data.ChangedOpenedCoursesEvents.map(evt=>{
      evt.startingHour= evt.startingHour== null? null: new Date(evt.startingHour)
      return evt
    }),
    teachers: state.data.teachers
  };
};

const mapDispatchToProps = dispatch => {
  return {
    filteredFetch: data => dispatch(filteredFetch(data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CourseEvents);
