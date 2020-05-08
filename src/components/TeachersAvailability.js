import React, { Component } from "react";
import { connect } from "react-redux";
import Table from "react-bootstrap/Table";
import { Row, Col, Tab } from "react-bootstrap";
import nextId from "react-id-generator";
import {
  get_formated_Teacher_events,
  get_formated_Teacher_restrictions
} from "../jsFiles/Reports";
import Button from "react-bootstrap/Button";
import { Alert } from "reactstrap";
import { getFormatedStrDate } from "../jsFiles/Functions";
import { days, hours } from "../jsFiles/Constants";
import { object } from "prop-types";
import { compose } from "redux";
import { fetchTeachers } from "../redux";
class TeachersAvailability extends Component {
  constructor() {
    super();
    this.state = {
      didMount: false,

    };
  }
  componentDidMount = () => {
    this.setState({
      didMount: true,
      teachersRestrictions: this.props.teachers.map(teacher => {
        return {
          teacher: teacher,
          restrictions: get_formated_Teacher_restrictions(
            teacher.Teacher_restrictions
          )
        };
      })
    });
  };
  updateTeacherRestrictions(teacher, restrictions) {
    this.setState(prevState => {
      return {
        teachersRestrictions: prevState.teachersRestrictions.map(data => {
          if (data.teacher.id == teacher.id) {
            data.restrictions = restrictions;
          }
          return data;
        })
      };
    });
  }
  changeVerticalLine=(teacher,restrictionsList,index,value)=>{
    for (let i = 0; i < restrictionsList.length; i++) {
      for (let j = 0; j < restrictionsList[i].length; j++) {
        if (j == index + 1) {
          // if week day cell is pressed flip all timeslots of that week day 
          if(value=="flip")
          restrictionsList[i][j] = !restrictionsList[i][j];
          else
          restrictionsList[i][j] = value;
        }
      }
    }
    this.updateTeacherRestrictions(
      teacher,
      restrictionsList
    );
  }
  getTeacherTables = (teacher, restrictionsList) => {
    return (
      <Table>
        <thead>
          <tr key={nextId()}>
            {/** clear button */}
            <td
              key={nextId()}
              onClick={e => {
                for (let i = 0; i < restrictionsList.length; i++) {
                  for (let j = 1; j < restrictionsList[i].length; j++) {
                    restrictionsList[i][j] = false;
                  }
                }
                this.updateTeacherRestrictions(teacher, restrictionsList);
              }}
            >
              <i className="fa fa-undo" aria-hidden="true"></i>
            </td>
            {// exclude holidays

            days.slice(1, days.length - 1).map((day, index) => {
              return (
                <td
                  key={nextId()}
                  onClick={e => {
                    this.changeVerticalLine(teacher,restrictionsList,index,"flip")
                  }}
                >
                  <i className="arrow down greenborder" 
                   onClick={e => {
                    this.changeVerticalLine(teacher,restrictionsList,index,true)
                  }}></i>
                  {day}
                  <i className="arrow down redborder"
                   onClick={e => {
                    this.changeVerticalLine(teacher,restrictionsList,index,false)
                  }}></i>
                </td>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {restrictionsList.map((restrictions, index2) => {
            let result = [];
            for (let i = 1; i < restrictions.length; i++) {
              result.push(
                <td
                  key={nextId()}
                  style={{
                    backgroundColor: restrictions[i] == true ? "red" : "green"
                  }}
                  onClick={e => {

                    restrictions[i] = !restrictions[i];
                    console.log(i, "basıldı", teacher, restrictions[0]);
                    console.log(restrictionsList);
                    this.updateTeacherRestrictions(
                      teacher,
                      restrictionsList
                    );
                  }}
                >
                  {""}
                </td>
              );
            }

            return (
              <tr key={teacher.id + "" + index2}>
                {/*row hour*/}
                <td
                  key={nextId()}
                  style={{ fontSize: "6px" }}
                  onClick={e => {
                    console.log(restrictions);
                    for (let i = 1; i < restrictions.length; i++) {
                      // if one hour is pressed change all days time slots 
                      restrictions[i] = !restrictions[i];
                    }
                    this.updateTeacherRestrictions(
                      teacher,
                      restrictionsList
                    );
                  }}
                >
                  {restrictions[0]}
                </td>
                {result}
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  };
  getTeachersRestrictions= (teachersRestrictions)=>{
    // format all teachers events to send to database
    let deletedIdes=[]
    let newRestrictins=[]
    teachersRestrictions.map((data)=>{
     let tempDate= this.getTeacherRestrictions(data.teacher, data.restrictions)
     deletedIdes.push(...tempDate.deletedIdes)
     newRestrictins.push(...tempDate.data)
    })
    return {data:newRestrictins, deletedIdes:deletedIdes};
  }
  getTeacherRestrictions = (teacher, restictions) => {
    // format to send to database
    // rstrictions are merged if they are successive
    console.log("girdi", restictions, teacher);
    //{teacher, restictions}
    let formatedRestrictions = [];
    for (let i = 0; i < restictions[0].length; i++) {
      //column day
      for (let j = 0; j < restictions.length; j++) {
        // row hour
        if (
          j - 1 >=0 &&
          restictions[j - 1][i] == true &&
          restictions[j][i] == true
        ) {
          //if there is an existing restriction in previous hour just merge them
          formatedRestrictions[formatedRestrictions.length - 1].duration =
            formatedRestrictions[formatedRestrictions.length - 1].duration + 60;
        } else if (restictions[j][i] == true) {
          let tempDate = new Date(
            this.props.selectedTimetable.days.filter(
              day => day.dayValue == i
            )[0].dateValue
          );
          tempDate.setHours(restictions[j][0].substr(0, 2), 0);

          formatedRestrictions.push({
            teacherId: teacher.id,
            semesterId: this.props.selectedSemester.id,
            startingHour: tempDate,
            //day: i,
            //hour: restictions[j][0],
            duration: 60
          });
        }
      }
    }
    console.log(
      "formatedRestrictions",
      formatedRestrictions,
      teacher.Teacher_restrictions
    );

    formatedRestrictions.map(restriction2 => {
      teacher.Teacher_restrictions.map(restiction => {
        if (
          restiction.duration == restriction2.duration &&
          restiction.semesterId == restriction2.semesterId &&
          restiction.startingHour.valueOf() ==
            restriction2.startingHour.valueOf() &&
          restiction.teacherId == restriction2.teacherId
        ){
          console.log("id", typeof(restriction2.id))
          restriction2.id= restiction.id
       
        }
      });
    });
        // now we have a list with new restrictions and old restrictions that has id
    // now check if any of restriction has been deleted (exists in Teacher restrictions and not in list)
    let  OldIdes=teacher.Teacher_restrictions.map(restiction=>{
      return restiction.id
    })
    let newIdes=formatedRestrictions.filter(restiction=>
     typeof(restiction.id)!= "undefined" 
   ).map(restiction=> restiction.id)

   // deleted ides exists in old list and not in new
   let deletedIdes=OldIdes.filter(id=> !(newIdes.includes(id)))
   
   console.log(OldIdes,newIdes,deletedIdes,"old new deleted")
    formatedRestrictions=formatedRestrictions.filter(restiction => typeof(restiction.id)== "undefined")
    console.log(
      "formatedRestrictions after filter",
      formatedRestrictions,
     // teacher.Teacher_restrictions
    );

    return {data:formatedRestrictions, deletedIdes:deletedIdes};
  };
 
  send_restrictions_to_server = data => {
    if(data.deletedIdes.length!=0|| data.data.length!=0){
      return fetch("/updateTeacherRestrictions", {
        method: "post",
        body: JSON.stringify(data)
      }).then(response => {
        console.log("response ", response);
        if (response.ok) {
       
          this.props.fetchTeachers({ deparmentId: this.props.selectedDepartment.id, arrayName: "teachers" ,semesterNo:this.props.selectedSemester.id}).then(()=>{
            console.log("this.props",this.props)
            this.setState({})
          })
          console.log("degişikliker kaydedildi");
        }
      });
    }
   
  };

  render() {
    console.log(this.state);

    return (
      <>
        {this.state.didMount == false ? (
          ""
        ) : (
          <div>
            {console.log("getTeachersRestrictions",
            this.getTeachersRestrictions(this.state.teachersRestrictions)
            ,"all",
          this.state.teachersRestrictions)
            /*  console.log("con",
              this.getTeacherRestrictions(
                this.state.teachersRestrictions[0].teacher,
                this.state.teachersRestrictions[0].restrictions
              )
              )*/}
            <Row
              style={{
                marginTop: this.state.alertVisble ? "0%" : "3%",
                width: "100%"
              }}
            >
              <Col lg={1}></Col>
              <Col lg={11}>
                <Button
                  onClick={() => {
                    console.log("buttton",
                    this.getTeachersRestrictions(this.state.teachersRestrictions)
            )
                    this.send_restrictions_to_server(
                      this.getTeachersRestrictions(this.state.teachersRestrictions)
                    );
                  }}
                >
                  Kaydet
                </Button>
                <Table
                  bordered
                  hover
                  id="table-to-xls"
                  style={{ textAlign: "center" }}
                >
                  <thead>
                    <tr>
                      <th>Öğretim üyesi</th>
                      <th>Uygunluk durumu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.teachersRestrictions.map((data, index) => {
                      let t = data.teacher;
                      let restrictions = data.restrictions;
                      return (
                        <tr key={t.id + "" + index}>
                          <td key={nextId()}>
                            <div style={{ marginTop: "25%",marginBottom: "25%"}}>
                              {t.title + " " + t.firstName + " " + t.lastName}
                            </div>
                          </td>
                          <td>{this.getTeacherTables(t, restrictions)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </div>
        )}
      </>
    );
  }
}
const mapStateToProps = state => {
  return {
    selectedDepartment: state.department.selectedDepartment,
    selectedSemester: state.department.selectedSemester,
    selectedTimetable: 
    state.department.selectedSemester.Timetables.filter(timetable=>timetable.timetableType=="Ders")[0],
    teachers: state.data.teachers.map(teacher => {
      teacher.Teacher_restrictions.map(teacher_restriction => {
        teacher_restriction.startingHour =
          teacher_restriction.startingHour == null
            ? null
            : new Date(teacher_restriction.startingHour);
        // add eventdate as string tm make restriction structure same as event and use same functions
       
        return teacher_restriction;
      });
      return teacher;
    })
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchTeachers: data => dispatch(fetchTeachers(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TeachersAvailability);
/**
 *        console.log(
          "compare startingHour",
          (

            restiction.startingHour.valueOf() ==
              restriction2.startingHour.valueOf() 

          )
        );
        console.log(
          "compare duration",
          (
            restiction.duration == restriction2.duration 
     
          )
        );
        console.log(
          "compare semesterId",
         (
           
            restiction.semesterId == restriction2.semesterId 
           
          )
        );
        console.log(
          "compare teacherId",
          (
       
            restiction.teacherId == restriction2.teacherId
          )
        );

 */