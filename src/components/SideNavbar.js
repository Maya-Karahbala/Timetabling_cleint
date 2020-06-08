import React, { Component } from "react";
import SideNav, {
  Toggle,
  Nav,
  NavItem,
  NavIcon,
  NavText,
} from "@trendmicro/react-sidenav";
import SemestersPage from "./SemestersPage";
import Schedule from "./Schedule";
import ConflictsPage from "./ConflictsPage";
import CourseGroups from "./CourseGroups";
import CourseEvents from "./CourseEvents";

import TeachersAvailability from "./TeachersAvailability";
// for dep info
import styled from "styled-components";
import { connect, useSelector } from "react-redux";
import "@trendmicro/react-sidenav/dist/react-sidenav.css";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import App from "../App";

import Test from "./Test";
import Login from "./Login";
// for icon
const NavInfoPane = styled.div`
  float: left;
  width: 100%;
  padding: 10px 20px;
  background-color: rgb(138, 148, 148);
  font-size: 0.94rem;

  color: #0e0101;
`;
class SideNavbar extends Component {
  constructor(departmentName, userFullName, history) {
    super();
    this.state = {
      expanded: false,
      showNavbar: true,
    };
  }
  componentWillReceiveProps = () => {
    this.setState({ showNavbar: this.props.show });
  };

  render() {
    return (
      <>
        <Router>
          <Route
            render={({ location, history }) => (
              <div>
                {this.state.showNavbar ? (
                  <SideNav
                    style={{ height: "100%" }}
                    expanded={this.state.expanded}
                    onToggle={(expanded) => {
                      this.setState({ expanded });
                    }}
                    onSelect={(selected) => {
                      const to = "/" + selected;
                      if (location.pathname !== to) {
                        history.push(to);
                        this.setState({ expanded: false });
                      }
                    }}
                  >
                    <SideNav.Toggle />
                    {this.state.expanded && (
                      <NavInfoPane>
                        <div>{this.props.departmentName}</div>

                        <div>
                          {" "}
                          {this.props.selectedSemester.beginning +
                            " - " +
                            this.props.selectedSemester.ending +
                            " " +
                            this.props.selectedSemester.semesterType +
                            " Dönemi"}
                        </div>
                        <div>
                          {" "}
                          {this.props.selectedTimetable.timetableType +
                            " Programı"}
                        </div>
                        <div>Kullanıcı Adı : {this.props.userFullName}</div>
                      </NavInfoPane>
                    )}

                    <SideNav.Nav defaultSelected="Schedule">
                      <NavItem eventKey="Schedule">
                        <NavIcon>
                          <i
                            className="fa fa-calendar"
                            style={{ fontSize: "1.75em" }}
                          />
                        </NavIcon>
                        {this.props.selectedTimetable.timetableType ==
                        "Ders" ? (
                          <NavText>Ders Programı</NavText>
                        ) : (
                          <NavText>Sınav Programı</NavText>
                        )}
                      </NavItem>

                      <NavItem eventKey="CourseGroups">
                        <NavIcon>
                          <i
                            className="fa fa-plus"
                            style={{ fontSize: "1.75em" }}
                          />
                        </NavIcon>
                        <NavText>
                          {this.props.selectedTimetable.timetableType == "Ders"
                            ? "Ders ekle"
                            : "Sınav ekle"}
                        </NavText>
                      </NavItem>

                      <NavItem eventKey="CourseEvents">
                        <NavIcon>
                          <i
                            className="fa fa-graduation-cap"
                            style={{ fontSize: "1.75em" }}
                          />
                        </NavIcon>
                        {this.props.selectedTimetable.timetableType ==
                        "Ders" ? (
                          <NavText>Dersler</NavText>
                        ) : (
                          <NavText>Sınavlar</NavText>
                        )}
                      </NavItem>

                      <NavItem eventKey="TeachersAvailability">
                        <NavIcon>
                          <i
                            className="fa fa-users"
                            style={{ fontSize: "1.75em" }}
                          />
                        </NavIcon>
                        <NavText>Öğretim üyeleri</NavText>
                      </NavItem>

                      <NavItem eventKey="SemestersPage">
                        <NavIcon>
                          <i
                            className="fa fa-fw fa-list-alt"
                            style={{ fontSize: "1.75em" }}
                          />
                        </NavIcon>
                        <NavText>Dönemler</NavText>
                      </NavItem>

                      <NavItem eventKey="ConflictsPage">
                        <NavIcon>
                          <i
                            className="fa fa-exclamation-circle"
                            style={{ fontSize: "1.75em" }}
                          />
                        </NavIcon>
                        <NavText>Çakışmalar</NavText>
                      </NavItem>
                      <NavItem eventKey=""
                      onClick={() => {
                        this.setState({ showNavbar: false });
                      }}
                      style={{ 
                        marginTop:
                        this.state.expanded?
                        "47%":"360%"
                       }}
                      >
                        
                        <NavIcon>
                          <i
                            className="fa fa-sign-out"
                            style={{ fontSize: "1.75em" }}
                          />
                        </NavIcon>
                        <NavText>Çıkış yap</NavText>
                      </NavItem>
                   
                    </SideNav.Nav>
                  </SideNav>
                ) : (
                  ""
                )}

                <main>
                  <Route
                    path="/Schedule"
                    exact
                    component={(props) => <Schedule />}
                  />
                  <Route
                    path="/CourseEvents"
                    exact
                    component={(props) => <CourseEvents />}
                  />
                  <Route
                    path="/CourseGroups/:id?"
                    exact
                    component={(props) => <CourseGroups />}
                  />
                  <Route exact path="/SemestersPage">
                    <SemestersPage />
                  </Route>
                  <Route exact path="/ConflictsPage">
                    <ConflictsPage />
                  </Route>

                  <Route exact path="/TeachersAvailability">
                    <TeachersAvailability />
                  </Route>
                  <Route exact path="/Test">
                    <Test />
                  </Route>
                  <Route
                    exact
                    path="/SideNavbar"
                    component={(props) => <Schedule />}
                  />
                  <Route exact path="/">
                    <div className="auth-wrapper">
                      <div className="auth-inner">
                        <Login />
                      </div>
                    </div>
                  </Route>
                </main>
              </div>
            )}
          />
        </Router>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    departmentName: state.department.selectedDepartment.name,
    userFullName:
      state.department.user.firstName + " " + state.department.user.lastName,
    selectedTimetable: state.department.selectedTimetable,
    selectedSemester: state.department.selectedSemester,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(SideNavbar);
