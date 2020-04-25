// this class  for testing will be removed later

/*const fetch = require("node-fetch");
const fetchUsers = async () => {

 let response = await fetch("http://localhost:3004/users/1")
 let data = await response.json()
 //console.log("data",data)

 return data;
  
};


console.log(Promise.resolve(fetchUsers()) )*/
import {
  getFitness,
  initilizeSchedule,
  initilizePopulation,
  sortPopulation,
  getTournamentPopulation,
  getCrossoverPopulation,
  evolvPopulation,
  sortScheduleByConflicts,
  repairEvent
} from "./GeneticAlgorithm";

let teachers = [
  {
    id: 1,
    firstName: "Ali",
    lastName: "Demir",
    title: "Yrd. Doç. Dr.",
    mail: "a@gmail.com",
    role: 1,
    Department_Teacher: { id: 1, departmentId: 1, teacherId: 1 }
  },
  {
    id: 2,
    firstName: "Musa",
    lastName: "Demir",
    title: "Öğr. Gör.",
    mail: "m@gmail.com",
    role: 1,
    Department_Teacher: { id: 2, departmentId: 1, teacherId: 2 }
  },
  {
    id: 3,
    firstName: "Zeynep",
    lastName: "ÖZTÜRK",
    title: "Dr. Öğr. Üyesi",
    mail: "z@gmail.com",
    role: 1,
    Department_Teacher: { id: 3, departmentId: 1, teacherId: 3 }
  },
  {
    id: 4,
    firstName: "Kadir",
    lastName: "ÖZTÜRK",
    title: "Arş. Gör.",
    mail: "k@gmail.com",
    role: 0,
    Department_Teacher: { id: 6, departmentId: 1, teacherId: 4 }
  },
  {
    id: 5,
    firstName: "Berna",
    lastName: "ÖZTÜRK",
    title: "Dr. Öğr. Üyesi",
    mail: "berna.kiraz@fsm.edu.tr",
    role: 1,
    Department_Teacher: { id: 8, departmentId: 1, teacherId: 5 }
  },
  {
    id: 6,
    firstName: "Selim",
    lastName: "ÇELEBİ",
    title: "Arş. Gör.",
    mail: "s@gmail.com",
    role: 0,
    Department_Teacher: { id: 10, departmentId: 1, teacherId: 6 }
  }
];
//----------------------------------------
let events = [
  {
    id: 413,
    eventType: "Lab",
    duration: 120,
    startingHour: "2001-02-01T13:00:00.000Z",
    studentNumber: 30,
    timetableId: 115,
    eventDate: "2021-01-08",
    Opened_course: {
      id: 246,
      semesterId: 30,
      departmentCourseId: 2,
      Department_course: {
        id: 2,
        courseId: 2,
        departmentId: 1,
        semesterNo: 4,
        teoriDuration: 180,
        labDuration: 120,
        Course: {
          id: 2,
          name: "statistik ve Olasılık",
          code: "MAT234E",
          courceType: "zorunlu"
        }
      }
    },
    Event_teachers: [
      {
        eventId: 413,
        dapartmentTeacherId: 8,
        id: 587,
        Department_Teacher: {
          id: 8,
          departmentId: 1,
          teacherId: 5,
          Teacher: {
            id: 5,
            firstName: "Berna",
            lastName: "ÖZTÜRK",
            title: "Dr. Öğr. Üyesi",
            mail: "berna.kiraz@fsm.edu.tr",
            role: 1
          }
        }
      },
      {
        eventId: 413,
        dapartmentTeacherId: 6,
        id: 588,
        Department_Teacher: {
          id: 6,
          departmentId: 1,
          teacherId: 4,
          Teacher: {
            id: 4,
            firstName: "Kadir",
            lastName: "ÖZTÜRK",
            title: "Arş. Gör.",
            mail: "k@gmail.com",
            role: 0
          }
        }
      }
    ],
    Event_classrooms: [
      {
        classroomId: 6,
        eventId: 413,
        id: 999,
        Classroom: {
          id: 6,
          ClassroomType: "AMFI",
          code: "A104",
          campus: "Haliç",
          capacity: 100,
          departmentId: 2
        }
      }
    ]
  },
  {
    id: 440,
    eventType: "Teorik",
    duration: 180,
    startingHour: "2001-02-01T07:00:00.000Z",
    studentNumber: 30,
    timetableId: 115,
    eventDate: "2021-01-08",
    Opened_course: {
      id: 242,
      semesterId: 30,
      departmentCourseId: 1,
      Department_course: {
        id: 1,
        courseId: 1,
        departmentId: 1,
        semesterNo: 2,
        teoriDuration: 180,
        labDuration: 120,
        Course: {
          id: 1,
          name: "Programlama II",
          code: "BLM104",
          courceType: "zorunlu"
        }
      }
    },
    Event_teachers: [
      {
        eventId: 440,
        dapartmentTeacherId: 1,
        id: 635,
        Department_Teacher: {
          id: 1,
          departmentId: 1,
          teacherId: 1,
          Teacher: {
            id: 1,
            firstName: "Ali",
            lastName: "Demir",
            title: "Yrd. Doç. Dr.",
            mail: "a@gmail.com",
            role: 1
          }
        }
      }
    ],
    Event_classrooms: [
      {
        classroomId: 5,
        eventId: 440,
        id: 991,
        Classroom: {
          id: 5,
          ClassroomType: "AMFI",
          code: "A102",
          campus: "Haliç",
          capacity: 100,
          departmentId: 2
        }
      }
    ]
  },
  {
    id: 412,
    eventType: "Teorik",
    duration: 180,
    startingHour: "2001-02-01T07:00:00.000Z",
    studentNumber: 30,
    timetableId: 115,
    eventDate: "2021-01-08",
    Opened_course: {
      id: 246,
      semesterId: 30,
      departmentCourseId: 2,
      Department_course: {
        id: 2,
        courseId: 2,
        departmentId: 1,
        semesterNo: 4,
        teoriDuration: 180,
        labDuration: 120,
        Course: {
          id: 2,
          name: "statistik ve Olasılık",
          code: "MAT234E",
          courceType: "zorunlu"
        }
      }
    },
    Event_teachers: [
      {
        eventId: 412,
        dapartmentTeacherId: 8,
        id: 586,
        Department_Teacher: {
          id: 8,
          departmentId: 1,
          teacherId: 5,
          Teacher: {
            id: 5,
            firstName: "Berna",
            lastName: "ÖZTÜRK",
            title: "Dr. Öğr. Üyesi",
            mail: "berna.kiraz@fsm.edu.tr",
            role: 1
          }
        }
      },
      {
        eventId: 412,
        dapartmentTeacherId: 3,
        id: 585,
        Department_Teacher: {
          id: 3,
          departmentId: 1,
          teacherId: 3,
          Teacher: {
            id: 3,
            firstName: "Zeynep",
            lastName: "ÖZTÜRK",
            title: "Dr. Öğr. Üyesi",
            mail: "z@gmail.com",
            role: 1
          }
        }
      },
      {
        eventId: 412,
        dapartmentTeacherId: 2,
        id: 584,
        Department_Teacher: {
          id: 2,
          departmentId: 1,
          teacherId: 2,
          Teacher: {
            id: 2,
            firstName: "Musa",
            lastName: "Demir",
            title: "Öğr. Gör.",
            mail: "m@gmail.com",
            role: 1
          }
        }
      }
    ],
    Event_classrooms: [
      {
        classroomId: 6,
        eventId: 412,
        id: 1009,
        Classroom: {
          id: 6,
          ClassroomType: "AMFI",
          code: "A104",
          campus: "Haliç",
          capacity: 100,
          departmentId: 2
        }
      }
    ]
  },
  {
    id: 426,
    eventType: "Teorik",
    duration: 180,
    startingHour: "2001-02-01T10:00:00.000Z",
    studentNumber: 30,
    timetableId: 115,
    eventDate: "2021-01-08",
    Opened_course: {
      id: 245,
      semesterId: 30,
      departmentCourseId: 7,
      Department_course: {
        id: 7,
        courseId: 6,
        departmentId: 1,
        semesterNo: 8,
        teoriDuration: 180,
        labDuration: 120,
        Course: {
          id: 6,
          name: "Makine Öğrenmesine Giriş",
          code: "BLM462",
          courceType: "alan seçmeli"
        }
      }
    },
    Event_teachers: [
      {
        eventId: 426,
        dapartmentTeacherId: 10,
        id: 608,
        Department_Teacher: {
          id: 10,
          departmentId: 1,
          teacherId: 6,
          Teacher: {
            id: 6,
            firstName: "Selim",
            lastName: "ÇELEBİ",
            title: "Arş. Gör.",
            mail: "s@gmail.com",
            role: 0
          }
        }
      },
      {
        eventId: 426,
        dapartmentTeacherId: 2,
        id: 607,
        Department_Teacher: {
          id: 2,
          departmentId: 1,
          teacherId: 2,
          Teacher: {
            id: 2,
            firstName: "Musa",
            lastName: "Demir",
            title: "Öğr. Gör.",
            mail: "m@gmail.com",
            role: 1
          }
        }
      }
    ],
    Event_classrooms: [
      {
        classroomId: 1,
        eventId: 426,
        id: 1011,
        Classroom: {
          id: 1,
          ClassroomType: "AMFI",
          code: "A103",
          campus: "Haliç",
          capacity: 100,
          departmentId: 1
        }
      }
    ]
  },
  {
    id: 409,
    eventType: "Teorik",
    duration: 180,
    startingHour: "2001-02-01T13:00:00.000Z",
    studentNumber: 30,
    timetableId: 115,
    eventDate: "2021-01-08",
    Opened_course: {
      id: 244,
      semesterId: 30,
      departmentCourseId: 6,
      Department_course: {
        id: 6,
        courseId: 5,
        departmentId: 1,
        semesterNo: 8,
        teoriDuration: 180,
        labDuration: 120,
        Course: {
          id: 5,
          name: "Robotiğe Giriş",
          code: "BLM446E",
          courceType: "alan seçmeli"
        }
      }
    },
    Event_teachers: [
      {
        eventId: 409,
        dapartmentTeacherId: 3,
        id: 626,
        Department_Teacher: {
          id: 3,
          departmentId: 1,
          teacherId: 3,
          Teacher: {
            id: 3,
            firstName: "Zeynep",
            lastName: "ÖZTÜRK",
            title: "Dr. Öğr. Üyesi",
            mail: "z@gmail.com",
            role: 1
          }
        }
      },
      {
        eventId: 409,
        dapartmentTeacherId: 2,
        id: 625,
        Department_Teacher: {
          id: 2,
          departmentId: 1,
          teacherId: 2,
          Teacher: {
            id: 2,
            firstName: "Musa",
            lastName: "Demir",
            title: "Öğr. Gör.",
            mail: "m@gmail.com",
            role: 1
          }
        }
      },
      {
        eventId: 409,
        dapartmentTeacherId: 1,
        id: 580,
        Department_Teacher: {
          id: 1,
          departmentId: 1,
          teacherId: 1,
          Teacher: {
            id: 1,
            firstName: "Ali",
            lastName: "Demir",
            title: "Yrd. Doç. Dr.",
            mail: "a@gmail.com",
            role: 1
          }
        }
      }
    ],
    Event_classrooms: [
      {
        classroomId: 5,
        eventId: 409,
        id: 977,
        Classroom: {
          id: 5,
          ClassroomType: "AMFI",
          code: "A102",
          campus: "Haliç",
          capacity: 100,
          departmentId: 2
        }
      }
    ]
  },
  {
    id: 407,
    eventType: "Lab",
    duration: 120,
    startingHour: "2001-02-01T10:00:00.000Z",
    studentNumber: 30,
    timetableId: 115,
    eventDate: "2021-01-08",
    Opened_course: {
      id: 243,
      semesterId: 30,
      departmentCourseId: 3,
      Department_course: {
        id: 3,
        courseId: 3,
        departmentId: 1,
        semesterNo: 4,
        teoriDuration: 180,
        labDuration: 120,
        Course: {
          id: 3,
          name: "Veri Yapıları",
          code: "BLM202",
          courceType: "zorunlu"
        }
      }
    },
    Event_teachers: [
      {
        eventId: 407,
        dapartmentTeacherId: 1,
        id: 578,
        Department_Teacher: {
          id: 1,
          departmentId: 1,
          teacherId: 1,
          Teacher: {
            id: 1,
            firstName: "Ali",
            lastName: "Demir",
            title: "Yrd. Doç. Dr.",
            mail: "a@gmail.com",
            role: 1
          }
        }
      }
    ],
    Event_classrooms: [
      {
        classroomId: 6,
        eventId: 407,
        id: 1000,
        Classroom: {
          id: 6,
          ClassroomType: "AMFI",
          code: "A104",
          campus: "Haliç",
          capacity: 100,
          departmentId: 2
        }
      }
    ]
  },
  {
    id: 430,
    eventType: "Teorik",
    duration: 180,
    startingHour: "2001-02-01T10:00:00.000Z",
    studentNumber: 30,
    timetableId: 115,
    eventDate: "2021-01-07",
    Opened_course: {
      id: 246,
      semesterId: 30,
      departmentCourseId: 2,
      Department_course: {
        id: 2,
        courseId: 2,
        departmentId: 1,
        semesterNo: 4,
        teoriDuration: 180,
        labDuration: 120,
        Course: {
          id: 2,
          name: "statistik ve Olasılık",
          code: "MAT234E",
          courceType: "zorunlu"
        }
      }
    },
    Event_teachers: [
      {
        eventId: 430,
        dapartmentTeacherId: 6,
        id: 615,
        Department_Teacher: {
          id: 6,
          departmentId: 1,
          teacherId: 4,
          Teacher: {
            id: 4,
            firstName: "Kadir",
            lastName: "ÖZTÜRK",
            title: "Arş. Gör.",
            mail: "k@gmail.com",
            role: 0
          }
        }
      },
      {
        eventId: 430,
        dapartmentTeacherId: 3,
        id: 614,
        Department_Teacher: {
          id: 3,
          departmentId: 1,
          teacherId: 3,
          Teacher: {
            id: 3,
            firstName: "Zeynep",
            lastName: "ÖZTÜRK",
            title: "Dr. Öğr. Üyesi",
            mail: "z@gmail.com",
            role: 1
          }
        }
      }
    ],
    Event_classrooms: [
      {
        classroomId: 6,
        eventId: 430,
        id: 987,
        Classroom: {
          id: 6,
          ClassroomType: "AMFI",
          code: "A104",
          campus: "Haliç",
          capacity: 100,
          departmentId: 2
        }
      }
    ]
  },
  {
    id: 432,
    eventType: "Teorik",
    duration: 180,
    startingHour: "2001-02-01T13:00:00.000Z",
    studentNumber: 30,
    timetableId: 115,
    eventDate: "2021-01-07",
    Opened_course: {
      id: 247,
      semesterId: 30,
      departmentCourseId: 5,
      Department_course: {
        id: 5,
        courseId: 4,
        departmentId: 1,
        semesterNo: 1,
        teoriDuration: 180,
        labDuration: 120,
        Course: {
          id: 4,
          name: "Programlama 1",
          code: "BLM103",
          courceType: "zorunlu"
        }
      }
    },
    Event_teachers: [
      {
        eventId: 432,
        dapartmentTeacherId: 10,
        id: 619,
        Department_Teacher: {
          id: 10,
          departmentId: 1,
          teacherId: 6,
          Teacher: {
            id: 6,
            firstName: "Selim",
            lastName: "ÇELEBİ",
            title: "Arş. Gör.",
            mail: "s@gmail.com",
            role: 0
          }
        }
      },
      {
        eventId: 432,
        dapartmentTeacherId: 8,
        id: 618,
        Department_Teacher: {
          id: 8,
          departmentId: 1,
          teacherId: 5,
          Teacher: {
            id: 5,
            firstName: "Berna",
            lastName: "ÖZTÜRK",
            title: "Dr. Öğr. Üyesi",
            mail: "berna.kiraz@fsm.edu.tr",
            role: 1
          }
        }
      }
    ],
    Event_classrooms: [
      {
        classroomId: 4,
        eventId: 432,
        id: 996,
        Classroom: {
          id: 4,
          ClassroomType: "lab",
          code: "B121",
          campus: "Haliç",
          capacity: 45,
          departmentId: 1
        }
      }
    ]
  },
  {
    id: 404,
    eventType: "Teorik",
    duration: 180,
    startingHour: "2001-02-01T13:00:00.000Z",
    studentNumber: 30,
    timetableId: 115,
    eventDate: "2021-01-07",
    Opened_course: {
      id: 242,
      semesterId: 30,
      departmentCourseId: 1,
      Department_course: {
        id: 1,
        courseId: 1,
        departmentId: 1,
        semesterNo: 2,
        teoriDuration: 180,
        labDuration: 120,
        Course: {
          id: 1,
          name: "Programlama II",
          code: "BLM104",
          courceType: "zorunlu"
        }
      }
    },
    Event_teachers: [
      {
        eventId: 404,
        dapartmentTeacherId: 1,
        id: 575,
        Department_Teacher: {
          id: 1,
          departmentId: 1,
          teacherId: 1,
          Teacher: {
            id: 1,
            firstName: "Ali",
            lastName: "Demir",
            title: "Yrd. Doç. Dr.",
            mail: "a@gmail.com",
            role: 1
          }
        }
      }
    ],
    Event_classrooms: [
      {
        classroomId: 6,
        eventId: 404,
        id: 1004,
        Classroom: {
          id: 6,
          ClassroomType: "AMFI",
          code: "A104",
          campus: "Haliç",
          capacity: 100,
          departmentId: 2
        }
      }
    ]
  },
  {
    id: 435,
    eventType: "Teorik",
    duration: 180,
    startingHour: "2001-02-01T07:00:00.000Z",
    studentNumber: 30,
    timetableId: 115,
    eventDate: "2021-01-07",
    Opened_course: {
      id: 242,
      semesterId: 30,
      departmentCourseId: 1,
      Department_course: {
        id: 1,
        courseId: 1,
        departmentId: 1,
        semesterNo: 2,
        teoriDuration: 180,
        labDuration: 120,
        Course: {
          id: 1,
          name: "Programlama II",
          code: "BLM104",
          courceType: "zorunlu"
        }
      }
    },
    Event_teachers: [
      {
        eventId: 435,
        dapartmentTeacherId: 6,
        id: 629,
        Department_Teacher: {
          id: 6,
          departmentId: 1,
          teacherId: 4,
          Teacher: {
            id: 4,
            firstName: "Kadir",
            lastName: "ÖZTÜRK",
            title: "Arş. Gör.",
            mail: "k@gmail.com",
            role: 0
          }
        }
      },
      {
        eventId: 435,
        dapartmentTeacherId: 1,
        id: 628,
        Department_Teacher: {
          id: 1,
          departmentId: 1,
          teacherId: 1,
          Teacher: {
            id: 1,
            firstName: "Ali",
            lastName: "Demir",
            title: "Yrd. Doç. Dr.",
            mail: "a@gmail.com",
            role: 1
          }
        }
      }
    ],
    Event_classrooms: [
      {
        classroomId: 5,
        eventId: 435,
        id: 1007,
        Classroom: {
          id: 5,
          ClassroomType: "AMFI",
          code: "A102",
          campus: "Haliç",
          capacity: 100,
          departmentId: 2
        }
      }
    ]
  },
  {
    id: 417,
    eventType: "Teorik",
    duration: 180,
    startingHour: "2001-02-01T10:00:00.000Z",
    studentNumber: 30,
    timetableId: 115,
    eventDate: "2021-01-07",
    Opened_course: {
      id: 247,
      semesterId: 30,
      departmentCourseId: 5,
      Department_course: {
        id: 5,
        courseId: 4,
        departmentId: 1,
        semesterNo: 1,
        teoriDuration: 180,
        labDuration: 120,
        Course: {
          id: 4,
          name: "Programlama 1",
          code: "BLM103",
          courceType: "zorunlu"
        }
      }
    },
    Event_teachers: [
      {
        eventId: 417,
        dapartmentTeacherId: 10,
        id: 594,
        Department_Teacher: {
          id: 10,
          departmentId: 1,
          teacherId: 6,
          Teacher: {
            id: 6,
            firstName: "Selim",
            lastName: "ÇELEBİ",
            title: "Arş. Gör.",
            mail: "s@gmail.com",
            role: 0
          }
        }
      },
      {
        eventId: 417,
        dapartmentTeacherId: 8,
        id: 593,
        Department_Teacher: {
          id: 8,
          departmentId: 1,
          teacherId: 5,
          Teacher: {
            id: 5,
            firstName: "Berna",
            lastName: "ÖZTÜRK",
            title: "Dr. Öğr. Üyesi",
            mail: "berna.kiraz@fsm.edu.tr",
            role: 1
          }
        }
      }
    ],
    Event_classrooms: [
      {
        classroomId: 3,
        eventId: 417,
        id: 993,
        Classroom: {
          id: 3,
          ClassroomType: "AMFI",
          code: "D105",
          campus: "Haliç",
          capacity: 100,
          departmentId: 1
        }
      }
    ]
  },
  {
    id: 423,
    eventType: "Teorik",
    duration: 180,
    startingHour: "2001-02-01T07:00:00.000Z",
    studentNumber: 30,
    timetableId: 115,
    eventDate: "2021-01-07",
    Opened_course: {
      id: 243,
      semesterId: 30,
      departmentCourseId: 3,
      Department_course: {
        id: 3,
        courseId: 3,
        departmentId: 1,
        semesterNo: 4,
        teoriDuration: 180,
        labDuration: 120,
        Course: {
          id: 3,
          name: "Veri Yapıları",
          code: "BLM202",
          courceType: "zorunlu"
        }
      }
    },
    Event_teachers: [
      {
        eventId: 423,
        dapartmentTeacherId: 8,
        id: 602,
        Department_Teacher: {
          id: 8,
          departmentId: 1,
          teacherId: 5,
          Teacher: {
            id: 5,
            firstName: "Berna",
            lastName: "ÖZTÜRK",
            title: "Dr. Öğr. Üyesi",
            mail: "berna.kiraz@fsm.edu.tr",
            role: 1
          }
        }
      }
    ],
    Event_classrooms: [
      {
        classroomId: 6,
        eventId: 423,
        id: 933,
        Classroom: {
          id: 6,
          ClassroomType: "AMFI",
          code: "A104",
          campus: "Haliç",
          capacity: 100,
          departmentId: 2
        }
      }
    ]
  },
  {
    id: 406,
    eventType: "Lab",
    duration: 120,
    startingHour: "2001-02-01T10:00:00.000Z",
    studentNumber: 30,
    timetableId: 115,
    eventDate: "2021-01-07",
    Opened_course: {
      id: 242,
      semesterId: 30,
      departmentCourseId: 1,
      Department_course: {
        id: 1,
        courseId: 1,
        departmentId: 1,
        semesterNo: 2,
        teoriDuration: 180,
        labDuration: 120,
        Course: {
          id: 1,
          name: "Programlama II",
          code: "BLM104",
          courceType: "zorunlu"
        }
      }
    },
    Event_teachers: [
      {
        eventId: 406,
        dapartmentTeacherId: 1,
        id: 577,
        Department_Teacher: {
          id: 1,
          departmentId: 1,
          teacherId: 1,
          Teacher: {
            id: 1,
            firstName: "Ali",
            lastName: "Demir",
            title: "Yrd. Doç. Dr.",
            mail: "a@gmail.com",
            role: 1
          }
        }
      }
    ],
    Event_classrooms: [
      {
        classroomId: 2,
        eventId: 406,
        id: 980,
        Classroom: {
          id: 2,
          ClassroomType: "AMFI",
          code: "D111",
          campus: "Haliç",
          capacity: 100,
          departmentId: 1
        }
      }
    ]
  },
  {
    id: 436,
    eventType: "Teorik",
    duration: 180,
    startingHour: "2001-02-01T13:00:00.000Z",
    studentNumber: 30,
    timetableId: 115,
    eventDate: "2021-01-07",
    Opened_course: {
      id: 246,
      semesterId: 30,
      departmentCourseId: 2,
      Department_course: {
        id: 2,
        courseId: 2,
        departmentId: 1,
        semesterNo: 4,
        teoriDuration: 180,
        labDuration: 120,
        Course: {
          id: 2,
          name: "statistik ve Olasılık",
          code: "MAT234E",
          courceType: "zorunlu"
        }
      }
    },
    Event_teachers: [
      {
        eventId: 436,
        dapartmentTeacherId: 3,
        id: 630,
        Department_Teacher: {
          id: 3,
          departmentId: 1,
          teacherId: 3,
          Teacher: {
            id: 3,
            firstName: "Zeynep",
            lastName: "ÖZTÜRK",
            title: "Dr. Öğr. Üyesi",
            mail: "z@gmail.com",
            role: 1
          }
        }
      }
    ],
    Event_classrooms: [
      {
        classroomId: 5,
        eventId: 436,
        id: 989,
        Classroom: {
          id: 5,
          ClassroomType: "AMFI",
          code: "A102",
          campus: "Haliç",
          capacity: 100,
          departmentId: 2
        }
      }
    ]
  },
  {
    id: 416,
    eventType: "Teorik",
    duration: 180,
    startingHour: "2001-02-01T10:00:00.000Z",
    studentNumber: 30,
    timetableId: 115,
    eventDate: "2021-01-06",
    Opened_course: {
      id: 247,
      semesterId: 30,
      departmentCourseId: 5,
      Department_course: {
        id: 5,
        courseId: 4,
        departmentId: 1,
        semesterNo: 1,
        teoriDuration: 180,
        labDuration: 120,
        Course: {
          id: 4,
          name: "Programlama 1",
          code: "BLM103",
          courceType: "zorunlu"
        }
      }
    },
    Event_teachers: [
      {
        eventId: 416,
        dapartmentTeacherId: 2,
        id: 592,
        Department_Teacher: {
          id: 2,
          departmentId: 1,
          teacherId: 2,
          Teacher: {
            id: 2,
            firstName: "Musa",
            lastName: "Demir",
            title: "Öğr. Gör.",
            mail: "m@gmail.com",
            role: 1
          }
        }
      },
      {
        eventId: 416,
        dapartmentTeacherId: 1,
        id: 591,
        Department_Teacher: {
          id: 1,
          departmentId: 1,
          teacherId: 1,
          Teacher: {
            id: 1,
            firstName: "Ali",
            lastName: "Demir",
            title: "Yrd. Doç. Dr.",
            mail: "a@gmail.com",
            role: 1
          }
        }
      }
    ],
    Event_classrooms: [
      {
        classroomId: 6,
        eventId: 416,
        id: 992,
        Classroom: {
          id: 6,
          ClassroomType: "AMFI",
          code: "A104",
          campus: "Haliç",
          capacity: 100,
          departmentId: 2
        }
      }
    ]
  },
  {
    id: 438,
    eventType: "Teorik",
    duration: 180,
    startingHour: "2001-02-01T13:00:00.000Z",
    studentNumber: 30,
    timetableId: 115,
    eventDate: "2021-01-06",
    Opened_course: {
      id: 244,
      semesterId: 30,
      departmentCourseId: 6,
      Department_course: {
        id: 6,
        courseId: 5,
        departmentId: 1,
        semesterNo: 8,
        teoriDuration: 180,
        labDuration: 120,
        Course: {
          id: 5,
          name: "Robotiğe Giriş",
          code: "BLM446E",
          courceType: "alan seçmeli"
        }
      }
    },
    Event_teachers: [
      {
        eventId: 438,
        dapartmentTeacherId: 8,
        id: 632,
        Department_Teacher: {
          id: 8,
          departmentId: 1,
          teacherId: 5,
          Teacher: {
            id: 5,
            firstName: "Berna",
            lastName: "ÖZTÜRK",
            title: "Dr. Öğr. Üyesi",
            mail: "berna.kiraz@fsm.edu.tr",
            role: 1
          }
        }
      }
    ],
    Event_classrooms: [
      {
        classroomId: 3,
        eventId: 438,
        id: 998,
        Classroom: {
          id: 3,
          ClassroomType: "AMFI",
          code: "D105",
          campus: "Haliç",
          capacity: 100,
          departmentId: 1
        }
      }
    ]
  },
  {
    id: 411,
    eventType: "Lab",
    duration: 120,
    startingHour: "2001-02-01T07:00:00.000Z",
    studentNumber: 30,
    timetableId: 115,
    eventDate: "2021-01-06",
    Opened_course: {
      id: 245,
      semesterId: 30,
      departmentCourseId: 7,
      Department_course: {
        id: 7,
        courseId: 6,
        departmentId: 1,
        semesterNo: 8,
        teoriDuration: 180,
        labDuration: 120,
        Course: {
          id: 6,
          name: "Makine Öğrenmesine Giriş",
          code: "BLM462",
          courceType: "alan seçmeli"
        }
      }
    },
    Event_teachers: [
      {
        eventId: 411,
        dapartmentTeacherId: 2,
        id: 582,
        Department_Teacher: {
          id: 2,
          departmentId: 1,
          teacherId: 2,
          Teacher: {
            id: 2,
            firstName: "Musa",
            lastName: "Demir",
            title: "Öğr. Gör.",
            mail: "m@gmail.com",
            role: 1
          }
        }
      },
      {
        eventId: 411,
        dapartmentTeacherId: 3,
        id: 583,
        Department_Teacher: {
          id: 3,
          departmentId: 1,
          teacherId: 3,
          Teacher: {
            id: 3,
            firstName: "Zeynep",
            lastName: "ÖZTÜRK",
            title: "Dr. Öğr. Üyesi",
            mail: "z@gmail.com",
            role: 1
          }
        }
      }
    ],
    Event_classrooms: [
      {
        classroomId: 6,
        eventId: 411,
        id: 898,
        Classroom: {
          id: 6,
          ClassroomType: "AMFI",
          code: "A104",
          campus: "Haliç",
          capacity: 100,
          departmentId: 2
        }
      }
    ]
  },
  {
    id: 424,
    eventType: "Teorik",
    duration: 180,
    startingHour: "2001-02-01T13:00:00.000Z",
    studentNumber: 30,
    timetableId: 115,
    eventDate: "2021-01-06",
    Opened_course: {
      id: 242,
      semesterId: 30,
      departmentCourseId: 1,
      Department_course: {
        id: 1,
        courseId: 1,
        departmentId: 1,
        semesterNo: 2,
        teoriDuration: 180,
        labDuration: 120,
        Course: {
          id: 1,
          name: "Programlama II",
          code: "BLM104",
          courceType: "zorunlu"
        }
      }
    },
    Event_teachers: [
      {
        eventId: 424,
        dapartmentTeacherId: 3,
        id: 627,
        Department_Teacher: {
          id: 3,
          departmentId: 1,
          teacherId: 3,
          Teacher: {
            id: 3,
            firstName: "Zeynep",
            lastName: "ÖZTÜRK",
            title: "Dr. Öğr. Üyesi",
            mail: "z@gmail.com",
            role: 1
          }
        }
      },
      {
        eventId: 424,
        dapartmentTeacherId: 2,
        id: 604,
        Department_Teacher: {
          id: 2,
          departmentId: 1,
          teacherId: 2,
          Teacher: {
            id: 2,
            firstName: "Musa",
            lastName: "Demir",
            title: "Öğr. Gör.",
            mail: "m@gmail.com",
            role: 1
          }
        }
      },
      {
        eventId: 424,
        dapartmentTeacherId: 1,
        id: 603,
        Department_Teacher: {
          id: 1,
          departmentId: 1,
          teacherId: 1,
          Teacher: {
            id: 1,
            firstName: "Ali",
            lastName: "Demir",
            title: "Yrd. Doç. Dr.",
            mail: "a@gmail.com",
            role: 1
          }
        }
      }
    ],
    Event_classrooms: [
      {
        classroomId: 2,
        eventId: 424,
        id: 1001,
        Classroom: {
          id: 2,
          ClassroomType: "AMFI",
          code: "D111",
          campus: "Haliç",
          capacity: 100,
          departmentId: 1
        }
      }
    ]
  },
  {
    id: 439,
    eventType: "Teorik",
    duration: 180,
    startingHour: "2001-02-01T10:00:00.000Z",
    studentNumber: 30,
    timetableId: 115,
    eventDate: "2021-01-06",
    Opened_course: {
      id: 244,
      semesterId: 30,
      departmentCourseId: 6,
      Department_course: {
        id: 6,
        courseId: 5,
        departmentId: 1,
        semesterNo: 8,
        teoriDuration: 180,
        labDuration: 120,
        Course: {
          id: 5,
          name: "Robotiğe Giriş",
          code: "BLM446E",
          courceType: "alan seçmeli"
        }
      }
    },
    Event_teachers: [
      {
        eventId: 439,
        dapartmentTeacherId: 6,
        id: 634,
        Department_Teacher: {
          id: 6,
          departmentId: 1,
          teacherId: 4,
          Teacher: {
            id: 4,
            firstName: "Kadir",
            lastName: "ÖZTÜRK",
            title: "Arş. Gör.",
            mail: "k@gmail.com",
            role: 0
          }
        }
      },
      {
        eventId: 439,
        dapartmentTeacherId: 8,
        id: 633,
        Department_Teacher: {
          id: 8,
          departmentId: 1,
          teacherId: 5,
          Teacher: {
            id: 5,
            firstName: "Berna",
            lastName: "ÖZTÜRK",
            title: "Dr. Öğr. Üyesi",
            mail: "berna.kiraz@fsm.edu.tr",
            role: 1
          }
        }
      }
    ],
    Event_classrooms: [
      {
        classroomId: 5,
        eventId: 439,
        id: 959,
        Classroom: {
          id: 5,
          ClassroomType: "AMFI",
          code: "A102",
          campus: "Haliç",
          capacity: 100,
          departmentId: 2
        }
      }
    ]
  },
  {
    id: 443,
    eventType: "Teorik",
    duration: 180,
    startingHour: "2001-02-01T07:00:00.000Z",
    studentNumber: 30,
    timetableId: 115,
    eventDate: "2021-01-06",
    Opened_course: {
      id: 246,
      semesterId: 30,
      departmentCourseId: 2,
      Department_course: {
        id: 2,
        courseId: 2,
        departmentId: 1,
        semesterNo: 4,
        teoriDuration: 180,
        labDuration: 120,
        Course: {
          id: 2,
          name: "statistik ve Olasılık",
          code: "MAT234E",
          courceType: "zorunlu"
        }
      }
    },
    Event_teachers: [
      {
        eventId: 443,
        dapartmentTeacherId: 8,
        id: 638,
        Department_Teacher: {
          id: 8,
          departmentId: 1,
          teacherId: 5,
          Teacher: {
            id: 5,
            firstName: "Berna",
            lastName: "ÖZTÜRK",
            title: "Dr. Öğr. Üyesi",
            mail: "berna.kiraz@fsm.edu.tr",
            role: 1
          }
        }
      }
    ],
    Event_classrooms: [
      {
        classroomId: 5,
        eventId: 443,
        id: 1014,
        Classroom: {
          id: 5,
          ClassroomType: "AMFI",
          code: "A102",
          campus: "Haliç",
          capacity: 100,
          departmentId: 2
        }
      }
    ]
  },
  {
    id: 425,
    eventType: "Teorik",
    duration: 180,
    startingHour: "2001-02-01T13:00:00.000Z",
    studentNumber: 30,
    timetableId: 115,
    eventDate: "2021-01-05",
    Opened_course: {
      id: 242,
      semesterId: 30,
      departmentCourseId: 1,
      Department_course: {
        id: 1,
        courseId: 1,
        departmentId: 1,
        semesterNo: 2,
        teoriDuration: 180,
        labDuration: 120,
        Course: {
          id: 1,
          name: "Programlama II",
          code: "BLM104",
          courceType: "zorunlu"
        }
      }
    },
    Event_teachers: [
      {
        eventId: 425,
        dapartmentTeacherId: 1,
        id: 605,
        Department_Teacher: {
          id: 1,
          departmentId: 1,
          teacherId: 1,
          Teacher: {
            id: 1,
            firstName: "Ali",
            lastName: "Demir",
            title: "Yrd. Doç. Dr.",
            mail: "a@gmail.com",
            role: 1
          }
        }
      },
      {
        eventId: 425,
        dapartmentTeacherId: 2,
        id: 606,
        Department_Teacher: {
          id: 2,
          departmentId: 1,
          teacherId: 2,
          Teacher: {
            id: 2,
            firstName: "Musa",
            lastName: "Demir",
            title: "Öğr. Gör.",
            mail: "m@gmail.com",
            role: 1
          }
        }
      }
    ],
    Event_classrooms: [
      {
        classroomId: 6,
        eventId: 425,
        id: 1006,
        Classroom: {
          id: 6,
          ClassroomType: "AMFI",
          code: "A104",
          campus: "Haliç",
          capacity: 100,
          departmentId: 2
        }
      }
    ]
  },
  {
    id: 422,
    eventType: "Teorik",
    duration: 180,
    startingHour: "2001-02-01T10:00:00.000Z",
    studentNumber: 30,
    timetableId: 115,
    eventDate: "2021-01-05",
    Opened_course: {
      id: 243,
      semesterId: 30,
      departmentCourseId: 3,
      Department_course: {
        id: 3,
        courseId: 3,
        departmentId: 1,
        semesterNo: 4,
        teoriDuration: 180,
        labDuration: 120,
        Course: {
          id: 3,
          name: "Veri Yapıları",
          code: "BLM202",
          courceType: "zorunlu"
        }
      }
    },
    Event_teachers: [
      {
        eventId: 422,
        dapartmentTeacherId: 3,
        id: 601,
        Department_Teacher: {
          id: 3,
          departmentId: 1,
          teacherId: 3,
          Teacher: {
            id: 3,
            firstName: "Zeynep",
            lastName: "ÖZTÜRK",
            title: "Dr. Öğr. Üyesi",
            mail: "z@gmail.com",
            role: 1
          }
        }
      },
      {
        eventId: 422,
        dapartmentTeacherId: 6,
        id: 600,
        Department_Teacher: {
          id: 6,
          departmentId: 1,
          teacherId: 4,
          Teacher: {
            id: 4,
            firstName: "Kadir",
            lastName: "ÖZTÜRK",
            title: "Arş. Gör.",
            mail: "k@gmail.com",
            role: 0
          }
        }
      }
    ],
    Event_classrooms: [
      {
        classroomId: 6,
        eventId: 422,
        id: 1008,
        Classroom: {
          id: 6,
          ClassroomType: "AMFI",
          code: "A104",
          campus: "Haliç",
          capacity: 100,
          departmentId: 2
        }
      }
    ]
  },
  {
    id: 421,
    eventType: "Teorik",
    duration: 180,
    startingHour: "2001-02-01T13:00:00.000Z",
    studentNumber: 30,
    timetableId: 115,
    eventDate: "2021-01-05",
    Opened_course: {
      id: 247,
      semesterId: 30,
      departmentCourseId: 5,
      Department_course: {
        id: 5,
        courseId: 4,
        departmentId: 1,
        semesterNo: 1,
        teoriDuration: 180,
        labDuration: 120,
        Course: {
          id: 4,
          name: "Programlama 1",
          code: "BLM103",
          courceType: "zorunlu"
        }
      }
    },
    Event_teachers: [
      {
        eventId: 421,
        dapartmentTeacherId: 3,
        id: 599,
        Department_Teacher: {
          id: 3,
          departmentId: 1,
          teacherId: 3,
          Teacher: {
            id: 3,
            firstName: "Zeynep",
            lastName: "ÖZTÜRK",
            title: "Dr. Öğr. Üyesi",
            mail: "z@gmail.com",
            role: 1
          }
        }
      }
    ],
    Event_classrooms: [
      {
        classroomId: 5,
        eventId: 421,
        id: 990,
        Classroom: {
          id: 5,
          ClassroomType: "AMFI",
          code: "A102",
          campus: "Haliç",
          capacity: 100,
          departmentId: 2
        }
      }
    ]
  },
  {
    id: 427,
    eventType: "Teorik",
    duration: 180,
    startingHour: "2001-02-01T07:00:00.000Z",
    studentNumber: 30,
    timetableId: 115,
    eventDate: "2021-01-05",
    Opened_course: {
      id: 245,
      semesterId: 30,
      departmentCourseId: 7,
      Department_course: {
        id: 7,
        courseId: 6,
        departmentId: 1,
        semesterNo: 8,
        teoriDuration: 180,
        labDuration: 120,
        Course: {
          id: 6,
          name: "Makine Öğrenmesine Giriş",
          code: "BLM462",
          courceType: "alan seçmeli"
        }
      }
    },
    Event_teachers: [
      {
        eventId: 427,
        dapartmentTeacherId: 10,
        id: 609,
        Department_Teacher: {
          id: 10,
          departmentId: 1,
          teacherId: 6,
          Teacher: {
            id: 6,
            firstName: "Selim",
            lastName: "ÇELEBİ",
            title: "Arş. Gör.",
            mail: "s@gmail.com",
            role: 0
          }
        }
      },
      {
        eventId: 427,
        dapartmentTeacherId: 8,
        id: 610,
        Department_Teacher: {
          id: 8,
          departmentId: 1,
          teacherId: 5,
          Teacher: {
            id: 5,
            firstName: "Berna",
            lastName: "ÖZTÜRK",
            title: "Dr. Öğr. Üyesi",
            mail: "berna.kiraz@fsm.edu.tr",
            role: 1
          }
        }
      }
    ],
    Event_classrooms: [
      {
        classroomId: 6,
        eventId: 427,
        id: 957,
        Classroom: {
          id: 6,
          ClassroomType: "AMFI",
          code: "A104",
          campus: "Haliç",
          capacity: 100,
          departmentId: 2
        }
      }
    ]
  },
  {
    id: 437,
    eventType: "Teorik",
    duration: 180,
    startingHour: "2001-02-01T07:00:00.000Z",
    studentNumber: 30,
    timetableId: 115,
    eventDate: "2021-01-05",
    Opened_course: {
      id: 243,
      semesterId: 30,
      departmentCourseId: 3,
      Department_course: {
        id: 3,
        courseId: 3,
        departmentId: 1,
        semesterNo: 4,
        teoriDuration: 180,
        labDuration: 120,
        Course: {
          id: 3,
          name: "Veri Yapıları",
          code: "BLM202",
          courceType: "zorunlu"
        }
      }
    },
    Event_teachers: [
      {
        eventId: 437,
        dapartmentTeacherId: 2,
        id: 631,
        Department_Teacher: {
          id: 2,
          departmentId: 1,
          teacherId: 2,
          Teacher: {
            id: 2,
            firstName: "Musa",
            lastName: "Demir",
            title: "Öğr. Gör.",
            mail: "m@gmail.com",
            role: 1
          }
        }
      }
    ],
    Event_classrooms: [
      {
        classroomId: 4,
        eventId: 437,
        id: 986,
        Classroom: {
          id: 4,
          ClassroomType: "lab",
          code: "B121",
          campus: "Haliç",
          capacity: 45,
          departmentId: 1
        }
      }
    ]
  },
  {
    id: 420,
    eventType: "Lab",
    duration: 120,
    startingHour: "2001-02-01T10:00:00.000Z",
    studentNumber: 30,
    timetableId: 115,
    eventDate: "2021-01-05",
    Opened_course: {
      id: 247,
      semesterId: 30,
      departmentCourseId: 5,
      Department_course: {
        id: 5,
        courseId: 4,
        departmentId: 1,
        semesterNo: 1,
        teoriDuration: 180,
        labDuration: 120,
        Course: {
          id: 4,
          name: "Programlama 1",
          code: "BLM103",
          courceType: "zorunlu"
        }
      }
    },
    Event_teachers: [
      {
        eventId: 420,
        dapartmentTeacherId: 10,
        id: 598,
        Department_Teacher: {
          id: 10,
          departmentId: 1,
          teacherId: 6,
          Teacher: {
            id: 6,
            firstName: "Selim",
            lastName: "ÇELEBİ",
            title: "Arş. Gör.",
            mail: "s@gmail.com",
            role: 0
          }
        }
      },
      {
        eventId: 420,
        dapartmentTeacherId: 8,
        id: 597,
        Department_Teacher: {
          id: 8,
          departmentId: 1,
          teacherId: 5,
          Teacher: {
            id: 5,
            firstName: "Berna",
            lastName: "ÖZTÜRK",
            title: "Dr. Öğr. Üyesi",
            mail: "berna.kiraz@fsm.edu.tr",
            role: 1
          }
        }
      }
    ],
    Event_classrooms: [
      {
        classroomId: 4,
        eventId: 420,
        id: 997,
        Classroom: {
          id: 4,
          ClassroomType: "lab",
          code: "B121",
          campus: "Haliç",
          capacity: 45,
          departmentId: 1
        }
      }
    ]
  },
  {
    id: 410,
    eventType: "Lab",
    duration: 120,
    startingHour: "2001-02-01T10:00:00.000Z",
    studentNumber: 30,
    timetableId: 115,
    eventDate: "2021-01-05",
    Opened_course: {
      id: 244,
      semesterId: 30,
      departmentCourseId: 6,
      Department_course: {
        id: 6,
        courseId: 5,
        departmentId: 1,
        semesterNo: 8,
        teoriDuration: 180,
        labDuration: 120,
        Course: {
          id: 5,
          name: "Robotiğe Giriş",
          code: "BLM446E",
          courceType: "alan seçmeli"
        }
      }
    },
    Event_teachers: [
      {
        eventId: 410,
        dapartmentTeacherId: 1,
        id: 581,
        Department_Teacher: {
          id: 1,
          departmentId: 1,
          teacherId: 1,
          Teacher: {
            id: 1,
            firstName: "Ali",
            lastName: "Demir",
            title: "Yrd. Doç. Dr.",
            mail: "a@gmail.com",
            role: 1
          }
        }
      }
    ],
    Event_classrooms: [
      {
        classroomId: 2,
        eventId: 410,
        id: 1012,
        Classroom: {
          id: 2,
          ClassroomType: "AMFI",
          code: "D111",
          campus: "Haliç",
          capacity: 100,
          departmentId: 1
        }
      }
    ]
  },
  {
    id: 428,
    eventType: "Teorik",
    duration: 180,
    startingHour: "2001-02-01T13:00:00.000Z",
    studentNumber: 30,
    timetableId: 115,
    eventDate: "2021-01-05",
    Opened_course: {
      id: 243,
      semesterId: 30,
      departmentCourseId: 3,
      Department_course: {
        id: 3,
        courseId: 3,
        departmentId: 1,
        semesterNo: 4,
        teoriDuration: 180,
        labDuration: 120,
        Course: {
          id: 3,
          name: "Veri Yapıları",
          code: "BLM202",
          courceType: "zorunlu"
        }
      }
    },
    Event_teachers: [
      {
        eventId: 428,
        dapartmentTeacherId: 8,
        id: 612,
        Department_Teacher: {
          id: 8,
          departmentId: 1,
          teacherId: 5,
          Teacher: {
            id: 5,
            firstName: "Berna",
            lastName: "ÖZTÜRK",
            title: "Dr. Öğr. Üyesi",
            mail: "berna.kiraz@fsm.edu.tr",
            role: 1
          }
        }
      },
      {
        eventId: 428,
        dapartmentTeacherId: 10,
        id: 611,
        Department_Teacher: {
          id: 10,
          departmentId: 1,
          teacherId: 6,
          Teacher: {
            id: 6,
            firstName: "Selim",
            lastName: "ÇELEBİ",
            title: "Arş. Gör.",
            mail: "s@gmail.com",
            role: 0
          }
        }
      }
    ],
    Event_classrooms: [
      {
        classroomId: 1,
        eventId: 428,
        id: 1013,
        Classroom: {
          id: 1,
          ClassroomType: "AMFI",
          code: "A103",
          campus: "Haliç",
          capacity: 100,
          departmentId: 1
        }
      }
    ]
  },
  {
    id: 415,
    eventType: "Teorik",
    duration: 180,
    startingHour: "2001-02-01T07:00:00.000Z",
    studentNumber: 30,
    timetableId: 115,
    eventDate: "2021-01-05",
    Opened_course: {
      id: 247,
      semesterId: 30,
      departmentCourseId: 5,
      Department_course: {
        id: 5,
        courseId: 4,
        departmentId: 1,
        semesterNo: 1,
        teoriDuration: 180,
        labDuration: 120,
        Course: {
          id: 4,
          name: "Programlama 1",
          code: "BLM103",
          courceType: "zorunlu"
        }
      }
    },
    Event_teachers: [
      {
        eventId: 415,
        dapartmentTeacherId: 1,
        id: 590,
        Department_Teacher: {
          id: 1,
          departmentId: 1,
          teacherId: 1,
          Teacher: {
            id: 1,
            firstName: "Ali",
            lastName: "Demir",
            title: "Yrd. Doç. Dr.",
            mail: "a@gmail.com",
            role: 1
          }
        }
      }
    ],
    Event_classrooms: [
      {
        classroomId: 1,
        eventId: 415,
        id: 994,
        Classroom: {
          id: 1,
          ClassroomType: "AMFI",
          code: "A103",
          campus: "Haliç",
          capacity: 100,
          departmentId: 1
        }
      }
    ]
  },
  {
    id: 405,
    eventType: "Teorik",
    duration: 180,
    startingHour: "2001-02-01T07:00:00.000Z",
    studentNumber: 30,
    timetableId: 115,
    eventDate: "2021-01-04",
    Opened_course: {
      id: 242,
      semesterId: 30,
      departmentCourseId: 1,
      Department_course: {
        id: 1,
        courseId: 1,
        departmentId: 1,
        semesterNo: 2,
        teoriDuration: 180,
        labDuration: 120,
        Course: {
          id: 1,
          name: "Programlama II",
          code: "BLM104",
          courceType: "zorunlu"
        }
      }
    },
    Event_teachers: [
      {
        eventId: 405,
        dapartmentTeacherId: 1,
        id: 576,
        Department_Teacher: {
          id: 1,
          departmentId: 1,
          teacherId: 1,
          Teacher: {
            id: 1,
            firstName: "Ali",
            lastName: "Demir",
            title: "Yrd. Doç. Dr.",
            mail: "a@gmail.com",
            role: 1
          }
        }
      }
    ],
    Event_classrooms: [
      {
        classroomId: 2,
        eventId: 405,
        id: 1002,
        Classroom: {
          id: 2,
          ClassroomType: "AMFI",
          code: "D111",
          campus: "Haliç",
          capacity: 100,
          departmentId: 1
        }
      }
    ]
  },
  {
    id: 418,
    eventType: "Teorik",
    duration: 180,
    startingHour: "2001-02-01T07:00:00.000Z",
    studentNumber: 30,
    timetableId: 115,
    eventDate: "2021-01-04",
    Opened_course: {
      id: 247,
      semesterId: 30,
      departmentCourseId: 5,
      Department_course: {
        id: 5,
        courseId: 4,
        departmentId: 1,
        semesterNo: 1,
        teoriDuration: 180,
        labDuration: 120,
        Course: {
          id: 4,
          name: "Programlama 1",
          code: "BLM103",
          courceType: "zorunlu"
        }
      }
    },
    Event_teachers: [
      {
        eventId: 418,
        dapartmentTeacherId: 10,
        id: 623,
        Department_Teacher: {
          id: 10,
          departmentId: 1,
          teacherId: 6,
          Teacher: {
            id: 6,
            firstName: "Selim",
            lastName: "ÇELEBİ",
            title: "Arş. Gör.",
            mail: "s@gmail.com",
            role: 0
          }
        }
      },
      {
        eventId: 418,
        dapartmentTeacherId: 8,
        id: 595,
        Department_Teacher: {
          id: 8,
          departmentId: 1,
          teacherId: 5,
          Teacher: {
            id: 5,
            firstName: "Berna",
            lastName: "ÖZTÜRK",
            title: "Dr. Öğr. Üyesi",
            mail: "berna.kiraz@fsm.edu.tr",
            role: 1
          }
        }
      },
      {
        eventId: 418,
        dapartmentTeacherId: 6,
        id: 624,
        Department_Teacher: {
          id: 6,
          departmentId: 1,
          teacherId: 4,
          Teacher: {
            id: 4,
            firstName: "Kadir",
            lastName: "ÖZTÜRK",
            title: "Arş. Gör.",
            mail: "k@gmail.com",
            role: 0
          }
        }
      }
    ],
    Event_classrooms: [
      {
        classroomId: 1,
        eventId: 418,
        id: 1003,
        Classroom: {
          id: 1,
          ClassroomType: "AMFI",
          code: "A103",
          campus: "Haliç",
          capacity: 100,
          departmentId: 1
        }
      }
    ]
  },
  {
    id: 442,
    eventType: "Teorik",
    duration: 180,
    startingHour: "2001-02-01T10:00:00.000Z",
    studentNumber: 30,
    timetableId: 115,
    eventDate: "2021-01-04",
    Opened_course: {
      id: 244,
      semesterId: 30,
      departmentCourseId: 6,
      Department_course: {
        id: 6,
        courseId: 5,
        departmentId: 1,
        semesterNo: 8,
        teoriDuration: 180,
        labDuration: 120,
        Course: {
          id: 5,
          name: "Robotiğe Giriş",
          code: "BLM446E",
          courceType: "alan seçmeli"
        }
      }
    },
    Event_teachers: [
      {
        eventId: 442,
        dapartmentTeacherId: 8,
        id: 637,
        Department_Teacher: {
          id: 8,
          departmentId: 1,
          teacherId: 5,
          Teacher: {
            id: 5,
            firstName: "Berna",
            lastName: "ÖZTÜRK",
            title: "Dr. Öğr. Üyesi",
            mail: "berna.kiraz@fsm.edu.tr",
            role: 1
          }
        }
      }
    ],
    Event_classrooms: [
      {
        classroomId: 3,
        eventId: 442,
        id: 1010,
        Classroom: {
          id: 3,
          ClassroomType: "AMFI",
          code: "D105",
          campus: "Haliç",
          capacity: 100,
          departmentId: 1
        }
      }
    ]
  },
  {
    id: 408,
    eventType: "Teorik",
    duration: 180,
    startingHour: "2001-02-01T10:00:00.000Z",
    studentNumber: 30,
    timetableId: 115,
    eventDate: "2021-01-04",
    Opened_course: {
      id: 243,
      semesterId: 30,
      departmentCourseId: 3,
      Department_course: {
        id: 3,
        courseId: 3,
        departmentId: 1,
        semesterNo: 4,
        teoriDuration: 180,
        labDuration: 120,
        Course: {
          id: 3,
          name: "Veri Yapıları",
          code: "BLM202",
          courceType: "zorunlu"
        }
      }
    },
    Event_teachers: [
      {
        eventId: 408,
        dapartmentTeacherId: 1,
        id: 579,
        Department_Teacher: {
          id: 1,
          departmentId: 1,
          teacherId: 1,
          Teacher: {
            id: 1,
            firstName: "Ali",
            lastName: "Demir",
            title: "Yrd. Doç. Dr.",
            mail: "a@gmail.com",
            role: 1
          }
        }
      }
    ],
    Event_classrooms: [
      {
        classroomId: 2,
        eventId: 408,
        id: 988,
        Classroom: {
          id: 2,
          ClassroomType: "AMFI",
          code: "D111",
          campus: "Haliç",
          capacity: 100,
          departmentId: 1
        }
      }
    ]
  },
  {
    id: 429,
    eventType: "Teorik",
    duration: 180,
    startingHour: "2001-02-01T07:00:00.000Z",
    studentNumber: 30,
    timetableId: 115,
    eventDate: "2021-01-04",
    Opened_course: {
      id: 246,
      semesterId: 30,
      departmentCourseId: 2,
      Department_course: {
        id: 2,
        courseId: 2,
        departmentId: 1,
        semesterNo: 4,
        teoriDuration: 180,
        labDuration: 120,
        Course: {
          id: 2,
          name: "statistik ve Olasılık",
          code: "MAT234E",
          courceType: "zorunlu"
        }
      }
    },
    Event_teachers: [
      {
        eventId: 429,
        dapartmentTeacherId: 3,
        id: 613,
        Department_Teacher: {
          id: 3,
          departmentId: 1,
          teacherId: 3,
          Teacher: {
            id: 3,
            firstName: "Zeynep",
            lastName: "ÖZTÜRK",
            title: "Dr. Öğr. Üyesi",
            mail: "z@gmail.com",
            role: 1
          }
        }
      }
    ],
    Event_classrooms: [
      {
        classroomId: 6,
        eventId: 429,
        id: 962,
        Classroom: {
          id: 6,
          ClassroomType: "AMFI",
          code: "A104",
          campus: "Haliç",
          capacity: 100,
          departmentId: 2
        }
      }
    ]
  },
  {
    id: 431,
    eventType: "Teorik",
    duration: 180,
    startingHour: "2001-02-01T10:00:00.000Z",
    studentNumber: 30,
    timetableId: 115,
    eventDate: "2021-01-04",
    Opened_course: {
      id: 247,
      semesterId: 30,
      departmentCourseId: 5,
      Department_course: {
        id: 5,
        courseId: 4,
        departmentId: 1,
        semesterNo: 1,
        teoriDuration: 180,
        labDuration: 120,
        Course: {
          id: 4,
          name: "Programlama 1",
          code: "BLM103",
          courceType: "zorunlu"
        }
      }
    },
    Event_teachers: [
      {
        eventId: 431,
        dapartmentTeacherId: 6,
        id: 617,
        Department_Teacher: {
          id: 6,
          departmentId: 1,
          teacherId: 4,
          Teacher: {
            id: 4,
            firstName: "Kadir",
            lastName: "ÖZTÜRK",
            title: "Arş. Gör.",
            mail: "k@gmail.com",
            role: 0
          }
        }
      },
      {
        eventId: 431,
        dapartmentTeacherId: 3,
        id: 616,
        Department_Teacher: {
          id: 3,
          departmentId: 1,
          teacherId: 3,
          Teacher: {
            id: 3,
            firstName: "Zeynep",
            lastName: "ÖZTÜRK",
            title: "Dr. Öğr. Üyesi",
            mail: "z@gmail.com",
            role: 1
          }
        }
      }
    ],
    Event_classrooms: [
      {
        classroomId: 1,
        eventId: 431,
        id: 1005,
        Classroom: {
          id: 1,
          ClassroomType: "AMFI",
          code: "A103",
          campus: "Haliç",
          capacity: 100,
          departmentId: 1
        }
      }
    ]
  },
  {
    id: 419,
    eventType: "Teorik",
    duration: 180,
    startingHour: "2001-02-01T13:00:00.000Z",
    studentNumber: 30,
    timetableId: 115,
    eventDate: "2021-01-04",
    Opened_course: {
      id: 247,
      semesterId: 30,
      departmentCourseId: 5,
      Department_course: {
        id: 5,
        courseId: 4,
        departmentId: 1,
        semesterNo: 1,
        teoriDuration: 180,
        labDuration: 120,
        Course: {
          id: 4,
          name: "Programlama 1",
          code: "BLM103",
          courceType: "zorunlu"
        }
      }
    },
    Event_teachers: [
      {
        eventId: 419,
        dapartmentTeacherId: 2,
        id: 596,
        Department_Teacher: {
          id: 2,
          departmentId: 1,
          teacherId: 2,
          Teacher: {
            id: 2,
            firstName: "Musa",
            lastName: "Demir",
            title: "Öğr. Gör.",
            mail: "m@gmail.com",
            role: 1
          }
        }
      }
    ],
    Event_classrooms: [
      {
        classroomId: 5,
        eventId: 419,
        id: 995,
        Classroom: {
          id: 5,
          ClassroomType: "AMFI",
          code: "A102",
          campus: "Haliç",
          capacity: 100,
          departmentId: 2
        }
      }
    ]
  },
  {
    id: 414,
    eventType: "Teorik",
    duration: 180,
    startingHour: "2001-02-01T13:00:00.000Z",
    studentNumber: 30,
    timetableId: 115,
    eventDate: "2021-01-04",
    Opened_course: {
      id: 245,
      semesterId: 30,
      departmentCourseId: 7,
      Department_course: {
        id: 7,
        courseId: 6,
        departmentId: 1,
        semesterNo: 8,
        teoriDuration: 180,
        labDuration: 120,
        Course: {
          id: 6,
          name: "Makine Öğrenmesine Giriş",
          code: "BLM462",
          courceType: "alan seçmeli"
        }
      }
    },
    Event_teachers: [
      {
        eventId: 414,
        dapartmentTeacherId: 3,
        id: 589,
        Department_Teacher: {
          id: 3,
          departmentId: 1,
          teacherId: 3,
          Teacher: {
            id: 3,
            firstName: "Zeynep",
            lastName: "ÖZTÜRK",
            title: "Dr. Öğr. Üyesi",
            mail: "z@gmail.com",
            role: 1
          }
        }
      }
    ],
    Event_classrooms: [
      {
        classroomId: 4,
        eventId: 414,
        id: 967,
        Classroom: {
          id: 4,
          ClassroomType: "lab",
          code: "B121",
          campus: "Haliç",
          capacity: 45,
          departmentId: 1
        }
      }
    ]
  },
  {
    id: 441,
    eventType: "Teorik",
    duration: 180,
    startingHour: "2001-02-01T13:00:00.000Z",
    studentNumber: 30,
    timetableId: 115,
    eventDate: "2021-01-04",
    Opened_course: {
      id: 242,
      semesterId: 30,
      departmentCourseId: 1,
      Department_course: {
        id: 1,
        courseId: 1,
        departmentId: 1,
        semesterNo: 2,
        teoriDuration: 180,
        labDuration: 120,
        Course: {
          id: 1,
          name: "Programlama II",
          code: "BLM104",
          courceType: "zorunlu"
        }
      }
    },
    Event_teachers: [
      {
        eventId: 441,
        dapartmentTeacherId: 8,
        id: 636,
        Department_Teacher: {
          id: 8,
          departmentId: 1,
          teacherId: 5,
          Teacher: {
            id: 5,
            firstName: "Berna",
            lastName: "ÖZTÜRK",
            title: "Dr. Öğr. Üyesi",
            mail: "berna.kiraz@fsm.edu.tr",
            role: 1
          }
        }
      }
    ],
    Event_classrooms: [
      {
        classroomId: 6,
        eventId: 441,
        id: 983,
        Classroom: {
          id: 6,
          ClassroomType: "AMFI",
          code: "A104",
          campus: "Haliç",
          capacity: 100,
          departmentId: 2
        }
      }
    ]
  }
];
//----------------------------------------
let classrooms = [
  {
    id: 6,
    ClassroomType: "AMFI",
    code: "A104",
    campus: "Haliç",
    capacity: 100,
    departmentId: 2
  },
  {
    id: 5,
    ClassroomType: "AMFI",
    code: "A102",
    campus: "Haliç",
    capacity: 100,
    departmentId: 2
  },
  {
    id: 4,
    ClassroomType: "lab",
    code: "B121",
    campus: "Haliç",
    capacity: 45,
    departmentId: 1
  },
  {
    id: 3,
    ClassroomType: "AMFI",
    code: "D105",
    campus: "Haliç",
    capacity: 100,
    departmentId: 1
  },
  {
    id: 2,
    ClassroomType: "AMFI",
    code: "D111",
    campus: "Haliç",
    capacity: 100,
    departmentId: 1
  },
  {
    id: 1,
    ClassroomType: "AMFI",
    code: "A103",
    campus: "Haliç",
    capacity: 100,
    departmentId: 1
  }
];
//----------------------------------------
events.map(evt => {
  // update structure of events come from database to meet program requirements

  evt.teachers = evt.Event_teachers.map(ev => {
    let t = ev.Department_Teacher.Teacher;
    t.dapartmentTeacherId = ev.Department_Teacher.id;

    return t;
  });
  evt.classrooms = evt.Event_classrooms.map(ev => {
    return ev.Classroom;
  });
  delete evt.Event_teachers;
  delete evt.Event_classrooms;
});
let data = {
  classrooms: classrooms, //.slice(0,this.props.classrooms.length-2),

  hours: ["09", "12", "15"],
  //hours.slice(1,hours.length-2),
  courses: events,
  dates: [1, 2, 3, 4, 5]
};
//let population = initilizePopulation(10, data)

export const printfunc = function() {
  let schedule=initilizeSchedule(data);
  console.log("--------------çalıştı2 randol initilized schedule------------", schedule);
  console.log("--------------çalıştı3 random sch fitneess------------", getFitness(schedule, []));
  /*  console.log("--------------çalıştı1 basic events------------", events);
  let schedule = initilizeSchedule(data);
  console.log("--------------çalıştı2 randol initilized schedule------------", schedule);
  console.log("--------------çalıştı3 random sch fitneess------------", getFitness(schedule, []));

  for (let i = 0; i < 28; i++) {
    let sortedSchedule=sortScheduleByConflicts(schedule)
    console.log("--çalıştı sortedSchedule 4", sortedSchedule)
     schedule=repairEvent(sortedSchedule[0],sortedSchedule,data)
    console.log("------çalıştı repaired first event",i,
    schedule)
    console.log("--------------çalıştı repaired sch fitneess------------",i,"  ", getFitness(schedule, []));
   if(getFitness(schedule, [])==1)break
    
  }
*/
};
