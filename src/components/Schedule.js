import React from "react";

import Cell from "./Cell";
import My_Modal from "./My_Modal";
import ConflictTree from "./ConflictsPage";

import { useSelector } from "react-redux";
import _ from "lodash";
import GridLayout from "react-grid-layout";

import { Row, Col } from "react-bootstrap";
//alerts
import { Alert } from "reactstrap";
//
import { connect } from "react-redux";
import { fetchData ,updateChangedCourses} from "../redux";

import{isTimeConsflicted,isClassroomConsflicted,isTeacherConsflicted} from "../jsFiles/Conflicts"
var layout = [];
const hours = [
  "",
  "09.00-09:50",
  "10:00-10:50",
  "11:00-11:50",
  "12:00-12:50",
  "13:00-13:50",
  "14.00-14.50",
  "15.00-15:50",
  "16:00-16:50",
  "17:00-17:50",
  "18:00-18:50"
];
const days = [
  "Pazartesi",
  "Salı",
  "Çarşamba",
  "Perşembe",
  "Cuma",
  "Cumartesi",
  "Pazar"
];

var row = 11,
  colums = 9,
  menuColums = 4,
  departmentId = 0,
  semesterId = 0;
for (let i = 0; i < row; i++) {
  for (let j = 0; j < colums; j++) {
    if (i === 0 || j === 0)
      // headers cordinates
      layout.push({
        i: "0" + i.toString() + j.toString(), // i will used as a key must be unique
        // add menuColums for chifting grid
        x: j * 2 + menuColums, //each cell will fill 2 colum locate cell in the first one // will be used to saperate cell into 2 section in need
        y: i + 1, // row number
        w: 2, //width
        h: 1, //height
        static: true // x,y are constant cant move
      });
  }
}
class Schedule extends React.Component {
  constructor(departmentData, fetchData,reduxChangedCourses,updateChangedCourses,changedIdes) {
    super();

    this.toggle_details = this.toggle_details.bind(this);
    this.toggle_unsceduled_details = this.toggle_unsceduled_details.bind(this);
    this.close_details = this.close_details.bind(this);
    //this.componentWillMount = this.componentWillMount.bind(this);
    this.get_sceduled_cource_html = this.get_sceduled_cource_html.bind(this);
    this.get_changed_Courses = this.get_changed_Courses.bind(this);
    this.toggle_alert = this.toggle_alert.bind(this);
 
    this.setDepartmentConflicts = this.setDepartmentConflicts.bind(this);
    

    this.state = {
      scheduledCourses: [],
      unscheduledCourses: [],
      day: 0, //index of selected day
      details_is_open: false,
      selectedCourse: null,
      selectedSemester: 1,

      alertVisble: false

      // {Event_teachers:[{Department_Teacher:[{Teacher:{firstName:""}}]}], Opened_course: { Department_course: { Course: {} } } }
    };
  }

  dayscheduledCourses = [];
  semesterCourses = [];

  //used for  detecting change store inital state of  courses  fetched from database
  courses = new Map();

  changed = [];
  _isMounted = false;
  /*---------------------------------- react hooks-------------------------------------------------------*/

  //componentWillMount() {
  componentDidMount() {
    this._isMounted = true;
    departmentId = this.props.departmentData.selectedDepartment.id;
    semesterId = this.props.departmentData.selectedSemester;
    console.log("----------reduxCourses-------------", this.props.reduxCourses);
    console.log("----------reduxChangedCourses-------------", this.props.reduxChangedCourses);
    
    this.getAllCourses();
  }
  componentWillUnmount() {
    // setting cell width

    this._isMounted = false;
  
  }
  componentWillUnmount() {
    let allChangedCourse=this.state.scheduledCourses.concat(this.state.unscheduledCourses)
    console.log(allChangedCourse)
    this.props.updateChangedCourses({
      //data:   JSON.parse(JSON.stringify(allChangedCourse))  ,
      data:  allChangedCourse ,
      arrayName: "ChangedOpenedCoursesEvents"
    })
    this.props.updateChangedCourses({
      data:this.changed,
      arrayName: "changedIdes"
    })
    console.log("çıktı");
  }
  /*----------------------------------Drag and drop functions-------------------------------------------------------*/
  /*
  layout: Layout, oldItem: LayoutItem, newItem: LayoutItem,
                     placeholder: LayoutItem, e: MouseEvent, element: HTMLElement */

  onDrag = (layout, oldItem, newItem, placeholder, e, element) => {
    let course1 = this.getCourse(oldItem.i);

    let ColumNo = this.getCourseColumNo(course1.course);
    // placeholder is the shadow of the element will shown only
    if (
      placeholder.x != ColumNo && //draged over different semester column
      !(newItem.x == ColumNo + 1 && newItem.w === 1) && // small and not  over second colum of semester
      placeholder.x > menuColums - 2
    ) {
      placeholder.h = 0;
    }
  };
  onDragStop = (layout, oldItem, newItem) => {
    let course = this.getCourse(oldItem.i).course;
    let courseType = this.getCourse(oldItem.i).type;
    let courseColumNo = this.getCourseColumNo(course);

    // controles for force course to be located over same samester
    if (
      newItem.x != courseColumNo && // dragged over another semester colum
      !(newItem.x == courseColumNo + 1 && newItem.w === 1) && // item is not small and dragged over one of semester colums
      newItem.x > menuColums - 2 //not  dragged over menu do nothing
    ) {
      // if course is located in another semester chift it
      newItem.x = oldItem.x;
      newItem.y = oldItem.y;
    }
    if (newItem.y + course.duration > row + 1) {
      // course draged out of grid
      newItem.x = oldItem.x;
      newItem.y = oldItem.y;
    } else {
      this.add_if_not_exisits(this.changed, oldItem.i);
      console.log(this.changed);

      if (courseType === "scheduled") {
        // draged over scedule chanege values
        if (newItem.x > menuColums) {
          course.startingHour = hours[newItem.y - 1].substring(0, 2);
          course.weekDay = days[this.state.day];
        } else {
          // dragged over menu
          course.startingHour = "";
          course.weekDay = "";

          this.delete_Scheduled_Course(course.id);
          this.add_Unsceheduled_Course(course);
          course.conflicts = [];
          this.setState({
            selectedSemester: this.getSemesterNoByid(course.id)
          });
        }
        this.setDepartmentConflicts();
      } else if (courseType === "unscheduled") {
        // dragged over scedule
        if (newItem.x > menuColums) {
          course.startingHour = hours[newItem.y - 1].substring(0, 2);
          course.weekDay = days[this.state.day];
          this.delete_Unsceheduled_Course(course.id);
          this.add_Scheduled_Course(course);
          this.setDepartmentConflicts();
        }
      }
    }
  };

  /*
  onDrop = elemParam => {
    console.log(elemParam);
  };*/
  /*-------------------------------------other grid functions----------------------------------------------*/
  onResize = (layout, oldItem, newItem) => {
    let course1 = this.getCourse(oldItem.i);

    if (
      oldItem.w !== newItem.w &&
      course1.type === "scheduled" &&
      newItem.x !== this.getCourseColumNo(course1.course)
    ) {
      // if course is small and located in semester  second colum prevent resizing
      newItem.w = oldItem.w;
    }
  };
  onRemoveItem(id) {
    let course = this.getCourse(id).course;
    course.startingHour = "";
    course.weekDay = "";
    this.delete_Scheduled_Course(course.id);
    this.add_Unsceheduled_Course(course);
    let semesterNo = this.getSemesterNoByid(course.id);
    // if semester number does not changed but there is  courses added to menu  make semester change with 0  for forcing rerendering
    this.setState(prev => {
      return prev.selectedSemester === semesterNo
        ? {
            selectedSemester: 0
          }
        : {};
    });
    setTimeout(() => {
      this.setState(prev => {
        return {
          selectedSemester: semesterNo
        };
      });
    }, 10);
  }

  toggle_alert() {
    this.setState(prevState => {
      return { alertVisble: !prevState.alertVisble };
    });
  }

  /*-------------------------------------Course functions----------------------------------------------*/

  getAllCourses = () => {
    let scheduled = [];
    let unscheduled = [];

    // courses as it is saved in database

    this.props.reduxCourses.map(course => {
      this.courses.set(course.id, course);
    });
    // courses with unsaved changes
    //let CoursesCopy = JSON.parse(JSON.stringify(this.props.reduxChangedCourses));
    let CoursesCopy = this.props.reduxChangedCourses;
    CoursesCopy.map(d => {
      // for controling cell width
      d.width = this.getCellwidth(d);
      d.conflicts = [];
      d.universityConflicts = [];

      !d.weekDay.length
        ? // if event is unsceduled
          unscheduled.push(d)
        : scheduled.push(d);
    });
    this.setState({
      scheduledCourses: scheduled,
      unscheduledCourses: unscheduled,
      selectedCourse: CoursesCopy[0] //random
    },()=>{
      this.setDepartmentConflicts();
    });

    console.log("scheduled fetch", scheduled);
    console.log("unsceduled fetch", unscheduled);

    
  };


  getCourse(id) {
    let unsceduledCourse = this.state.unscheduledCourses.filter(
      c => c.id == id
    )[0];
    return unsceduledCourse
      ? { course: unsceduledCourse, type: "unscheduled" }
      : {
          course: this.state.scheduledCourses.filter(c => c.id == id)[0],
          type: "scheduled"
        };
  }

  delete_Unsceheduled_Course(id) {
    this.setState(prevState => {
      return {
        unscheduledCourses: prevState.unscheduledCourses.filter(
          course => course.id != id
        )
      };
    });
  }
  delete_Scheduled_Course(id) {
    this.setState(prevState => {
      return {
        scheduledCourses: prevState.scheduledCourses.filter(
          course => course.id != id
        )
      };
    });
  }

  add_Scheduled_Course(course) {
    this.setState(prevState => {
      prevState.scheduledCourses.push(course);
      return {
        scheduledCourses: prevState.scheduledCourses
      };
    });
  }
  add_Unsceheduled_Course(course) {
    this.setState(prevState => {
      prevState.unscheduledCourses.push(course);
      return {
        unscheduledCourses: prevState.unscheduledCourses
      };
    });
  }

  //according to semester number
  getCourseColumNo(course) {
    return this.getSemesterNo(course) * 2 + menuColums;
  }
  getSemesterNoByid(id) {
    return this.getCourse(id).course.Opened_course.Department_course.Course
      .semesterNo;
  }
  getSemesterNo(course) {
    return course.Opened_course.Department_course.Course.semesterNo;
  }
  /*-------------------------------------Course conflict functions ----------------------------------------------*/


  setDepartmentConflicts(courses = this.state.scheduledCourses) {
    console.log("conflicte girdi")
    this.state.scheduledCourses.map(course1 => {
      course1.conflicts = [];
      courses.map(course2 => {
        if (
          course1.id !== course2.id &&
          isTimeConsflicted(course1, course2) &&
          course1.weekDay === course2.weekDay
        ) {
          if (isClassroomConsflicted(course1, course2)) {
            course1.conflicts.push({
              type: "classroom",
              conflictedCourse: course2
            });
          }
          if (isTeacherConsflicted(course1, course2)) {
            course1.conflicts.push({
              type: "teacher",
              conflictedCourse: course2
            });
          }
        }
      });
    });
    console.log("------------******-------********----*-*-",this.state.scheduledCourses)
    this.setState({});
  }


  /*--------------------------------Details functions (Modal)------------------------------------*/
  toggle_details(course_id) {
    this.setState({
      selectedCourse: this.dayscheduledCourses.filter(
        c => c.id === course_id
      )[0],
      details_is_open: true
    });
  }
  toggle_unsceduled_details(course_id) {
    this.setState(prevState => {
      return {
        selectedCourse: prevState.unscheduledCourses.filter(
          c => c.id === course_id
        )[0],
        details_is_open: true
      };
    });
  }
  close_details() {
    this.setState({
      details_is_open: false
    });
  }
  /*-------------------------------schedule functions------------------------------------*/
  get_previous_day = () => {
    this.setState(prevState => {
      // check bound of days array if new day index is -1 then give week last day
      return prevState.day - 1 === -1 ? { day: 6 } : { day: prevState.day - 1 };
    });
  };
  get_next_day = () => {
    // check bound of days array if new day index is 7 then give week first day
    this.setState(prevState => {
      return { day: (prevState.day + 1) % 7 };
    });
  };
  get_sceduled_cource_html = course => {
    return (
      <div
        key={course.id}
        id={course.id}
        data-grid={{
          w: this.getCellwidth(course), // width of cell default is 2
          x:
            course.shifted === false
              ? this.getCourseColumNo(course)
              : this.getCourseColumNo(course) + 1, // detrmine colum number
          y: (course.startingHour % 9) + 2, // determine row number of cell adding 2 for static rows (headers) starts from 0

          h: course.duration, //height of cell depends on course hours  *****???******
          maxW: 2, //prevent couse from belonging to 2 semester (dönem)
          maxH: course.duration, // prevent resizing ders duration
          minH: course.duration // prevent resizing ders duration

          // droppingItem: { i: course.id, w: 6, h: 5 },
        }}
        className={
          course.conflicts.length === 0
            ? "react-grid-item sml blue"
            : "react-grid-item sml red"
        }
        onDoubleClick={() => this.toggle_details(course.id)}
        //onDragStop= {this.onDragStop}
      >
        <span
          className="remove"
          onClick={this.onRemoveItem.bind(this, course.id)}
        >
          x
        </span>

        <Cell course={course} />
      </div>
    );
  };
  getCellwidth(course) {
    //if scheduled course
    course.shifted = false;
    if (course.weekDay !== "") {
      for (const c of this.state.scheduledCourses) {
        //prevent comparing course with it self
        if (c.id != course.id) {
          // if has  semester and time
          if (
            this.getSemesterNo(course) === this.getSemesterNo(c) &&
            isTimeConsflicted(course, c) &&
            c.weekDay === course.weekDay
          ) {
            if (
              this.state.scheduledCourses.indexOf(course) >
              this.state.scheduledCourses.indexOf(c)
            ) {
              // if there is tow course at same time one of them will be located in semester secound colum using this attribute
              course.shifted = true;
            }
            return 1;
          }
        }
      }
    }

    return 2;
  }
  getCellwidthByid(courseid) {
    return this.getCellwidth(this.getCourse(courseid).course);
  }
  /*-------------------------------detect changes in database ------------------------------------*/
  add_if_not_exisits(array, id) {
    if (array.indexOf(id) === -1) array.push(id);
  }
  get_changed_Courses() {
    let newCourse, oldCourse;
    let tempChangedCourses = [];
    // if there is a changes saved in globa state add it
    console.log(    "redyx change id ",this.props.changedIdes)
    if(this.props.changedIdes!== undefined)
    this.props.changedIdes.map(id=> this.add_if_not_exisits(this.changed,id))
    console.log("changed  ", this.changed)
    this.changed.map(id => {
      let tempObject = {};
      newCourse = this.getCourse(id).course;
      oldCourse = this.courses.get(Number(id));
      
      if (!_.isEqual(newCourse, oldCourse)) {
        if (newCourse.startingHour !== oldCourse.startingHour) {
          tempObject.startingHour = newCourse.startingHour;
        }
        if (newCourse.weekDay !== oldCourse.weekDay) {
          tempObject.weekDay = newCourse.weekDay;
        }
        
        if(!_.isEmpty(tempObject))
        tempChangedCourses.push({ id: id, changedData: tempObject });
      }
    });
    console.log("temp changed course ",tempChangedCourses);
    if (tempChangedCourses.length !== 0)
      this.send_changedCourses_to_server(tempChangedCourses);
  }
  send_changedCourses_to_server(data) {
    console.log("data", JSON.stringify(data));
    fetch("http://localhost:3004/updatecourses", {
      method: "put",
      body: JSON.stringify(data)
    }).then(response => {
      console.log(response);
      if (response.ok) {
        this.props.updateChangedCourses({
          data:[],
          arrayName: "changedIdes"
        })
        this.props.fetchData({
          deparmentId: departmentId,
          semesterNo: semesterId,
          arrayName: "openedCoursesEvents"
        });
        this.toggle_alert();
        setTimeout(() => {
          this.changed = [];
        //  this.componentDidMount();
          this.setState({
            alertVisble: false
          });
        }, 2000);
      }
    });

    // fetch data from data base to update initial course state
    /*  console.log("++++++++++++++++++++++")
          
           */
  }
  /*-------------------------------menu functions------------------------------------*/
  get_previous_semester_unsceduledCourses = () => {
    this.setState(prevState => {
      let previous = (prevState.selectedSemester - 1) % 9;
      return previous === 0
        ? { selectedSemester: 8 }
        : { selectedSemester: previous };
    });
  };
  get_next_semester_unsceduledCourses = () => {
    // check bound of days array if new day index is 7  then make index equal to 1 (first week day)
    this.setState(prevState => {
      let next = (prevState.selectedSemester + 1) % 9;
      return next === 0 ? { selectedSemester: 1 } : { selectedSemester: next };
    });
  };
  update_semesterCourses = () => {
    this.semesterCourses = this.state.unscheduledCourses.filter(
      course =>
        this.getSemesterNoByid(course.id) === this.state.selectedSemester
    );
  };
  /*----------------------------headers functions--------------------------------*/
  create_static_header_cell_html = (
    keyVal,
    xVal,
    yVal,
    wVal,
    hVal,
    onClickMethod,
    value,
    className1
  ) => {
    return (
      <div
        key={keyVal}
        data-grid={{
          x: xVal,
          y: yVal,
          w: wVal,
          h: hVal,
          static: true
        }}
        className={className1 ? className1 : "headercell"}
        onClick={onClickMethod}
      >
        {value}
      </div>
    );
  };
  headers = layout.map(item => {
    //if cell is from (second row) show semester number if cell from first column  show time range
    return item.i < 10 ? (
      <div className="headercell" key={item.i}>
        {" "}
        {item.i % 10}. D{" "}
      </div>
    ) : (
      <div className="headercell" key={item.i}>
        {" "}
        {hours[item.i / 10]}{" "}
      </div>
    );
  });

  render() {
    console.log("render edildi");

    console.log(this.state.scheduledCourses);
    // geting all cells in jsx format
    let cellsComponents;
    let unscheduledCellsComponents;
    if (this.state.scheduledCourses != null) {
      this.update_semesterCourses();
      this.dayscheduledCourses = this.state.scheduledCourses.filter(
        course => course.weekDay === days[this.state.day]
      );

      cellsComponents = this.dayscheduledCourses.map(course => {
        return this.get_sceduled_cource_html(course);
        ///////////////////////
      });
      let counter = 1;

      unscheduledCellsComponents = this.semesterCourses.map(course => {
        //  if(this.getSemesterNo(course.id)===this.state.selectedSemester){
        return (
          <div
            key={course.id}
            id={course.id}
            data-grid={{
              x: 0, // detrmine colum number
              y: counter++, // determine row number of cell
              w: 2, // width of cell
              h: course.duration, //height of cell depends on course hours
              maxW: 2, //prevent couse from belonging to 2 semester (dönem)
              maxH: course.duration, // prevent resizing ders duration
              minH: course.duration // prevent resizing ders duration
            }}
            className="react-grid-item sml"
            onDoubleClick={() => this.toggle_unsceduled_details(course.id)}
          >
            <Cell course={course} color={"blue"} />
          </div>
        );
        // }
      });
    }

    return (
      <>
        {this.state.scheduledCourses.length == 0 &&
        this.state.unscheduledCourses.length == 0 ? (
          <div>
            <div>Loading</div>
          </div>
        ) : (
          <div>
            <Row className="alarmRow">
            <Col lg={1}></Col>

              <Col lg={10}>
              <div className="alert">
                <Alert
                  color="success"
                  isOpen={this.state.alertVisble}
                  toggle={this.toggle_alert}
                  fade={true}
                >
                  değişiklikler kaydedildi
                </Alert>
              </div>
              </Col>
            </Row>

            <Row className="GridRow">
              <Col lg={1}></Col>

              <Col lg={10}>
                <GridLayout
                  className="layout grid"
                  {...{
                    //autoSize:  true,
                    margin: [4, 4],
                    compactType: null,
                    preventCollision: true,
                    layout: layout,
                    cols: 18 + menuColums,
                    isResizable: true,
                    rowHeight: 41,
                    width: 1090,
                    autoSize: false,

                    onDrag: this.onDrag,

                    onDragStop: this.onDragStop,
                    onResize: this.onResize
                  }}
                >
                  {this.create_static_header_cell_html(
                    "e",
                    0,
                    0,
                    1,
                    1,
                    this.get_previous_semester_unsceduledCourses,
                    "<",
                    "switch"
                  )}
                  {this.create_static_header_cell_html(
                    "d",
                    1,
                    0,
                    2,
                    1,
                    null,
                    this.state.selectedSemester + "D"
                  )}

                  {this.create_static_header_cell_html(
                    "f",
                    3,
                    0,
                    1,
                    1,
                    this.get_next_semester_unsceduledCourses,
                    ">",
                    "switch"
                  )}

                  {this.create_static_header_cell_html(
                    "a",
                    0 + menuColums,
                    0,
                    2,
                    1,
                    this.get_previous_day,
                    "<",
                    "switch"
                  )}
                  {this.create_static_header_cell_html(
                    "b",
                    2 + menuColums,
                    0,
                    14,
                    1,
                    this.get_previous_day,
                    days[this.state.day]
                  )}
                  {this.create_static_header_cell_html(
                    "c",
                    16 + menuColums,
                    0,
                    2,
                    1,
                    this.get_next_day,
                    ">",
                    "switch"
                  )}

                  {unscheduledCellsComponents}
                  {this.headers}
                  {cellsComponents}
                </GridLayout>
              </Col>
            </Row>
            <My_Modal
              selectedCourse={this.state.selectedCourse}
              details_is_open={this.state.details_is_open}
              close_details={this.close_details}
            />
            <Row className="GridRow">
              <Col lg={8}></Col>
           

              <Col lg={2} style={{marginLeft:"9%"}}>
                <button
                  type="button"
                  className="btn btn-secondary save"
                  onClick={this.get_changed_Courses}
                >
                  Kaydet
                </button>
              </Col>
            </Row>
          </div>
        )}
      </>
    );
  }
}
const mapStateToProps = state => {
  return {
    departmentData: state.department,
    reduxCourses: state.data.openedCoursesEvents,
    reduxChangedCourses:state.data.ChangedOpenedCoursesEvents,
    changedIdes:state.data.changedIdes
  };
};

const mapDispatchToProps = dispatch => {
  return {
    
    fetchData: data => dispatch(fetchData(data)),
    updateChangedCourses: data => dispatch(updateChangedCourses(data))
    
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Schedule);

/*
  <Col lg={2}>
                {this.departments.size === 0 ? (
                  this.getDepartments(),
                  this.setState({}),
                  ""
                ) : (
                  <div>
                    <div className="department">{this.departments.get(departmentId).name}</div>
                    

                    <div className="conflictTree">
                      <ConflictTree
                         
                         
                        scheduledCourses={this.state.scheduledCourses}
                        departments={this.departments}
                      />
                    </div>
                  </div>
                )}
              </Col>
 */
