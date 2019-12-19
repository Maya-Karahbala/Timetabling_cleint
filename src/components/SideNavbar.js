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

import "@trendmicro/react-sidenav/dist/react-sidenav.css";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
// for icon

export default class SideNavbar extends Component {
  
  render() {

    return (
      <div>
        
        <Router>
          <Route
            render={({ location, history }) => (
              <React.Fragment>
                <SideNav
                  onSelect={selected => {
                  
                    const to = "/" + selected;
                    if (location.pathname !== to) {
                      history.push(to);
                    }
                  }}
                 
                >

                  <SideNav.Toggle/>
                  <SideNav.Nav defaultSelected="/Schedule">
                    <NavItem eventKey="Schedule" >
                      <NavIcon>
                        <i
                         className="fa fa-fw fa-home"
                          style={{ fontSize: "1.75em" }}
                        />
                      </NavIcon>
                      <NavText>Ders Programı</NavText>
                    </NavItem>

                    <NavItem eventKey="SemestersPage">
                      <NavIcon>
                        <i
                         className="fa fa-calendar" 
                          
                          style={{ fontSize: "1.75em" }}
                        />
                      </NavIcon>
                      <NavText>Dönemler</NavText>
                    </NavItem>
                    <NavItem eventKey="CoursesPage">
                      <NavIcon>
                        <i
                          className="fa fa-plus"
                          style={{ fontSize: "1.75em" }}
                        />
                      </NavIcon>
                      <NavText>Dersler</NavText>
                    </NavItem>
                    <NavItem eventKey="ConflictsPage">
                      <NavIcon>
                        <i
                          className="fa fa-exclamation-triangle"
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
                  
                </main>
              </React.Fragment>
            )}
          />
           
        </Router>
      
        
        
      </div>
    );
  }
}
