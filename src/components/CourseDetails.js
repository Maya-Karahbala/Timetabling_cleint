import React, { Component } from "react";

export default class CourseDetails extends Component {
getClassroomColor=()=>{
  if(this.props.conflictType===undefined) return{}
 if(this.props.conflictType==="classroom") return {color: "red"}
 return{}
}
getTeacherColor=()=>{
  if(this.props.conflictType===undefined) return{}
 if(this.props.conflictType==="teacher") return {color: "red"}
 return{}
}
 ClassroomColor;
 teacherColor;
  render() {
    this.ClassroomColor=this.getClassroomColor()
    this.ClassroomColor.display="inline-block"    
    this.teacherColor=this.getTeacherColor()
    this.teacherColor.display="inline-block"  
    // light red #ff8080    
    return (
        <div>
               <pre>
            Ders Adı{"           :"} 
            {
              this.props.selectedCourse.Opened_course.Department_course.Course
                .name+" ("+this.props.selectedCourse.eventType+")"
            }
          </pre>
          <pre>
            Öğretim Elemanları :
            <div style={this.teacherColor}>
            {this.props.selectedCourse.Event_teachers.map(
              t =>
                t.Department_Teacher.Teacher.firstName +
                " " +
                t.Department_Teacher.Teacher.lastName
            ) + " "}{" "}
            </div>
          </pre>
          <pre>
            Derslik {"           :"} 
            <div style={this.ClassroomColor}>{this.props.selectedCourse.Event_classrooms.map(
              e => e.Classroom.code + " "
            )}</div>
          </pre>
          <pre>Ders kodu          :{this.props.selectedCourse.Opened_course.Department_course.Course.code+" ( id : "+this.props.selectedCourse.id+" )"} </pre>
          <pre>Başlangıç saat     :{this.props.selectedCourse.weekDay +" "+this.props.selectedCourse.startingHour} </pre> 
        </div>
    );
  }
}
