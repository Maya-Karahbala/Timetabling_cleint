import React, { useState, useEffect } from "react";

// redux
import { connect ,useSelector} from "react-redux";
import { fetchDepartments, updateSelcectedDepartment,fetchData,updateSelectedSemester } from "../redux";

//


import { Dropdown } from "primereact/dropdown";
import "../login.css";
import { BrowserRouter as Router, Switch, Route, Link,Redirect } from "react-router-dom";

// equal to component did mount in class component work only one if [] added to last part
function Login({
  // redux inf and methods
  departmentData,
  semes,
  fetchDepartments,
  updateSelcectedDepartment,
  updateSelectedSemester,
  fetchData
}) {
  // hard coded must be the first dep fetched from database
  const [selectedDep, setSelectedDep] = useState({id:1});
  const [mail, setMail] = useState("ahmet.ak@gmail.com");
  const [password, setPassword] = useState("ahmet");

 

  var users = [];

  useEffect(() => {
    fetchDepartments()
    //setSelectedDep(departmentData.departments.get(0))
  }, []);
  

  const mailChangeHandler = event => {
    setMail(event.target.value);
  };
  const passwordChangeHandler = event => {
    setPassword(event.target.value);
  };
  const depsForDropDown = () => {
    let deps = [];
    for (var [key, value] of departmentData.departments) {
      deps.push(value);
    }
    

      return deps.map(dep => {
        return (
          { label: dep.name, value: dep.id }
        );
      })
   
  };

  const fetchUsers = async () => {
    if (selectedDep.id !== undefined) {
      await fetch("http://localhost:3004/users/" + selectedDep.id)
        .then(responce => responce.json())
        .then(data => {
          data.map(u => users.push(u));
          let validation=isValid()
          if (validation.result) {
            updateSelcectedDepartment({department:selectedDep, user:validation.user})
            updateSelectedSemester(1)
            console.log("----------------+++++++++++-------------",semes)
            fetchData({deparmentId:selectedDep.id ,semesterNo:1 ,  arrayName:"openedCoursesEvents"})
            fetchData({deparmentId:selectedDep.id ,semesterNo:1 ,  arrayName:"ChangedOpenedCoursesEvents" ,url:"openedCoursesEvents"})
            
            // stored in redux state
            fetchData({deparmentId:selectedDep.id ,  arrayName:"teachers"})
             
              
            
            fetchData({  arrayName:"classrooms"})
            fetchData({deparmentId:selectedDep.id , arrayName:"courses"})
            
            fetchData({  arrayName:"Semesters"})
         
            var linkToClick = document.getElementById('something');
            
             
              linkToClick.click();
            
          
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

  
  const changeDepartment = id => {
    setSelectedDep(departmentData.departments.get(id));
  };

  return (departmentData.loading || departmentData.departments.size < 1 )? (
    <h1><i className="fa fa-refresh fa-spin fa-3x fa-fw"></i></h1>
  ) : departmentData.error ? (
    <h2>{departmentData.error}</h2>
  ) : (
  
      <div>
        <Link id="something" to={"/SideNavbar"}>  </Link>
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
        <div>
         
        <Dropdown 
        style={{width:"100%"}}
        options={depsForDropDown()}
          value={selectedDep.id}
          
          onChange={e => {
            changeDepartment(e.value)
          }}
         
        />
        </div>
  
    
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
    departmentData: state.department,
    semes:state.department.selectedSemester
 
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchDepartments: () => dispatch(fetchDepartments()),
    fetchData : data => dispatch(fetchData(data)),
    updateSelcectedDepartment: dep => dispatch(updateSelcectedDepartment(dep)),
    updateSelectedSemester: (semesterNo) => dispatch(updateSelectedSemester(semesterNo))
    
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
