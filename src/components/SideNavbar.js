import React, { Component } from "react";
import SideNav, {
  Toggle,
  Nav,
  NavItem,
  NavIcon,
  NavText
} from "@trendmicro/react-sidenav";
import Semesters from "./Semesters";
import Schedule from "./Schedule";
import ConflictsPage from "./ConflictsPage";

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

                    <NavItem eventKey="Semesters">
                      <NavIcon>
                        <i
                         className="fa fa-calendar" 
                          
                          style={{ fontSize: "1.75em" }}
                        />
                      </NavIcon>
                      <NavText>Dönemler</NavText>
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
                  <Route path="/Semesters">
                    <Semesters />
                  </Route>
                  <Route path="/ConflictsPage">
                    <ConflictsPage />
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
