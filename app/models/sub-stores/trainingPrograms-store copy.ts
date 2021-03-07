export const TRAINING_PROGRAMS_COLLECTION = "trainingPrograms"
export const USERS_COLLECTION = "users2"
import { return_todays_datestamp } from "../../global-helper"

import { types, SnapshotIn, applySnapshot, getSnapshot } from "mobx-state-tree"
import { firebaseFuncs } from "../../services/firebase/firebase.service"
import { values } from "mobx"
import _ from "lodash"

//Това PROGRAM_DATA е само за reference, че ми помага по-лесно да си представя структурата. Долу са описани тези, които се ползват реално

const PROGRAM_DATA = {
  Name: "initial name",
  Tags: ["string"],
  Client: "Client ID",
  Trainers: ["Trainer IDs"],
  isCompleted: false,
  Weeks: [
    {
      Days: [
        {
          DayName: "Day 1",
          isCompleted: false,
          completedOn: return_todays_datestamp(),
          Exercises: [
            {
              Name: "item.Name",
              ID: "item.ID",
              Position: 1,
              isExpanded: false,
              increaseReps: 1,
              increaseWeight: 0,
              Sets: [
                {
                  Reps: 10,
                  Weight: "30",
                  WeightType: "pureWeight",
                  Rest: 60,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

const DEFAULT_SET_DATA = types.model({
  Reps: 10,
  Weight: "30",
  WeightType: "pureWeight",
  Rest: 60,
})

const DEFAULT_EXERCISE_DATA = types.model({
  Name: "item.Name",
  ID: "item.ID",
  Position: 1,
  isExpanded: false,
  increaseReps: 1,
  increaseWeight: 0,
  Sets: types.optional(types.array(DEFAULT_SET_DATA), [
    { ...DEFAULT_SET_DATA },
    { ...DEFAULT_SET_DATA },
    { ...DEFAULT_SET_DATA },
  ]),
})

const DEFAULT_ONE_DAY_DATA = types.model({
  DayName: "Day 1",
  isCompleted: false,
  completedOn: types.optional(
    types.union(types.number, types.string, types.undefined),
    return_todays_datestamp(),
  ),
  Exercises: types.optional(types.array(DEFAULT_EXERCISE_DATA), []),
})

const DEFAULT_WEEKS_DATA = types.model({
  Days: types.optional(types.array(DEFAULT_ONE_DAY_DATA), [{ ...DEFAULT_ONE_DAY_DATA }]),
})

export const Program = types.model({
  Name: "",
  Tags: types.optional(types.array(types.string), []),
  Trainers: types.optional(types.array(types.string), []),
  Client: types.string,
  isCompleted: false,
  Weeks: types.optional(types.array(DEFAULT_WEEKS_DATA), [
    { ...DEFAULT_WEEKS_DATA },
    { ...DEFAULT_WEEKS_DATA },
    { ...DEFAULT_WEEKS_DATA },
    { ...DEFAULT_WEEKS_DATA },
    { ...DEFAULT_WEEKS_DATA },
  ]),
})

const Program_Model = types.model({
  id: types.identifier,
  item: Program,
})

//// описваме втори път стойностите, че да ни е точно засега

export const DEFAULT_SET_DATA2 = {
  Reps: 10,
  Weight: "30",
  WeightType: "pureWeight",
  Rest: 60,
}

export const DEFAULT_EXERCISE_DATA2 = {
  Name: "item.Name",
  ID: "item.ID",
  Position: 1,
  isExpanded: false,
  increaseReps: 1,
  increaseWeight: 0,
  Sets: [{ ...DEFAULT_SET_DATA2 }, { ...DEFAULT_SET_DATA2 }, { ...DEFAULT_SET_DATA2 }],
}

export const DEFAULT_ONE_DAY_DATA2 = {
  DayName: "Day 1",
  isCompleted: false,
  completedOn: return_todays_datestamp(),
  Exercises: [],
}

export const DEFAULT_WEEKS_DATA2 = {
  Days: [{ ...DEFAULT_ONE_DAY_DATA2 }],
}

export const EMPTY_PROGRAM_DATA2 = {
  Name: "initial name",
  Tags: [""],
  Client: "No client yet",
  Trainers: ["No trainers yet"],
  isCompleted: false,
  Weeks: [
    _.cloneDeep(DEFAULT_WEEKS_DATA2),
    _.cloneDeep(DEFAULT_WEEKS_DATA2),
    _.cloneDeep(DEFAULT_WEEKS_DATA2),
    _.cloneDeep(DEFAULT_WEEKS_DATA2),
    _.cloneDeep(DEFAULT_WEEKS_DATA2),
  ],
}

export interface IProgram extends SnapshotIn<typeof Program> {}
export interface IProgram_Model extends SnapshotIn<typeof Program_Model> {}

export type state = {
  currentProgram: any
  currentProgramID: string
  currentWeekIndex: number
  currentDayIndex: number
  currentExerciseIndex: number
  locked?: boolean
  deselectAllDays?: boolean
  isReordering?: boolean
}

export const trainingProgramsStoreModel = types
  .model("RootStore")
  .props({
    programs: types.array(Program_Model),
    collection: TRAINING_PROGRAMS_COLLECTION,
  })
  .actions(self => ({
    refreshItems(items) {
      self.programs = items
    },
  }))
  .actions(self => firebaseFuncs<IProgram>(self.refreshItems, self.collection))
  .actions(self => ({
    async createProgram(program: any) {
      self.addItem({
        ...EMPTY_PROGRAM_DATA2,
        ...program,
      })
    },
    deleteProgram(id: string) {
      self.deleteItem(id)
    },
  }))
  .views(self => ({
    program(id: string) {
      self.programs.forEach(program => console.log(program.id))
      let oneProgram = values(self.programs).filter(x => x.id === id)
      return oneProgram[0]
    },
    programSnapshot(id: string) {
      return getSnapshot(self).programs.find(x => x.id === id).item
    },
    getProgramIndexByID(id: string) {
      const findProgram = element => element.id === id
      let newIndex = self.programs.findIndex(findProgram)
      return newIndex
    },
    trainersPrograms(trainerID: string) {
      return self.programs.filter(program => program.item.Trainers.includes(trainerID))
    },
  }))
  .actions(self => ({
    addExercise(programID: string, state: any, exercise: object) {
      const { currentWeekIndex, currentDayIndex } = state
      let newDayData = {
        ...self.programs[self.getProgramIndexByID(programID)].item.Weeks[currentWeekIndex].Days[
          currentDayIndex
        ],
      }
      newDayData.Exercises.push({
        ...DEFAULT_EXERCISE_DATA2,
        Name: exercise.Name,
        ID: exercise.ID,
        Position: Math.floor(newDayData.Exercises.length / 2 + 1),
      })
      applySnapshot(
        self.programs[self.getProgramIndexByID(programID)].item.Weeks[currentWeekIndex].Days[
          currentDayIndex
        ],
        { ...newDayData },
      )
    },
    changeProgramName(programID: string, newName: string) {
      self.programs[self.getProgramIndexByID(programID)].item.Name = newName
    },
    addNewDay(programID, weekIndex, dayIndex) {
      let newWeekData = {
        ...self.programs[self.getProgramIndexByID(programID)].item.Weeks[weekIndex],
      }

      let newDayName = `Day ${newWeekData.Days.length + 1}`
      newWeekData.Days.push({ ...DEFAULT_ONE_DAY_DATA2, DayName: newDayName })
      applySnapshot(self.programs[self.getProgramIndexByID(programID)].item.Weeks[weekIndex], {
        ...newWeekData,
      })
    },
    removeDay(programID, weekIndex, dayIndex) {
      const helperDays =
        self.programs[self.getProgramIndexByID(programID)].item.Weeks[weekIndex].Days

      helperDays.splice(dayIndex, 1)
      helperDays.forEach((day, index) => {})
      applySnapshot(
        self.programs[self.getProgramIndexByID(programID)].item.Weeks[weekIndex].Days,
        helperDays,
      )
    },
    async saveProgram(id: string, program: any) {
      applySnapshot(self.programs[self.getProgramIndexByID(id)].item, _.cloneDeep(program))
      self.updateItem(id, getSnapshot(self.programs[self.getProgramIndexByID(id)].item))
    },
  }))
