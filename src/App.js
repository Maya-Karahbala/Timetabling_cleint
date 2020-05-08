import React, { Component } from "react";

// bootstrap

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Login from "./components/Login";
import Schedule from "./components/Schedule";
import SideNavbar from "./components/SideNavbar";

import SemestersPage from "./components/SemestersPage"
import CourseGroups from "./components/CourseGroups"
import TeachersAvailability from "./components/TeachersAvailability"

// for icons
import 'font-awesome/css/font-awesome.min.css';

// redux
import { Provider } from "react-redux";
import store from "./redux/store";
import Test from "./components/Test";

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          
          <Switch>
            <Route exact path="/">
              <div className="auth-wrapper">
                <div className="auth-inner">
                  <Login />
                </div>
              </div>
            </Route>
            <Route path="/Schedule">
                <Schedule />
            </Route>
            <Route path="/SideNavbar">
              <SideNavbar />
            </Route>
     
            <Route path="/SemestersPage">
              <SemestersPage />
            </Route>
            <Route path="/CourseGroups">
              <CourseGroups />
            </Route>
            <Route path="/Test">
              <Test />
            </Route>
            <Route path="/TeachersAvailability">
              <Test />
            </Route>
          
          </Switch>
        </Router>
      </Provider>
    );
  }
}
