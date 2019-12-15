import React, { Component } from "react";

// bootstrap

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Login from "./components/Login";
import Schedule from "./components/Schedule";
import SideNavbar from "./components/SideNavbar";
import Semesters from "./components/Semesters"
// for icons
import 'font-awesome/css/font-awesome.min.css';

// redux
import { Provider } from "react-redux";
import store from "./redux/store";

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
            <Route path="/Semesters">
       
              <Semesters />
      

            </Route>
          </Switch>
        </Router>
      </Provider>
    );
  }
}
