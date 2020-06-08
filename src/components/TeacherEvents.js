import React, { Component } from "react";
import Table from "react-bootstrap/Table";
import { days, hours } from "../jsFiles/Constants";
import nextId from "react-id-generator";
export default class TeacherEvents extends Component {
  render() {
    return (
      <Table>
        <thead>
          <tr key={nextId()}>
            {" "}
            <td key={nextId()}></td>
            {// exclude holidays

            days.slice(1, days.length - 1).map(day => {
              return <td>{day}</td>;
            })}
          </tr>
        </thead>
        <tbody>
          {this.props.teacherEvents.map(evts => {
            let result = [];
            for (let i = 1; i < evts.length; i++) {
              // if event is not already merged cell
              if (
                !(
                  typeof evts[i] == "object" &&
                  evts[i].startingHour.getHours() != evts[0].substring(0, 2)
                )
              ) {
                if (
                  typeof evts[i] == "object" &&
                  evts[i].startingHour.getHours() == evts[0].substring(0, 2)
                ) {
                  result.push(
                    <td
                      key={nextId()}
                      rowSpan={Math.ceil(evts[i].duration / 60)}
                      style={{
                        backgroundColor: "#FAFAD2",
                        fontSize:"60%",
                        border: "#b7a9a9",
                        borderWidth:"2px",
                        borderStyle: "solid",
                      }}
                    >
                      {
                      
                          <div>
                            {
                              evts[i].Opened_course.Department_course.Course
                                .name
                           +" "}<br></br>{
                              evts[i].Opened_course.Department_course.Course
                                .code
                            +" "+evts[i].classrooms
                              .map(c => c.code + " ")
                              .join(",")}
                          </div>
                       
                      }
                    </td>
                  );
                } else {
                  result.push(<td key={nextId()}>{""}</td>);
                }
              }
            }

            return (
              <tr key={nextId()}>
                {/*row hour*/}
                <td key={nextId()} style={{ fontSize: "6px" }}>
                  {evts[0]}
                </td>
                {result}
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  }
}
