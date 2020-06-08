import React, { Component } from "react";
import {
  getFormatedStrDateLocal,
getformatedStartingEndingHours
} from "../jsFiles/Functions";



import { days } from "../jsFiles/Constants";
export default class CourseDetails extends Component {
getClassroomColor=()=>{
  if(this.props.conflictType===undefined) return{}
 if(this.props.conflictType==="classroom"
 || this.props.conflictType.startsWith(  "unsuitable classrom")) return {color: "red"}
 return{}
}
getTeacherColor=()=>{
  if(this.props.conflictType===undefined) return{}
 if(this.props.conflictType==="teacher" ||this.props.conflictType==="teacher_restriction"
 ) return {color: "red"}
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
           
            {this.props.timetableType== "Ders" ?
            this.props.selectedCourse.Opened_course.Department_course.Course
            .name+" ("+this.props.selectedCourse.eventType+")":
            this.props.selectedCourse.Opened_course.Department_course.Course
            .name}
          </pre>
          {this.props.selectedCourse.teachers== undefined ?
            "":
            <pre>
            Öğretim Üyeleri {"   :"}
            <div style={this.teacherColor}>
            {this.props.selectedCourse.teachers.map(
              t =>
                t.firstName +
                " " +
                t.lastName
            ) + " "}{" "}
            </div>
          </pre>}
        

          {this.props.selectedCourse.classrooms== undefined ?
            "":
            <pre>
            Derslik {"           :"} 
            <div style={this.ClassroomColor}>{this.props.selectedCourse.classrooms.map(
              c => c.code + " "
            )}</div>
          </pre>
          }



         
          <pre>Ders kodu          :{this.props.selectedCourse.Opened_course.Department_course.Course.code+" ( id : "+this.props.selectedCourse.id+" )"} </pre>
          {/*<pre>Ders günü          :{new Date(this.props.selectedCourse.eventDate)} </pre> */}
          {this.props.selectedCourse.startingHour== null ?
          "":
          <pre>Ders saati         :{
            this.props.selectedCourse.eventDate == null
                              ? ""
                              : 
            getformatedStartingEndingHours(this.props.selectedCourse.startingHour,this.props.selectedCourse.duration)} </pre> 
          }
        
            <pre>
            Ders tarihi {"       :"} 
            {this.props.timetableType!= "Ders" ?
            days[new Date(this.props.selectedCourse.eventDate).getDay()]+" "+getFormatedStrDateLocal(new Date( this.props.selectedCourse.eventDate)):
            days[new Date(this.props.selectedCourse.eventDate).getDay()]
            
        }
          </pre>
          
         
        </div>
    );
  }
}
