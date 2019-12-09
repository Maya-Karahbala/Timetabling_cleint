import React, { Component } from "react";
import SideNav, {
  Toggle,
  Nav,
  NavItem,
  NavIcon,
  NavText,
  
} from "@trendmicro/react-sidenav";
import Login from "./Login";
import Schedule from "./Schedule";
// Be sure to include styles at some point, probably during your bootstraping
import "@trendmicro/react-sidenav/dist/react-sidenav.css";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

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
                  <SideNav.Toggle />
                  <SideNav.Nav defaultSelected="Login">
                   
                    <NavItem eventKey="Schedule">
                      <NavIcon>
                        <i
                          className="fa fa-fw fa-device"
                          style={{ fontSize: "1.75em" }}
                        />
                      </NavIcon>
                      <NavText  >Schedule</NavText>
                    </NavItem>
                     <NavItem eventKey="Login">
                      <NavIcon>
                        <i
                          className="fa fa-fw fa-home"
                          style={{ fontSize: "1.75em" }}
                        />
                      </NavIcon>
                      <NavText>Giriş yap</NavText>
                    </NavItem>
                  </SideNav.Nav>
                </SideNav>
                <main>
                  <Route exact path="/Login">
                    <div className="auth-wrapper">
                      <div className="auth-inner">
                        <Login />
                      </div>
                    </div>
                  </Route>
                  <Route path="/Schedule">
                    <Schedule />
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


