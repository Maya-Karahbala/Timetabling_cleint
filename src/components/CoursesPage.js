import React, { Component } from "react";
import { Dropdown } from "primereact/dropdown";
import { Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import Table from "react-bootstrap/Table";
import AddCourseEvent from "./AddCourseEvent";
import Button from "react-bootstrap/Button";

class CoursesPage extends Component {
  constructor(
    departmentId,
    semesterId,
    depCourses,
    changedOpenedCoursesEvents
  ) {
    super();

    this.state = {
      didMount: false,
      addCourseEventIsOpen: false
    };
  }
  componentDidMount = () => {
    this.props.depCourses.map(c => (c.name = c.Course.name));
    this.setState({ depCourse: this.props.depCourses[0], didMount: true });
 
  };

  close_details = () => {
    this.setState({
      addCourseEventIsOpen: false
    });
  };
  render() {
   
    return (
      <div>
        {this.state.didMount ? (
          <div>
            <Row style={{ marginTop: "3%", width: "100%" }}>
              <Col lg={1}></Col>
              <Col lg={9}>
                <h3> Dersler</h3>
                <Dropdown
                  style={{ width: "30%" }}
                  optionLabel="name"
                  value={this.state.depCourse}
                  options={this.props.depCourses}
                  onChange={e => {
                    this.setState({ depCourse: e.value });
                    
                  }}
                  filter={true}
                  filterBy="label,value"
                />
              </Col>
            </Row>
            <Row style={{ marginTop: "3%", width: "100%" }}>
              <Col lg={1}></Col>
              <Col lg={7}>
                <div>
                  <h3>Gruplar</h3>
                </div>
              </Col>
              <Col lg={3}>
                <Button
                  style={{ marginLeft: "-3%" }}
                  onClick={() => {
                    this.setState({ addCourseEventIsOpen: true });
                  }}
                >
                  Grup Ekle
                </Button>
              </Col>
            </Row>
            <Row style={{ marginTop: "1%", width: "100%" }}>
              <Col lg={1}></Col>
              <Col lg={8}>
                <Table bordered hover>
                  <thead>
                    <tr>
                      <th>Ders Türü</th>
                      <th>Öğretim Üyesi</th>
                      <th>Derslik</th>
                      <th>Süre</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.props.changedOpenedCoursesEvents.map(evt => {
                      if (
                        evt.Opened_course.Department_course.id ===
                        this.state.depCourse.id
                      ) {
                        return (
                          <tr key={evt.id}>
                            <td>{evt.eventType}</td>

                            <td>
                              {evt.Event_teachers.map(
                                t =>
                                  t.Department_Teacher.Teacher.firstName +
                                  " " +
                                  t.Department_Teacher.Teacher.lastName
                              ) + " "}
                            </td>
                            <td>
                              {evt.Event_classrooms.map(
                                e => e.Classroom.code + " "
                              )}
                            </td>
                            <td>{evt.duration}</td>
                          </tr>
                        );
                      }
                    })}
                  </tbody>
                </Table>
              </Col>
            </Row>
            <AddCourseEvent
              addCourseEventIsOpen={this.state.addCourseEventIsOpen}
              close_details={this.close_details}
              selectedCourse={this.state.depCourse}
            />
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
    departmentId: state.department.selectedDepartment.id,
    semesterId: state.department.selectedSemester,
    depCourses: state.data.courses,
    changedOpenedCoursesEvents: state.data.ChangedOpenedCoursesEvents
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(CoursesPage);
/*

    <Dropdown
          value={this.state.city}
          options={citySelectItems}
          onChange={e => {
            this.setState({ city: e.value });
          }}
          placeholder="Select a City"
        />

        */
