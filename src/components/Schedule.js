import React from "react";

import Cell from "./Cell";

import UpdateEvent from "./UpdateEvent";
import _ from "lodash";
import GridLayout from "react-grid-layout";
import {Button} from 'primereact/button';
import { Row, Col } from "react-bootstrap";
//alerts
import {Growl} from 'primereact/growl';
//
import { connect } from "react-redux";
import { filteredFetch, updateChangedCourses } from "../redux";

import { isTimeConflicted, setConflicts } from "../jsFiles/Conflicts";
import { hours, days, years } from "../jsFiles/Constants";

import {
  get_changed_Courses,
  send_changedCourses_to_server,

  getGlobalCourses
} from "../jsFiles/Functions";
import {
  getFitness,
  initilizeSchedule,
  initilizePopulation,
  sortPopulation,
  getTournamentPopulation,
  getCrossoverPopulation,
  evolvPopulation
} from "../jsFiles/GeneticAlgorithm";
import {SplitButton} from 'primereact/splitbutton';
var layout = [];

var row = hours.length,
  colums = years.length,
  menuColums = 4
  
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
  constructor(
    departmentData,
    filteredFetch,
    reduxChangedCourses,
    updateChangedCourses,
 
    selectedSemester,
    selectedTimetable,
  ) {
    super();
    this.get_sceduled_cource_html = this.get_sceduled_cource_html.bind(this);

    this.state = {
      scheduledCourses: [],
      unscheduledCourses: [],
      day: 0, //index of selected day
      details_is_open: false,
      selectedCourse: null,
      selectedYear: 1,// on menu in  schedule left side
     
      _isMounted: false
    };
  }
  dayscheduledCourses = [];
  semesterCourses = [];

  /*-------------------------------react hooks------------------------------------*/
  componentDidMount = () => {
    this.setInitialState()
    this.setState({
  
      _isMounted: true,
      prevSchedule:_.cloneDeep(this.props.reduxChangedCourses),
    });
  };
  setInitialState=()=>{

    console.log("new",this.props)
    this.setAllCourses(this.props.reduxChangedCourses);
    this.setState({
      days: this.props.selectedTimetable.days,
        
     
    });
  }
  generate_automatic_schedule = () => {
    // store prvious schedule before automatic schedule generation
    this.setState({
      prevSchedule:_.cloneDeep(this.state.scheduledCourses.concat(this.state.unscheduledCourses)),
    });
  
    let cossoverd
    // initilizeSchedule = function (courses, classrooms, dates , hours)
    let tempDays=this.state.days.map(day => day.dateValue)
    let data = {
      classrooms: this.props.classrooms.filter(c=>c.departmentId==this.props.departmentData.selectedDepartment.id),//.slice(0,this.props.classrooms.length-2),
  
      hours: 
      ["09","13","16"],
      //hours.slice(1,hours.length-2),
      courses: this.props.reduxChangedCourses,
      dates: 
      (this.props.selectedTimetable.timetableType == "Ders")?
      //if course timetable exclude holiday hafta sonu
      tempDays.slice(0,tempDays.length-2):
      // if exam timetable include all days
      tempDays
    };
  
    getGlobalCourses(this.props.selectedSemester.id,this.props.departmentData.selectedDepartment.id,this.props.selectedTimetable.id)
        .then(globalCOurses=>{
          let fitness=0
          let counter=0;
          let population
          population = initilizePopulation(50, data)
          sortPopulation(population,globalCOurses)
          for (let i = 0; i < population.length; i++) {
              
            fitness=getFitness(population[i],globalCOurses)
            console.log("pop ",i," ",population[i])
            console.log("pop ",i," fitness ",getFitness(population[i],globalCOurses))
           
          }
          fitness=getFitness(population[0],[])
         while(counter<20&& fitness!=1){
            console.log("evolve pop counter",counter)
            counter++
             //population=_.cloneDeep(getCrossoverPopulation(population,globalCOurses))
             population=_.cloneDeep( evolvPopulation(population,globalCOurses,data))
           // sortPopulation(population,globalCOurses)
            //console.log("population",population)
            //console.log("---------------")
            for (let i = 0; i < population.length; i++) {
              console.log("evolved pop ",i," fitness ",getFitness(population[i],globalCOurses))
              fitness=getFitness(population[i],globalCOurses)
              if (fitness==1) break
            }
            
          }
          //
          if( getFitness(population[0],[])==1){
            this.growl.show({severity: 'success', summary: '', detail: 'Takvim oluşturuldu'}); 
          }
          else{
            this.growl.show({severity: 'error', detail: 'Çakışma bulunuyor'});
          }
          console.log("--çalıştı en iyi",   getFitness(population[0],globalCOurses))
          getFitness(population[0],globalCOurses)
         
              this.props.updateChangedCourses({
                //data:   JSON.parse(JSON.stringify(allChangedCourse))  ,
                data: population[0],
                arrayName: "ChangedOpenedCoursesEvents"
              });
              
        }).then(()=>{
          this.setInitialState()
          this.refreshSchedule()
        
          
          
        })
     
    
    
  };
  updateSelectedEvent=()=>{
   this.setState({
     selectedCourse:null
   })
  }
  componentWillReceiveProps = props => {
    console.log("componentWillReceiveProps my props is ", props);

    this.setState({});
  };
  componentWillUnmount() {
    let allChangedCourse = this.state.scheduledCourses.concat(
      this.state.unscheduledCourses
    );
    this.props.updateChangedCourses({
      //data:   JSON.parse(JSON.stringify(allChangedCourse))  ,
      data: allChangedCourse,
      arrayName: "ChangedOpenedCoursesEvents"
    });
  
  }
  /*----------------------------------Drag and drop functions-------------------------------------------------------*/
  /*
  layout: Layout, oldItem: LayoutItem, newItem: LayoutItem,
                     placeholder: LayoutItem, e: MouseEvent, element: HTMLElement */

  onDrag = (layout, oldItem, newItem, placeholder, e, element) => {
    console.log("on Drag çalıştı ");
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
    console.log("on Drag stop çalıştı ");
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
   
    if (newItem.y +  Math.ceil( course.duration/60)> row + 1) {
      // course draged out of grid
      newItem.x = oldItem.x;
      newItem.y = oldItem.y;
    } else {


      if (courseType === "scheduled") {
        let tempStarting=new Date("1-1-2001");
        tempStarting.setHours(hours[newItem.y - 1].substring(0, 2),0)
        // draged over scedule chanege values
        if (newItem.x > menuColums) {
          course.startingHour =tempStarting ;
          course.eventDate = this.state.days[this.state.day].dateValue;
        } else {
          // dragged over menu
          course.startingHour = null;
          course.eventDate = null;

          this.delete_Scheduled_Course(course.id);
          this.add_Unsceheduled_Course(course);
          course.conflicts = [];
          this.setState({
            selectedYear: this.getSemesterNoByid(course.id)
          });
        }
        setConflicts(
          this.state.scheduledCourses,
          this.state.scheduledCourses,
          "conflicts"
        );
        console.log(
          "fitness",
          getFitness(
            this.state.scheduledCourses,
          [],
            "conflicts"
          )
        );

        this.setState({});
      } else if (courseType === "unscheduled") {
        let tempStarting=new Date("1-1-2001");
        tempStarting.setHours(hours[newItem.y - 1].substring(0, 2),0)
        // dragged over scedule
        if (newItem.x > menuColums) {
          course.startingHour = tempStarting;
          course.eventDate = this.state.days[this.state.day].dateValue;

          this.delete_Unsceheduled_Course(course.id);
          this.add_Scheduled_Course(course);
          setConflicts(
            this.state.scheduledCourses,
            this.state.scheduledCourses,
            "conflicts"
          );

          this.setState({});
        }
      }
    }
  };
  /*-------------------------------schedule functions------------------------------------*/
  get_previous_day = () => {
    this.setState(prevState => {
      // check bound of days array if new day index is -1 then give week last day
      return prevState.day - 1 === -1
        ? { day: this.state.days.length - 1 }
        : { day: prevState.day - 1 };
    });
  };
  get_next_day = () => {
    // check bound of days array if new day index is 7 then give week first day
    this.setState(prevState => {
      return { day: (prevState.day + 1) % this.state.days.length };
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
          // 9 hardcoded must be controled as first hour in hours list
          y: (course.startingHour.getHours() - 9) + 2, // determine row number of cell adding 2 for static rows (headers) starts from 0

          h: Math.ceil( course.duration/60) , //height of cell depends on course hours  *****???******
          maxW: 2, //prevent couse from belonging to 2 semester (dönem)
          /*
          maxH: course.duration, // prevent resizing ders duration
          minH: course.duration // prevent resizing ders duration*/

      
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
    if (course.eventDate !== null) {
      for (const c of this.state.scheduledCourses) {
        //prevent comparing course with it self
        if (c.id != course.id) {
          // if has  semester and time
          if (
            this.getSemesterNo(course) === this.getSemesterNo(c) &&
            isTimeConflicted(course, c)
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
  /*-------------------------------------other grid functions----------------------------------------------*/
  onResize = (layout, oldItem, newItem) => {
    let course1 = this.getCourse(oldItem.i);
    console.log("resiz çalıştı");

    if(
      course1.course.startingHour != null&&
      this.props.selectedTimetable.timetableType != "Ders"&&
      course1.course.startingHour.getHours()+
    Math.ceil(course1.course.startingHour.getMinutes()/60)
    +newItem.h-1<=
    Number(hours[hours.length-1].substring(0, 2))){
// if duration is  in timetable limit do  change it
    course1.course.duration= newItem.h*60
    }
    else
    newItem.h = oldItem.h;
   
  
    
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
    course.startingHour = null;
    course.eventDate = null;
    console.log("on remove ", course)
    this.delete_Scheduled_Course(course.id);
    this.add_Unsceheduled_Course(course);
    setConflicts(
      this.state.scheduledCourses,
      this.state.scheduledCourses,
      "conflicts"
    );

    let semesterNo = this.getSemesterNoByid(course.id);
    // if semester number does not changed but there is  courses added to menu  make semester change with 0  for forcing rerendering
    this.setState(prev => {
      return prev.selectedYear === semesterNo
        ? {
            selectedYear: 0
          }
        : {};
    });
    setTimeout(() => {
      this.setState(prev => {
        return {
          selectedYear: semesterNo
        };
      });
    }, 10);
  }


  /*--------------------------------Details functions (Modal)------------------------------------*/
  toggle_details = course_id => {
    this.componentWillUnmount();
    this.setState({
      selectedCourse: this.dayscheduledCourses.filter(
        c => c.id === course_id
      )[0],
      details_is_open: true
    });
  };
  toggle_unsceduled_details = course_id => {
    this.componentWillUnmount();
    this.setState(prevState => {
      return {
        selectedCourse: prevState.unscheduledCourses.filter(
          c => c.id === course_id
        )[0],
        details_is_open: true
      };
    });
  };
  close_details = () => {
    this.setInitialState()
    this.setState({
      details_is_open: false
    },()=>{
     
  
      
    });
    setTimeout(() => {
      this.refreshSchedule()
      this.setState({});
    }, 100);
  };
  refreshSchedule=()=>{
    this.get_next_semester_unsceduledCourses()
    this.get_previous_semester_unsceduledCourses() 
    this.get_next_day()
    this.get_previous_day()

  }
  /*-------------------------------------Course functions----------------------------------------------*/

  setAllCourses = (courses) => {
    let scheduled = [];
    let unscheduled = [];


    // courses with unsaved changes
    // copy array without references to store initial course values
    let CoursesCopy = _.cloneDeep(courses);
    CoursesCopy.map(d => {
      // for controling cell width
      d.width = this.getCellwidth(d);
      d.conflicts = [];
      d.universityConflicts = [];

      d.eventDate == null || d.startingHour==null
        ? // if event is unsceduled
          unscheduled.push(d)
        : scheduled.push(d);
    });

    return this.setState(
      {
        scheduledCourses: scheduled,
        unscheduledCourses: unscheduled,
        selectedCourse: CoursesCopy[0] //random
      },
      () => {
        setConflicts(
          this.state.scheduledCourses,
          this.state.scheduledCourses,
          "conflicts"
        );
        setTimeout(() => {
          this.refreshSchedule() 
        }, 10);
        
         
       
      }
    );


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
    return this.getCourse(id).course.Opened_course.Department_course
      .semesterNo;
  }
  getSemesterNo(course) {
    return course.Opened_course.Department_course.semesterNo;
  }
 

  /*-------------------------------menu functions------------------------------------*/
  // student semester number in course defenation 
  get_previous_semester_unsceduledCourses = () => {
    this.setState(prevState => {
      let previous = (prevState.selectedYear - 1) % years.length;
      return previous === 0
        ? { selectedYear: years.length - 1 }
        : { selectedYear: previous };
    });
  };
  get_next_semester_unsceduledCourses = () => {
    // check bound of days array if new day index is 7  then make index equal to 1 (first week day)
    this.setState(prevState => {
      let next = (prevState.selectedYear + 1) % years.length;
      return next === 0 ? { selectedYear: 1 } : { selectedYear: next };
    });
  };
  update_semesterCourses = () => {
    this.semesterCourses = this.state.unscheduledCourses.filter(
      course => this.getSemesterNoByid(course.id) === this.state.selectedYear
    );
  };
updateReduxOpenedCourses=()=>{
 return  this.props
  .filteredFetch({
    deparmentId: this.props.departmentData.selectedDepartment.id,
    selectedSemester: this.props.selectedSemester,
    arrayName: "openedCoursesEvents",
    selectedTimetable: this.props.selectedTimetable
  })
}
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
    return item.y == 1 && item.x >= menuColums ? (
      <div className="headercell" key={item.i}>
        {" "}
        {years[item.i % years.length]}
      </div>
    ) : (
      <div className="headercell" key={item.i}>
        {" "}
        {hours[item.y - 1]} {/* 1 number of row above first hour row*/}
      </div>
    );
  });

  render() {
    // geting all cells in jsx format
    console.log("render edildi", this.state)
   
    let cellsComponents;
    let unscheduledCellsComponents;
    if (this.state.scheduledCourses.length1!=0) {
      this.update_semesterCourses();
      this.dayscheduledCourses = this.state.scheduledCourses.filter(
        course => course.eventDate === this.state.days[this.state.day].dateValue
      );

      cellsComponents = this.dayscheduledCourses.map(course => {
        return this.get_sceduled_cource_html(course);
        ///////////////////////
      });
      console.log("cellsComponents",cellsComponents)
    }
    let counter = 1;
    if (this.state.unscheduledCourses != null) {
      unscheduledCellsComponents = []
      for (let i = 0; i < this.semesterCourses.length; i++) {
        unscheduledCellsComponents.push(
          <div
          key={this.semesterCourses[i].id}
          id={this.semesterCourses[i].id}
          data-grid={{
            x: 
            i<this.semesterCourses.length/2?
            0:2
            , // detrmine colum number
            y: 
            i<this.semesterCourses.length/2?
            counter:
            counter++
            , // determine row number of cell
            w: 2, // width of cell
            h: Math.ceil( this.semesterCourses[i].duration/60)  , //height of cell depends on course hours
            maxW: 2, //prevent couse from belonging to 2 semester (dönem)
           // maxH: Math.ceil( this.semesterCourses[i].duration/60), // prevent resizing ders duration
           // minH: Math.ceil( this.semesterCourses[i].duration/60) // prevent resizing ders duration
          }}
          className="react-grid-item sml"
          onDoubleClick={() => this.toggle_unsceduled_details(this.semesterCourses[i].id)}
        >
          <Cell course={this.semesterCourses[i]} color={"blue"} />
        </div>

        )
        
      }
   
   
    }

    return this.state._isMounted ? (
      <>
        {console.log(this.state)}
        <div>
          <Row className="alarmRow">
            <Col lg={1}></Col>

            <Col lg={9} style={{ marginTop: "2%" }}>
             
              <Growl ref={(el) => this.growl = el} />
             
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
                  cols: years.length * 2 + menuColums,
                  isResizable: true,
                  rowHeight: 41,
                  width: 1190,
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
                  years[this.state.selectedYear]
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
                  (years.length - 2) * 2,
                  1,
                  this.get_previous_day,
                  
                  this.props.selectedTimetable.timetableType == "Ders"?
                  days[this.state.days[this.state.day].dayValue] :
                  (
                    days[this.state.days[this.state.day].dayValue])
                    + "\xa0\xa0" +
                  this.state.days[this.state.day].strValue 
                   
                    
                  
                )}
                {this.create_static_header_cell_html(
                  "c",
                  years.length * 2 + menuColums,
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
          {this.state.scheduledCourses.length == 0 &&
          this.state.unscheduledCourses.length == 0 ? (
            ""
          ) : (
            <UpdateEvent
              addCourseEventIsOpen={this.state.details_is_open}
              close_details={this.close_details}
              selectedEvent={this.state.selectedCourse}
              updateSelectedEvent={this.updateSelectedEvent}
              parent={"Schedule"}
              updateSchedule={this.setInitialState}
         

            /> 
          )}
          <Row className="GridRow">
            <Col lg={5}></Col>
            <Col lg={3} style={{ marginLeft: "22%",whiteSpace:"nowrap" }}>
          
             <SplitButton 
            
             label="otomatik takvim oluştur"
               onClick={this.generate_automatic_schedule}
                model={[
                  
                    {
                        label: 'Önceki Takvim',
                        icon: 'pi pi-refresh',
                        command: (e) => {
                          this.setAllCourses(this.state.prevSchedule);
                          this.growl.show({ severity: 'success', detail: 'Önceki takvim' });
                          
                        }
                    },
                    {
                        label: 'Sil',
                        icon: 'pi pi-times',
                        command: (e) => {
                          let tempScheduledCorses=this.state.scheduledCourses.map(
                            
                            course=>{
                              course.startingHour = null;
                               course.eventDate = null;
                               return course
                              
                            }
                          ) 
                          this.setState(prevState=>{
                            return{
                              unscheduledCourses:prevState.unscheduledCourses.concat(tempScheduledCorses),
                              scheduledCourses:[]
                            }
                          },
                          ()=>{
                            setTimeout(() => {
                              this.get_next_semester_unsceduledCourses()
                            this.get_previous_semester_unsceduledCourses() 
                            }, 10);
                            
                          })
                          
                            this.growl.show({ severity: 'success', detail: 'Takvim silindi' });
                        }
                    },
                ]}></SplitButton>
              </Col>
            
            <Col lg={2} style={{ marginLeft: "-6%" }}>
              <button
                type="button"
                className="btn btn-secondary save"
               
                onClick={() => {
                  let changedEvents = get_changed_Courses(
                    this.state.scheduledCourses.concat(
                      this.state.unscheduledCourses
                    ),
                    this.props.reduxCourses
                  );

                  console.log("changedEvents", changedEvents);
                  if (changedEvents.length != 0) {
                    send_changedCourses_to_server(changedEvents).then(() => {
                      //must be controled and fetched after reqquest from db come
                      setTimeout(() => {
                        this.updateReduxOpenedCourses()
                          .then(() => {
                            this.growl.show({severity: 'success', summary: '', detail: 'değişiklikler kaydedildi'});
                          });
                      }, 500);
                    });
                  }
                }}
              >
                Kaydet
              </button>
         
            </Col>
            
          </Row>
        </div>
      </>
    ) : (
      ""
    );
  }
}
const mapStateToProps = state => {
  return {
    departmentData: state.department,
    reduxCourses: state.data.openedCoursesEvents.map(evt=>{
      evt.startingHour= evt.startingHour== null? null: new Date(evt.startingHour)
      return evt
    }),
    reduxChangedCourses: state.data.ChangedOpenedCoursesEvents.map(evt=>{
      evt.startingHour= evt.startingHour== null? null: new Date(evt.startingHour)
      return evt
    }),

    selectedSemester: state.department.selectedSemester,
    selectedTimetable: state.department.selectedTimetable,
    classrooms: state.data.classrooms
  };
};

const mapDispatchToProps = dispatch => {
  return {
    filteredFetch: data => dispatch(filteredFetch(data)),
    updateChangedCourses: data => dispatch(updateChangedCourses(data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Schedule);
