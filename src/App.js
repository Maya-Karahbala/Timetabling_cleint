import React from "react";
import Cell from "./components/Cell";
import My_Modal from "./components/My_Modal";

import "./App.css";
import _ from "lodash";
import GridLayout from "react-grid-layout";

import { Row, Col, Grid } from "react-bootstrap";


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
  menuColums = 5;

for (let i = 0; i < row; i++) {
  for (let j = 0; j < colums; j++) {
    if (i === 0 || j === 0)
      // headers cordinates
      layout.push({
        i: "0" + i.toString() + j.toString(),// i will used as a key must be unique
        // add menuColums for chifting grid
        x: j * 2 + menuColums, //each cell will fill 2 colum locate cell in the first one // will be used to saperate cell into 2 section in need
        y: i + 1,// row number 
        w: 2,//width
        h: 1,//height
        static: true  // x,y are constant cant move
      });
  }
}
class App extends React.Component {
  constructor() {
    super();

    this.toggle_details = this.toggle_details.bind(this);
    this.toggle_unsceduled_details = this.toggle_unsceduled_details.bind(this);
    this.close_details = this.close_details.bind(this);
    this.componentWillMount = this.componentWillMount.bind(this);
    this.get_sceduled_cource_html = this.get_sceduled_cource_html.bind(this);

    this.state = {
      scheduledCourses: [],
      unscheduledCourses: [],
      day: 0, //index of selected day
      details_is_open: false,
      selectedCourse: null,
      selectedSemester: 1

      // {Event_teachers:[{Department_Teacher:[{Teacher:{firstName:""}}]}], Opened_course: { Department_course: { Course: {} } } }
    };
  }

  dayscheduledCourses = [];
  semesterCourses = [];
  componentWillMount() {
    this.getAllCourses();
  }

  /*----------------------------------Drag and drop functions-------------------------------------------------------*/
  /*
  layout: Layout, oldItem: LayoutItem, newItem: LayoutItem,
                     placeholder: LayoutItem, e: MouseEvent, element: HTMLElement */

  onDrag = (layout, oldItem, newItem, placeholder, e, element) => {
    let ColumNo = this.getCourseColumNo(oldItem.i);
    // placeholder is the shadow of the element will shown only
    //if the course is draged over the same semester column
    // or over menu colums
    // over menu colums=  (placeholder.x >(menuColums-3))
    if (
      placeholder.x != ColumNo && //draged over different semester column
      !(newItem.x == ColumNo + 1 && newItem.w === 1) && // small and not  over second colum of semester
        placeholder.x > menuColums - 3
    ) {
      //over menu colums
      placeholder.h = 0;
    }
  };
  onDragStop = (layout, oldItem, newItem, placeholder, e, element) => {
    let course=  this.getCourse(oldItem.i).course;
    let courseType=  this.getCourse(oldItem.i).type;

  
    if(courseType==="scheduled"){
       // draged over scedule chanege values
       if( newItem.x > menuColums ){
        course.startingHour = hours[newItem.y - 1].substring(0, 2);
        course.weekDay = days[this.state.day];
       }
      
       else{// dragged over menu
        course.startingHour ="";
        course.weekDay = "";
        this.delete_Scheduled_Course(course.id)
        this.add_Unsceheduled_Course(course)
        this.setState({
          selectedSemester: this.getSemesterNo(course.id)
        })
       
       }
       
       
    }  
    else if(courseType==="unscheduled"){
      if( newItem.x > menuColums ){// dragged over scedule
        console.log("girdi")
        course.startingHour = hours[newItem.y - 1].substring(0, 2);
        course.weekDay = days[this.state.day];
        this.delete_Unsceheduled_Course(course.id)
        this.add_Scheduled_Course(course)
       }
      
       else{// dragged over menu
        
       }
    }
  }
  /*
  onDragStop = (layout, oldItem, newItem, placeholder, e, element) => {
    
    console.log(this.getCourse(oldItem.i))
    let unsceduledCourse = this.state.unscheduledCourses.filter(
      c => c.id == oldItem.i
    )[0];

    let semesterNo = this.getCourseColumNo(oldItem.i);
    if (!unsceduledCourse) {
      // dragged course is
      //if semester width is 1 small and in same semester colum do nothing
      if (
        newItem.x != semesterNo &&
        !(newItem.x == semesterNo + 1 && newItem.w === 1) &&
        newItem.x > menuColums - 3 //if dragged course is unsceduled and dragged over menu do nothing
      ) {
        // if course is located in another semester chift it
        newItem.x = oldItem.x;
        if (unsceduledCourse) newItem.y = oldItem.y;
      }
    } else {
      // if dragged course is unsceduled update state and make it scheduled

      unsceduledCourse.startingHour = hours[newItem.y - 1].substring(0, 2);
      unsceduledCourse.weekDay = days[this.state.day];
      this.setState(prevState => {
        prevState.scheduledCourses.push(unsceduledCourse);
        return {
          unscheduledCourses: prevState.unscheduledCourses.filter(
            course => course.id != unsceduledCourse.id
          ),
          scheduledCourses: prevState.scheduledCourses
        };
      });
    }
    
  };*/
  onDrop = elemParam => {
    console.log(elemParam);
  };
   /*-------------------------------------other cell functions----------------------------------------------*/
  onResize=()=>{
    console.log("worksed")
  }
  onRemoveItem(id) {
    let course=  this.getCourse(id).course;
    course.startingHour ="";
    course.weekDay = "";
    this.delete_Scheduled_Course(course.id)
    this.add_Unsceheduled_Course(course)
    this.setState({
      selectedSemester: this.getSemesterNo(course.id)
    })
    console.log("state is ",this.state)
  
   
  }
  /*-------------------------------------Course functions----------------------------------------------*/
  getCourse(id){
    let unsceduledCourse = this.state.unscheduledCourses.filter(
      c => c.id == id
    )[0];
    return(
      unsceduledCourse?
      {course: unsceduledCourse,type:"unscheduled"}:
      {course: this.state.scheduledCourses.filter(
        c => c.id == id
      )[0],type:"scheduled"}
    )
   

  }
  delete_Unsceheduled_Course(id){
    this.setState(prevState => {
      return {
        unscheduledCourses: prevState.unscheduledCourses.filter(
          course => course.id != id
        ),
      };
  })
}
  delete_Scheduled_Course(id){
    this.setState(prevState => {
      return {
        scheduledCourses: prevState.scheduledCourses.filter(
          course => course.id != id
        ),
      };
  })}

  add_Scheduled_Course(course){

    this.setState(prevState => {
      prevState.scheduledCourses.push(course)
      return {
        scheduledCourses: prevState.scheduledCourses
      };
  })}
  add_Unsceheduled_Course(course){
  
    this.setState(prevState => {
      prevState.unscheduledCourses.push(
        course
      )
      return {
        
        unscheduledCourses:prevState.unscheduledCourses ,
      };
  })}

  getAllCourses = () => {
    let scheduled = [];
    let unscheduled = [];
    fetch("http://localhost:3004/openedCourses")
      .then(responce => responce.json())
      .then(data => {
        data.map(d => {
          !d.weekDay.length
            ? // if event is unsceduled
              unscheduled.push(d)
            : scheduled.push(d);
        });
        this.setState({
          scheduledCourses: scheduled,
          unscheduledCourses: unscheduled,
          selectedCourse: data[0]
        });
        console.log("scheduled fetch", scheduled);
        console.log("unsceduled fetch", unscheduled);
        console.log("selected");
        console.log(this.state.selectedCourse);
      })

      .catch(err => console.log(err));
  };

  //according to semester number
  getCourseColumNo(id) {
   
    return this.getSemesterNo(id) * 2 + menuColums;
  }
  getSemesterNo(id) {
    return this.getCourse(id).course.Opened_course.Department_course.Course.semesterNo
    /*
    let unsceduledCourse = this.state.unscheduledCourses.filter(
      c => c.id == id
    )[0];
    // if elemen is unsceduled

    if (unsceduledCourse) {
      return unsceduledCourse.Opened_course.Department_course.Course.semesterNo;
    }
    return this.dayscheduledCourses.filter(c => c.id == id)[0].Opened_course
      .Department_course.Course.semesterNo;*/
  }
 

  /*--------------------------------Details functions (Modal)------------------------------------*/
  toggle_details(course_id) {
    // this.state.selectedCourse =
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
          x:
            course.Opened_course.Department_course.Course.semesterNo * 2 +
            menuColums, // detrmine colum number
          y: (course.startingHour % 9) + 2, // determine row number of cell adding 2 for static rows (headers) starts from 0
          w: 2, // width of cell
          h: course.duration, //height of cell depends on course hours
          maxW: 2, //prevent couse from belonging to 2 semester (dönem)
          maxH: course.duration, // prevent resizing ders duration
          minH: course.duration // prevent resizing ders duration

          // droppingItem: { i: course.id, w: 6, h: 5 },
        }}
        className="react-grid-item sml"
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
    // check bound of days array if new day index is 7 then give week first day
    this.setState(prevState => {
      let next = (prevState.selectedSemester + 1) % 9;
      return next === 0 ? { selectedSemester: 1 } : { selectedSemester: next };
    });
  };
  update_semesterCourses = () => {
    this.semesterCourses = this.state.unscheduledCourses.filter(
      course => this.getSemesterNo(course.id) === this.state.selectedSemester
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
    console.log(this.state)
    // geting all cells in jsx format
    let cellsComponents;
    let unscheduledCellsComponents;
    if (this.state.scheduledCourses != null) {
      this.update_semesterCourses();
      this.dayscheduledCourses = this.state.scheduledCourses.filter(
        course => course.weekDay === days[this.state.day]
      );
      console.log("day courses", this.dayscheduledCourses);

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
            <Cell course={course} />
          </div>
        );
        // }
      });
    }

    return (
      <>
        {this.state.scheduledCourses.length == 0 ? (
          <div>Loading</div>
        ) : (
          <Row>
            <Col md={10}>
              <GridLayout
                className="layout"
                {...{
                  //autoSize:  true,
                  margin: [5, 5],
                  compactType: null,
                  preventCollision: true,
                  layout: layout,
                  cols: 18 + menuColums,
                  isResizable: true,
                  rowHeight: 44,
                  width: 1100,

                  onDrag: this.onDrag,
                  onDrop: this.onDrop,
                  onDragStop: this.onDragStop,
                  onResize:this.onResize
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
            <My_Modal
              selectedCourse={this.state.selectedCourse}
              details_is_open={this.state.details_is_open}
              close_details={this.close_details}
            />
          </Row>
        )}
      </>
    );
  }
}

export default App;
/*
 
         
         INSERT INTO `test4`.`Teacher`
(
`first_name`,
`last_name`,
`title`,
`mail`)
VALUES

("Ali","Nizam","Yrd. Doç. Dr.","a@gmail.com"),
("Musa","Aydın","Öğr. Gör.","m@gmail.com"),
("Zeynep","GÜNDOĞAR","Dr. Öğr. Üyesi","z@gmail.com"),
("Kadir","Aram","Arş. Gör.","k@gmail.com");




<Modal isOpen={this.state.details_is_open}>
              <ModalHeader>
                {" "}
                Ders Kodu :{" "}
                {
                  this.state.selectedCourse.Opened_course.Department_course
                    .Course.code
                }{" "}
              </ModalHeader>
              <ModalBody>
                <pre>
                  Ders Adı :
                  {
                    this.state.selectedCourse.Opened_course.Department_course
                      .Course.name
                  }
                </pre>
                <pre>
                  Öğretim Elemanları :
                  {this.state.selectedCourse.Event_teachers.map(
                    t =>
                      t.Department_Teacher.Teacher.firstName +
                      " " +
                      t.Department_Teacher.Teacher.lastName
                  ) + " "}{" "}
                </pre>
                <pre>
                  Derslik :
                  {this.state.selectedCourse.Event_classrooms.map(
                    e => e.Classroom.code + " "
                  )}
                </pre>
                <pre>Ders :{this.state.selectedCourse.eventType}</pre>
                <pre>
                  Starting hour :{this.state.selectedCourse.startingHour}{" "}
                </pre>
              </ModalBody>
              <ModalFooter>
                <Button onClick={this.close_details}>Close</Button>
              </ModalFooter>
            </Modal>



            //unsceduled 
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
            <Cell course={course} />
          </div>
         


          //deneme
           <Unscheduled_course course={course} toggle_unsceduled_details={this.toggle_unsceduled_details}
          key={course.id}
          id={course.id}
          data_grid={{
            x: 0, // detrmine colum number
            y: counter++, // determine row number of cell
            w: 2, // width of cell
            maxW: 2, //prevent couse from belonging to 2 semester (dönem)
          }}
          />


          deneme
          import React, { Component } from "react";
import Cell from "./components/Cell";
import "../src/App.css";

export default class Unscheduled_course extends Component {


  render() {

    return (
        <div     
        data-grid={{
          x: this.props.data_grid.x, // detrmine colum number
          y: this.props.data_grid.y, // determine row number of cell
          w: this.props.data_grid.w, // width of cell
          h: this.props.course.duration, //height of cell depends on course hours
          maxW: this.props.data_grid.maxW, //prevent couse from belonging to 2 semester (dönem)
          maxH: this.props.course.duration, // prevent resizing ders duration
          minH: this.props.course.duration // prevent resizing ders duration
        }}
        className="react-grid-item sml"
        onDoubleClick={() => this.props.toggle_unsceduled_details(this.props.course.id)}
      >
        <Cell course={this.props.course} />
      </div>
    );
  }
}

       */
