import _ from "lodash";
import { setConflicts } from "./Conflicts";

import {
  get_changed_Courses,
  send_changedCourses_to_server,
  getDaysBetween,
  getTimetableFirstweekBoundary
} from "./Functions";
export const getFitness = function(scheduleCourses, globalCourses) {
  // each department local conflict is computed as a 2 conflicts one for each course
  let numberOfDepartmentConflicts = setConflicts(
    scheduleCourses,
    scheduleCourses,
    "conflicts"
  );
  let numberOfGlobalConflicts = setConflicts(
    scheduleCourses,
    globalCourses,
    "universityConflicts"
  );
  //console.log("numberOfDepartmentConflicts",numberOfDepartmentConflicts)
  //console.log("numberOfGlobalConflicts",numberOfGlobalConflicts)
  numberOfGlobalConflicts += numberOfDepartmentConflicts;
  return 1 / (numberOfGlobalConflicts + 1);
};
// get array of courses as a input and return it with random classrooms and time values
// schedule is an array of courses with random assigned classroom  , starting hour and date
export const initilizeSchedule = function(data) {
  let newSchedule = _.cloneDeep(data.courses);
  newSchedule.map(course => {
    course.classrooms = [
      data.classrooms[Math.floor(Math.random() * data.classrooms.length)]
    ];
    course.startingHour = 
    new Date(2001, 1, 1,
    data.hours[
      Math.floor(Math.random() * data.hours.length)
    ].substring(0, 2), 0)
    course.eventDate =
      data.dates[Math.floor(Math.random() * data.dates.length)];
  });

  return newSchedule;
};
// population is an array of initilized schedules
export const initilizePopulation = function(size, data) {
  let schedules = [];
  for (let i = 0; i < size; i++) {
    schedules.push(initilizeSchedule(data));
  }
  return schedules;
};
export const sortPopulation = function(population, globalCourses) {
  population.sort(function(schedule1, schedule2) {
    return (
      getFitness(schedule2, globalCourses) -
      getFitness(schedule1, globalCourses)
    );
  });
  /*
population.map(schedule=>{
  console.log("schedule is ", schedule)
  console.log("getFitness", getFitness(schedule,globalCourses))
})*/
  return population;
};
// return 3 random selected schedules from paramtere population
export const getTournamentPopulation = function(population) {
  let tournamentPopulation = [];
  let TOURNAMENT_SELECTION_SIZE = 3;
  for (let i = 0; i < TOURNAMENT_SELECTION_SIZE; i++) {
    tournamentPopulation.push(
      population[Math.floor(Math.random() * population.length)]
    );
  }
  return tournamentPopulation;
};
export const getCrossoverSchedule = function(schedule1, schedule2) {
  // return schedule with mixed classes from both schedules
  let crossoverSchedule = [];
  for (let i = 0; i < schedule1.length; i++) {
    if (Math.random() > 0.5) {
      crossoverSchedule.push(schedule1[i]);
    } else crossoverSchedule.push(schedule2[i]);
  }
  return crossoverSchedule;
};
// globalCourses needed for calculating fitness
export const getCrossoverPopulation = function(population1, globalCourses) {
  let population = _.cloneDeep(population1);
  sortPopulation(population, globalCourses);
  let crossoverPopulation = [];
  // copy first schedule from sorted population
  crossoverPopulation.push(population[0]);
  let CROSSOVER_RATE = 0.5;
  // other schedules will be mixed
  // some of them same with input population schedules
  // some crossoverd from 2 schedules that selected from population

  for (let i = 1; i < population.length; i++) {
    if (CROSSOVER_RATE > Math.random()) {
      let schedule1 = sortPopulation(
        getTournamentPopulation(population),
        globalCourses
      )[0];
      let schedule2 = sortPopulation(
        getTournamentPopulation(population),
        globalCourses
      )[0];
      crossoverPopulation.push(getCrossoverSchedule(schedule1, schedule2));
    } else crossoverPopulation.push(population[i]);
  }
  return crossoverPopulation;
};

export const evolvPopulation = function(population, globalCourses, data) {
  return getMutationPopulation(
    getCrossoverPopulation(population, globalCourses),
    globalCourses,
    data
  );
};

export const getMutationPopulation = function(
  population1,
  globalCourses,
  data
) {
  let population = _.cloneDeep(population1);
  sortPopulation(population, globalCourses);
  let mutatePopulation = [];
  // sorted population
  mutatePopulation.push(population[0]);
  for (let i = 1; i < population.length; i++) {
    mutatePopulation.push(getMutationSchedule(population[i], data));
  }
  return mutatePopulation;
};
export const getMutationSchedule = function(mutateSchedule, data) {
  data.courses = mutateSchedule;
  let MUTATION_RATE = 0.2;
  let schedule = initilizeSchedule(data);
  for (let i = 1; i < mutateSchedule.length; i++) {
    if (MUTATION_RATE > Math.random()) {
      mutateSchedule[i] = mutateSchedule[i];
    } else mutateSchedule[i] = schedule[i];
  }
  return mutateSchedule;
};
