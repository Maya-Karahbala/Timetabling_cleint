import React, { Component } from "react";
// blue cell showed in schedule
export default class Cell extends Component {
  render() {
    let basicTeachers;
    if (this.props.course.teachers.length != 0) {
      // return first teacher with role=1
      basicTeachers = this.props.course.teachers.filter(
        teacher => teacher.role == 1
      );
      // if no basic teacher return first assitant
      if (basicTeachers.length == 0)
        basicTeachers = this.props.course.teachers.filter(
          teacher => teacher.role == 0
        );
       
    }

    // light red #ff8080
    return this.props.course === undefined ? (
      ""
    ) : (
      <div
        className={"sml " + this.props.color}
        onDoubleClick={this.toggle_details}
      >
        <div>
          {
            this.props.course.Opened_course.Department_course.Course.code}
        </div>
        <div>
          {this.props.course.Opened_course.Department_course.Course.name}
        </div>
        {this.props.course.teachers.length === 0 ? (
          ""
        ) : (
          <div>
            <div>{basicTeachers[0].title}</div>
            <div>{basicTeachers[0].firstName + " " + basicTeachers[0].lastName}</div>
          </div>
        )}
        {this.props.course.classrooms.length === 0 ? (
          ""
        ) : (
          <div>{this.props.course.classrooms[0].code}</div>
        )}
       {//" "+ this.props.course.id 
             }
      </div>
    );
  }
}
