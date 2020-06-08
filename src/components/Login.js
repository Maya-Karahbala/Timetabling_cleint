import React, { useState, useEffect } from "react";

// redux
import { connect, useSelector } from "react-redux";
import {
  fetchDepartments,
  filteredFetch,
  updateSelcectedDepartment,
  fetchData,
  storeData,fetchTeachers

} from "../redux";
import{printfunc} from "../jsFiles/test"
//
import { getFormatedStrDate } from "../jsFiles/Functions";
import { Dropdown } from "primereact/dropdown";
import "../login.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import {
  setTimeTableDays,
} from "../jsFiles/Functions";

// equal to component did mount in class component work only one if [] added to last part
function Login({
  // redux inf and methods
  departments,
  semestersData,
  semes,
  fetchDepartments,
  updateSelcectedDepartment,
  fetchData,
  filteredFetch,
  storeData,
  
  fetchTeachers

}) {
  const [selectedDep, setSelectedDep] = useState({ id: 1 });
  const [selectedSemester, setSelectedSemester] = useState({ id: 1 });
  const [selectedTimetable, setSelectedTimetable] = useState(undefined);
  const [mail, setMail] = useState("ahmet.ak@gmail.com");
  const [password, setPassword] = useState("ahmet");
  localStorage.clear();
  var users = [];

  useEffect(() => {
    
    fetchData({ arrayName: "departments" }).then(deps => {
      setSelectedDep(deps[0]);
    })
    fetchData({ arrayName: "Semesters" }).then(semesters => {
      let lastSemester = semesters[semesters.length - 1];
      setSelectedSemester(lastSemester);
      // edit for start with exams
      setSelectedTimetable(
        lastSemester.Timetables[lastSemester.Timetables.length - 1]
      );
    });
  }, []);

  const mailChangeHandler = event => {
    setMail(event.target.value);
  };
  const passwordChangeHandler = event => {
    setPassword(event.target.value);
  };

 
  const fetchUsers = async () => {
    if (selectedDep.id !== undefined) {
      //!only enterd user should be returned if founde + users password must be hased or encrypted
      await fetch("/users/" + selectedDep.id)
        .then(responce => responce.json())
        .then(data => {
          data.map(u => users.push(u));
          let validation = isValid();
          if (validation.result) {
            setTimeTableDays(selectedSemester.Timetables.filter(timetable=>timetable.timetableType=="Ders")[0]);
            
            if(selectedTimetable.timetable!="Ders"){
              setTimeTableDays(selectedTimetable);
            }
           
            storeData({
              data: selectedTimetable,
              varName: "selectedTimetable"
            });
            updateSelcectedDepartment({
              department: selectedDep,
              user: validation.user
            });

            let result1=filteredFetch({
              deparmentId: selectedDep.id,
              selectedSemester: selectedSemester,
              arrayName: "openedCoursesEvents",
              selectedTimetable: selectedTimetable
            });
            //  some semesters features is set in filteredFetch son order is important
            // main courses is stored if exam timetable is selected
            storeData({ data: selectedSemester, varName: "selectedSemester" });

            // stored in redux state
            let result2=fetchTeachers({ deparmentId: selectedDep.id, arrayName: "teachers" ,semesterNo:selectedSemester.id})
   

            let result3=fetchData({ arrayName: "classrooms" });
            let result4=fetchData({ deparmentId: selectedDep.id, arrayName: "courses" });
            setSelectedDep(departments[0]);

            //fetchData({  arrayName:"Semesters"})

            var linkToClick = document.getElementById("SideNavbar");
            Promise.all([result1, result2,result3,result4]).then(()=>{
              linkToClick.click();
            })  
            
          }
        })
        .catch(err => console.log(err));
    }
  };
  const isValid = () => {
    // check if user info is valid
    for (let i = 0; i < users.length; i++) {
      if (mail === users[i].mail && password === users[i].password)
        return { result: true, user: users[i] };
    }
    return false;
  };

  const changeDepartment = id => {
    setSelectedDep(
      departments.filter(dep=>dep.id==id)[0]
    
      );
  };
  const changeSemester = id => {
    let tempSemester = semestersData.filter(semester1 => semester1.id == id)[0];
    setSelectedSemester(tempSemester);
    setSelectedTimetable(tempSemester.Timetables[0]);
  };
  const changeTimetable = id => {
    setSelectedTimetable(
      selectedSemester.Timetables.filter(timetable => timetable.id == id)[0]
    );
  };

  return departments == undefined ||
  departments.length==0||
    
    selectedTimetable == undefined ||
    semestersData == undefined ? (
    <h1>
      <i className="fa fa-refresh fa-spin fa-3x fa-fw"></i>
    </h1>
  )  : (
    <div>
      <Link id="SideNavbar" to={"/SideNavbar"}>
        {" "}
      </Link>
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
            style={{ width: "100%" }}
            options={departments.map(dep => {
              return { label: dep.name, value: dep.id };
            })}
            value={selectedDep.id}
            onChange={e => {
              changeDepartment(e.value);
            }}
          />
        </div>
      </div>
      <div className="form-group">
        <label>Dönem</label>
        <div>
          <Dropdown
            style={{ width: "100%" }}
            options={semestersData.map(semester => {
              return {
                label:
                  semester.beginning +
                  " - " +
                  semester.ending +
                  " " +
                  semester.semesterType +
                  " Dönemi",
                value: semester.id
              };
            })}
            value={selectedSemester.id}
            onChange={e => {
              changeSemester(e.value);
            }}
          />
        </div>
      </div>
      <div className="form-group">
        <label>Takvim</label>
        <div>
          <Dropdown
            style={{ width: "100%" }}
            options={selectedSemester.Timetables.map(timetable => {
              return {
                label: timetable.timetableType + " Programı",
                value: timetable.id
              };
            })}
            value={selectedTimetable.id}
            onChange={e => {
              changeTimetable(e.value);
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
          <label className="custom-control-label" htmlFor="customCheck1"
         // style={{marginBottom:"7%"}}
         >
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
    departments: state.data.departments,
    semestersData: state.data.Semesters,
    semes: state.department.selectedSemester,

  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchDepartments: () => dispatch(fetchDepartments()),
    fetchData: data => dispatch(fetchData(data)),
    fetchTeachers: data => dispatch(fetchTeachers(data)),
    
    filteredFetch: data => dispatch(filteredFetch(data)),
    updateSelcectedDepartment: dep => dispatch(updateSelcectedDepartment(dep)),
    storeData: data => dispatch(storeData(data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
