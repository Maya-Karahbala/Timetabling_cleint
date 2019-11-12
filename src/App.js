import React from "react";
import Cell from "./components/Cell";

import "./App.css";
import _ from "lodash";
import GridLayout from "react-grid-layout";
import { Modal, Button, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
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
const removeStyle = {
  position: "absolute",
  right: "2px",
  top: 0,
  cursor: "pointer"
};

var row = 11,
  colums = 9;
for (let i = 0; i < row; i++) {
  for (let j = 0; j < colums; j++) {
    if (i === 0 || j === 0)
      // headers cordinates
      layout.push({
        i: i.toString() + j.toString(),
        x: j * 2, //each cell will fill 2 colum locate cell in the first one // will be used to saperate cell into 2 section in need
        y: i + 1,
        w: 2,
        h: 1,
        static: true
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
      slayout: null,//include layout of scheduledCourses
      scheduledCourses: [],
      unscheduledCourses: [],
      day: 0, //index of selected day
      details_is_open: false,
      selectedCourse: null

      // {Event_teachers:[{Department_Teacher:[{Teacher:{firstName:""}}]}], Opened_course: { Department_course: { Course: {} } } }
    };
  }

  dayscheduledCourses = [];
  componentWillMount() {
    this.getscheduledCourses();
  }
  getscheduledCourses = () => {
    let scheduled=[]
    let unscheduled=[]
    fetch("http://localhost:3004/openedCourses")
      .then(responce => responce.json())
      .then(data => {
        data.map(d=> {
          (!d.weekDay.length)?
          // if event is unsceduled
          unscheduled.push(d)
         :
         scheduled.push(d)
        })
        this.setState({
         
          scheduledCourses: scheduled,
          unscheduledCourses: unscheduled,
          selectedCourse: data[0]
        });
        console.log("scheduled",scheduled);
        console.log("unsceduled",unscheduled);
        console.log("selected");
        console.log(this.state.selectedCourse);
      })

      .catch(err => console.log(err));
  };
  /*
  layout: Layout, oldItem: LayoutItem, newItem: LayoutItem,
                     placeholder: LayoutItem, e: MouseEvent, element: HTMLElement */
  onDrag = (layout, oldItem, newItem, placeholder, e, element) => {
    /*
    let semesterNo=this.getCourseColumNo(oldItem.i)
    if(placeholder.x!=semesterNo &&(!(newItem.x==semesterNo+1 &&newItem.w===1))){
   
      placeholder.h=0
    }
*/

  };
  onDragStop = (layout, oldItem, newItem, placeholder, e, element) => {
   
    let draggedCource=this.state.unscheduledCourses.filter(c=>c.id==oldItem.i)[0]
     // if elemen is unsceduled and draged over scedule grid is not null
    if (draggedCource){
      console.log(draggedCource)
           this.setState(prevState=>{
             return {
            unscheduledCourses:prevState.unscheduledCourses.filter(course=>course.id!=draggedCource.id),
           // scheduledCourses:prevState.scheduledCourses.push(draggedCource)
             }
           })
    }
    /**myArray = myArray.filter(function( obj ) {
    return obj.field !== 'money';
}); */
    console.log(layout, oldItem, newItem, placeholder, e, element)
    /*
    
    let semesterNo=this.getCourseColumNo(oldItem.i)
                                //if semester width is 1 small and in same semester colum do nothing
    if (newItem.x !=semesterNo &&(!(newItem.x==semesterNo+1 &&newItem.w===1)) ){
      // if course is located in another semester chift it
      newItem.x=oldItem.x

    }
 */
  };
  onDrop = elemParam => {
    console.log(elemParam);
  };

  //according to semester number
  getCourseColumNo(id) {
    return (
      this.dayscheduledCourses.filter(c => c.id == id)[0].Opened_course.Department_course
        .Course.semesterNo * 2
    );
  }
  onRemoveItem(i) {
    console.log("removing", i);
    this.setState({ scheduledCourses: _.reject(this.state.scheduledCourses, { i: i }) });
  }
  toggle_details(course_id) {
    // this.state.selectedCourse =
    this.setState({
      selectedCourse: this.dayscheduledCourses.filter(c => c.id === course_id)[0],
      details_is_open: true
    });
  }
  toggle_unsceduled_details(course_id) {
    // this.state.selectedCourse =
    
    this.setState((prevState)=>{
      return{
        selectedCourse: prevState.unscheduledCourses.filter(c => c.id === course_id)[0],
        details_is_open: true
      }
      
    });
  }
  close_details() {
    this.setState({
      details_is_open: false
    });
  }
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
  get_sceduled_cource_html=(course)=>{
    return (
      <div
        key={course.id}
        id={course.id}
        data-grid={{
          x: course.Opened_course.Department_course.Course.semesterNo * 2, // detrmine colum number
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
      >
        <span
          className="remove"
          style={removeStyle}
          onClick={this.onRemoveItem.bind(this, course.id)}
        >
          x
        </span>

        <Cell course={course} />
      </div>
    );
  }
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
    // geting all cells in jsx format
    let cellsComponents = <div>empty</div>;
   let unscheduledCellsComponents = <div>empty</div>;
    if (this.state.scheduledCourses != null) {
      this.dayscheduledCourses = this.state.scheduledCourses.filter(
        course => course.weekDay === days[this.state.day]
      );
      cellsComponents = this.dayscheduledCourses.map(course => {
        return this.get_sceduled_cource_html(course);
   ///////////////////////
      });
      let counter=0;
      unscheduledCellsComponents = this.state.unscheduledCourses.map(course => {
        
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

              // droppingItem: { i: course.id, w: 6, h: 5 },
            }}
            className="react-grid-item sml"
            onDoubleClick={() => this.toggle_unsceduled_details(course.id)}
            //className="droppable-element"
           //draggable={true}
          
          //unselectable="on"
          onDragEnd= {this.onDragStop}
          >
        

            <Cell course={course} />
          </div>
        );
      });
    }
    let gridProporities = {
      //autoSize:  true,
      margin: [5, 5],
      compactType: null,
      preventCollision: true,
      layout: layout,
      cols: 18,
      isResizable: true,
      rowHeight: 44,
      width: 850,
      onDragStop: this.onDragStop,
      onDrag: this.onDrag,
      onDrop: this.onDrop,
      isDroppable: true
      // draggableHandle:"test",
      // onDragStart: (oldItem )=>console.log(oldItem),
      //  onDrop: ( x, y, e ) => console.log("droped")
    };
 
    return (
      <>
        {this.state.scheduledCourses.length == 0 ? (
          <div>Loading</div>
        ) : (
          <Row>
            <Col md={2}>
              <GridLayout
                className="layout"
                
                {...{  margin: [5, 5],
                  compactType: null,
                  preventCollision: true,
                  layout: layout,
                  cols: 18,
                  isResizable: true,
                  rowHeight: 44,
                  width: 850,
                  onDrop: this.onDrop,
                  onDragStop: this.onDragStop,}}
              >
             {unscheduledCellsComponents}
              </GridLayout>
            </Col>
            
            <Col md={10}>
              <GridLayout className="layout" {...gridProporities}>
                <div
                  key="a"
                  data-grid={{ x: 0, y: 0, w: 2, h: 1, static: true }}
                  className="headercell"
                  onClick={this.get_previous_day}
                >
                  {"<"}
                </div>
                <div
                  key="b"
                  data-grid={{ x: 2, y: 0, w: 14, h: 1, static: true }}
                  className="headercell"
                >
                  {days[this.state.day]}
                </div>
                <div
                  key="c"
                  data-grid={{ x: 16, y: 0, w: 2, h: 1, static: true }}
                  className="headercell"
                  onClick={this.get_next_day}
                >
                  {">"}
                </div>
                {this.headers}
                {cellsComponents}
              </GridLayout>
            </Col>
           
            
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
         
       */
