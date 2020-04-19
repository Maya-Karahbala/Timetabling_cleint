import React, { Component } from "react";
import SideNav, {
  Toggle,
  Nav,
  NavItem,
  NavIcon,
  NavText
} from "@trendmicro/react-sidenav";
import SemestersPage from "./SemestersPage";
import Schedule from "./Schedule";
import ConflictsPage from "./ConflictsPage";
import CoursesPage from "./CoursesPage";
import CourseEvents from "./CourseEvents";

// for dep info
import styled from "styled-components";
import { connect, useSelector } from "react-redux";
import "@trendmicro/react-sidenav/dist/react-sidenav.css";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
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
  constructor(departmentName, userFullName) {
    super();
    this.state = {
      expanded: false
    };
  }
  onToggle = () => {
    this.setState(prev => {
      return {
        expanded: !prev.expanded
      };
    });
  };

  render() {
    console.log(this.props);
    return (
      <div>
        <Router>
          <Route
            render={({ location, history }) => (
              <React.Fragment>
                <SideNav
                style={{ height: "100%"}}
                  onSelect={selected => {
                    const to = "/" + selected;
                    if (location.pathname !== to) {
                      history.push(to);
                    }
                  }}
                  onToggle={this.onToggle}
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
                     
                  <SideNav.Nav defaultSelected="/Schedule">
              
                  <NavItem eventKey="Schedule">
                    <NavIcon>
                      <i
                        className="fa fa-calendar"
                        style={{ fontSize: "1.75em" }}
                      />
                    </NavIcon>
                    {(this.props.selectedTimetable.timetableType=="Ders")?
                    <NavText>Ders Programı</NavText>:
                    <NavText>Sınav Programı</NavText>}
                  </NavItem>
                  
                
                    {(this.props.selectedTimetable.timetableType=="Ders")?
                     <NavItem eventKey="CoursesPage">
                     <NavIcon>
                       <i
                         className="fa fa-plus"
                         style={{ fontSize: "1.75em" }}
                       />
                     </NavIcon>
                     <NavText>Ders ekle</NavText>
                   </NavItem>
                   :
                   ""}

                   
                     <NavItem eventKey="CourseEvents">
                     <NavIcon>
                       <i
                         className="fa fa-graduation-cap"
                         style={{ fontSize: "1.75em" }}
                       />
                     </NavIcon>
                     {(this.props.selectedTimetable.timetableType=="Ders")?
                     <NavText>Dersler</NavText>:
                     <NavText>Sınavlar</NavText>}
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
                  </SideNav.Nav>
                </SideNav>
            
                <main>
                  <Route path="/Schedule">
                    <Schedule />
                  </Route>
                  <Route path="/SemestersPage">
                    <SemestersPage />
                  </Route>
                  <Route path="/ConflictsPage">
                    <ConflictsPage />
                  </Route>
                  <Route path="/CoursesPage">
                    <CoursesPage />
                  </Route>
                  <Route path="/CourseEvents">
                    <CourseEvents />
                  </Route>
                
                </main>
              </React.Fragment>
            )}
          />
        </Router>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    departmentName: state.department.selectedDepartment.name,
    userFullName:
      state.department.user.firstName + " " + state.department.user.lastName,
    selectedTimetable: state.department.selectedTimetable,
    selectedSemester: state.department.selectedSemester
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(SideNavbar);
