import React, { Component } from "react";

export default class Cell extends Component {


  render() {
  
          
    // light red #ff8080    
    return (
      <div className={"sml "+this.props.color} onDoubleClick={this.toggle_details}>
          
        <div>{this.props.course.id+" "+this.props.course.Opened_course.Department_course.Course.code}</div>
        <div>{this.props.course.Opened_course.Department_course.Course.name}</div>
        <div>{this.props.course.Event_teachers[0].Department_Teacher.Teacher.title}</div>
        <div>{this.props.course.Event_teachers[0].Department_Teacher.Teacher.firstName +" "+
              this.props.course.Event_teachers[0].Department_Teacher.Teacher.lastName}
        </div>
        <div>{this.props.course.Event_classrooms[0].Classroom.code}</div>
        
     
  
      </div>
    );
  }
}
