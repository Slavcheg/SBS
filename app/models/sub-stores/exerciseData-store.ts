import { types, SnapshotIn } from "mobx-state-tree"
import { firebaseFuncs } from "../../services/firebase/firebase.service"
import {
  muscleGroups,
  muscleGroupsObject,
} from "../../screens/trainer-screens/edit-program-screen/Constants/MuscleGroups"

import _ from "lodash"

const Coefs = types.model({
  glutes: types.number,
  chest: types.number,
  shoulders: types.number,
  triceps: types.number,
  back: types.number,
  rShoulders: types.number,
  quads: types.number,
  hamstrings: types.number,
  biceps: types.number,
  lats: types.number,
  abs: types.number,
  calves: types.number,
  cardio: types.number,
  forearms: types.number,
  lowBack: types.number,
  traps: types.number,
  lowTraps: types.number,
  neck: types.number,
  adductors: types.number,
  abductors: types.number,
})

export const Exercise = types.model({
  Name: types.string,
  ID: types.string,
  MainMuscleGroup: types.string,
  YouTubeLink: types.string,
  Coefs: Coefs,
})

// const Exercise_Model = types.model({
//   id: types.identifier,
//   item: Exercise,
// })

export interface IExercise extends SnapshotIn<typeof Exercise> {}
// export interface IExercise_Model extends SnapshotIn<typeof Exercise_Model> {}
export interface IExercise_Model extends SnapshotIn<typeof Exercise> {}

export const exerciseDataStoreModel = types
  .model("RootStore")
  .props({
    exercises: types.array(Exercise),
    // exercises: types.array(Exercise_Model),
    // collection: "exerciseData",
  })
  //   .actions(self => ({
  //     refreshItems(items: any) {},
  //   }))
  //   .actions(self => ({
  //     refreshItems(items) {
  //       self.exercises = items
  //     },
  //   }))
  //   .actions(self => firebaseFuncs<IExercise>(self.refreshItems, self.collection))
  //   .actions(self => ({
  //     async createProgram(_title: string) {
  //       self.addItem({
  //         Name: _title,
  //       })
  //     },
  //     async deleteProgram(id: string) {
  //       self.deleteItem(id)
  //     },
  //   }))
  .actions(self => ({
    updateAllExercises(exercises) {
      self.exercises = exercises
      //   exercises.forEach((exercise, index) => {
      //     self.exercises[index] = exercise)
      //   })
    },
  }))
  .views(self => ({
    get filteredByMuscleGroup() {
      let type = muscleGroupsObject()
      let filtered = type
      self.exercises.forEach(exercise => {
        if (!exercise.MainMuscleGroup) return
        if (!exercise.Name) return
        let newArray = filtered[exercise.MainMuscleGroup] ? filtered[exercise.MainMuscleGroup] : []

        newArray.push(exercise)
        filtered = {
          ...filtered,
          [exercise.MainMuscleGroup]: newArray,
        }
      })

      return filtered
    },
    getExerciseYouTubeLink: exerciseName => {
      let exercise = self.exercises.find(element => element.Name === exerciseName)
      return exercise.YouTubeLink
    },
    getExerciseByName: exerciseName => {
      let exercise = self.exercises.find(element => element.Name === exerciseName)
      return exercise
    },
    getExerciseVolume: exerciseWithSets => { // exerciseWithSets is what the program contains. simply 'exercise' refers to exercise in database 
    let exercise = self.exercises.find(element => element.Name === exerciseWithSets.Name)
    let volumes = {};
    for (const property in exercise.Coefs) {
      volumes[property] = exercise.Coefs[property]*exerciseWithSets.Sets.length
    }
    return volumes
    },
  })).views(self => ({
    getVolumeStrings: exerciseWithSets => {
      let volumes = self.getExerciseVolume(exerciseWithSets)

      let volumesArray = [];

      let volumesString = ""
  
      for (const property in volumes) {
        volumesArray.push({muscleName: property, value: volumes[property]})
      }

      const sortFunction = (a, b) => {
        return b.value-a.value
      }

      volumesArray.sort(sortFunction)

      for (let i=0; i<= volumesArray.length; i++)
       {
        if (volumesArray[i].value===0 || i >= 4 ) break
        let oneVolumeString = volumesArray[i].value;
        if (!Number.isInteger(volumesArray[i].value)) oneVolumeString = volumesArray[i].value.toFixed(1)
        volumesString += `${volumesArray[i].muscleName} ${oneVolumeString} `
        
        
      }


      return volumesString
    },
    getProgramVolume: (state) => {
      const {currentProgram, currentWeekIndex, currentDayIndex, currentExerciseIndex} = state;


      //get muscle groups and set volume to zero
      let programCoefs = {}
      let weeklyCoefs = [{coefs: {}}]
      let exercise = self.exercises.find(element => element.Name === 'Bench Press')
      for (const property in exercise.Coefs) {
        programCoefs[property] = 0;
      }

      //calculate all coefs
      currentProgram.Weeks[currentWeekIndex].Days.map((day, dayIndex) => {
        day.Exercises.forEach((exercise, exerciseIndex) => {
          let execiseVolumes = self.getExerciseVolume(exercise)
          for (const property in programCoefs) {
            programCoefs[property]+=execiseVolumes[property];
            if (!weeklyCoefs[dayIndex]) weeklyCoefs.push({coefs: {}})
            if (!weeklyCoefs[dayIndex].coefs[property]) weeklyCoefs[dayIndex].coefs[property]=0; //zero out value if undefined
            weeklyCoefs[dayIndex].coefs[property]+=execiseVolumes[property]
          }
        })
      })

      //reduce float numbers to 1 digit
      for (const property in programCoefs) {
        if (!Number.isInteger(programCoefs[property])) programCoefs[property] = parseFloat(programCoefs[property].toFixed(1))
        weeklyCoefs.forEach((coef, index)=> {
          if (!Number.isInteger(weeklyCoefs[index].coefs[property])) weeklyCoefs[index].coefs[property] = parseFloat(weeklyCoefs[index].coefs[property].toFixed(1))
        })
       
      }
      // console.log(weeklyCoefs[1])
      let volumeArray = []
      let i=0;
      for (const muscleName in programCoefs) {
  
        volumeArray.push({muscleName: muscleName, programVolume: programCoefs[muscleName], weeklyVolume: []})
        weeklyCoefs.forEach((week, index) => {
          volumeArray[i].weeklyVolume.push(weeklyCoefs[index].coefs[muscleName])
        })
        i++
      }

      // let sortedArray = volumeArray;

      // const sortFunction = (volumeArrayofObjects) => {
      //   volumeArrayofObjects.
      // }

      // sortedArray.sort()

      const sortFunction = (a, b) => {
        return b.programVolume-a.programVolume
      }

      volumeArray.sort(sortFunction)

      return volumeArray
    }
  }))
