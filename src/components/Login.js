import React, { useState, useEffect } from "react";

// redux
import { connect } from "react-redux";
import { fetchDepartments, updateSelcectedDepartment,fetchData } from "../redux";
//

import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import "../login.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

// equal to component did mount in class component work only one if [] added to last part
function Login({
  departmentData,
  fetchDepartments,
  updateSelcectedDepartment,
  fetchData
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedDep, setSelectedDep] = useState({});
  const [mail, setMail] = useState("ahmet.ak@gmail.com");
  const [password, setPassword] = useState("ahmet");
  var users = [];

  useEffect(() => {
    fetchDepartments();
  }, []);

  const mailChangeHandler = event => {
    setMail(event.target.value);
  };
  const passwordChangeHandler = event => {
    setPassword(event.target.value);
  };
  const fillDropDownMenu = () => {
    let deps = [];
    // departmentData.departments props stored in redux store
    for (var [key, value] of departmentData.departments) {
      deps.push(value);
    }
    // inital state for selected department is the first

    const header = (
      <DropdownToggle key={selectedDep.id} className="logindepartment" caret>
        {selectedDep.name}
      </DropdownToggle>
    );
    // pop first department name because it is already shown in menu header

    return [
      header,
      deps.map(dep => {
        return (
          <DropdownItem
            onClick={() => {
              changeDepartment(dep.id);
            }}
            key={dep.id}
          >
            {dep.name || ""}{" "}
          </DropdownItem>
        );
      })
    ];
  };

  const fetchUsers = async () => {
    if (selectedDep.id !== undefined) {
      await fetch("http://localhost:3004/users/" + selectedDep.id)
        .then(responce => responce.json())
        .then(data => {
          data.map(u => users.push(u));
          let validation=isValid()
          if (validation.result) {
            updateSelcectedDepartment({department:selectedDep, user:validation.user});
            // stored in redux state
            fetchData({deparmentId:selectedDep.id ,  arrayName:"teachers"})
            // no need for sending depid all classroom will be fetched but for using globa fetch data we send it 
            fetchData({deparmentId:selectedDep.id ,  arrayName:"classrooms"})
          }
        })
        .catch(err => console.log(err));
    }
  };
  const isValid = () => {
    // check if user info is valid
    for (let i = 0; i < users.length; i++) {
      if (mail === users[i].mail && password === users[i].password) return {result:true, user:users[i]};
    }
    return false;
  };

  const toggle = () => setDropdownOpen(prevState => !prevState);
  const changeDepartment = id => {
    setSelectedDep(departmentData.departments.get(id));
  };

  return (departmentData.loading || departmentData.departments.size < 1 )? (
    <h2>Loading</h2>
  ) : departmentData.error ? (
    <h2>{departmentData.error}</h2>
  ) : (
    <div>
      <h3>Giriş Yap</h3>

      <div className="form-group">
        <label>E-Posta Adresi</label>
        <input
          type="email"
          className="form-control"
          placeholder="Enter email"
          value={mail}
          onChange={mailChangeHandler}
        />
      </div>

      <div className="form-group">
        <label>Şifre</label>
        <input
          type="password"
          className="form-control"
          placeholder="Enter password"
          value={password}
          onChange={passwordChangeHandler}
        />
      </div>
      <div className="form-group">
        <label>Bölüm</label>
        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
          {fillDropDownMenu()[0]}
          <DropdownMenu>{fillDropDownMenu()[1]}</DropdownMenu>
        </Dropdown>
      </div>

      <div className="form-group">
        <div className="custom-control custom-checkbox">
          <input
            type="checkbox"
            className="custom-control-input"
            id="customCheck1"
          />
          <label className="custom-control-label" htmlFor="customCheck1">
            Beni Unutma
          </label>
        </div>
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-block"
        onClick={fetchUsers}
      >
        Giriş Yap
      </button>

      <p className="forgot-password text-right">
        <a href="#">Şifremi unuttum?</a>
      </p>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    departmentData: state.department
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchDepartments: () => dispatch(fetchDepartments()),
    fetchData : data => dispatch(fetchData(data)),
    updateSelcectedDepartment: dep => dispatch(updateSelcectedDepartment(dep))

  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
