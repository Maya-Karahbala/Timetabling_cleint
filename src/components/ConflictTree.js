import {Tree} from 'primereact/tree';
import React, { Component } from 'react'
//<!-- primereact used on conflict tree-->
  import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

export default class ConflictTree extends Component {
    constructor() {
        super();
        this.showDepartmentConflicts = this.showDepartmentConflicts.bind(this);
        this.showConflicts = this.showConflicts.bind(this);
        
        this.updateData = this.updateData.bind(this);
    }
    depClassroomConflicts=[]
    depTeacherConflicts=[]
    ClassroomConflicts=[]
    TeacherConflicts=[]
    data=[]
    showDepartmentConflicts(array,type,order){
        console.log(this.props.scheduledCourses)
        let counter=0
        this.props.scheduledCourses.map(course=>{
            if(course.conflicts.length!==0){
                course.conflicts.map(conflict=>{
                    if(conflict.type===type){
                        array.push({
                            key:(order+(counter++)),
                            label:"("+conflict.conflictedCourse.Opened_course.Department_course.Course
                            .name+","+ course.Opened_course.Department_course.Course
                            .name+")"
                        })
                    }
                 
                })
            }
        })
    }
    showConflicts(array,type,order){
        console.log(this.props.scheduledCourses)
        let counter=0
        this.props.scheduledCourses.map(course=>{
            if(course.universityConflicts.length!==0){
                course.universityConflicts.map(conflict=>{
                    if(conflict.type===type){
                        array.push({
                            key:(order+(counter++)),
                            label:"("+conflict.conflictedCourse.Opened_course.Department_course.Course
                            .name+","+ course.Opened_course.Department_course.Course
                            .name+")"
                        })
                    }
                 
                })
            }
        })
    }
   
  updateData(){
     this.data=[
        { key: "0",
        label: "Bölüm Çakışmaları",
        icon:"pi pi-th-large",
        children: [{
            "key": "0-0",
            "label": "Sınıf Çakışmaları",
            children:this.depClassroomConflicts
        },
        {
            "key": "0-1",
            "label": "Öğretmen Çakışmaları",
            children:this.depTeacherConflicts
        }]
    },
        { key: "1",
        label : "Üniversite Çakışmaları",
        icon: "pi pi-fw pi-home",
        children: [{
            "key": "0-0",
            "label": "Sınıf Çakışmaları",
            children:this.TeacherConflicts
        },
        {
            "key": "0-1",
            "label": "Öğretmen Çakışmaları",
            children:this.ClassroomConflicts
           
        }]
    }
      
    ]
  }
 clear(){
    this.depClassroomConflicts=[]
    this.depTeacherConflicts=[]
    this.ClassroomConflicts=[]
    this.TeacherConflicts=[]
 }
    render() {
       this.clear()
        console.log("...........................")
        this.showDepartmentConflicts(this.depClassroomConflicts,"classroom","0-0-");
        this.showDepartmentConflicts(this.depTeacherConflicts,"teacher","0-1-");
        this.showConflicts(this.ClassroomConflicts,"classroom","1-0-");
        this.showConflicts(this.TeacherConflicts,"teacher","1-1-");
       
        console.log("data...........................")
       this.updateData();
        console.log(this.data)
        return (
            <div>
                
               <Tree value={this.data} /> 
            </div>
        )
    }
}


