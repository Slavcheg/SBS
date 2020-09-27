import { types, SnapshotIn, applySnapshot, getSnapshot } from "mobx-state-tree"
import { firebaseFuncs } from "../../services/firebase/firebase.service"
import { values } from "mobx"
import _ from "lodash"

//Това PROGRAM е само за reference, че ми помага по-лесно да си представя структурата. Долу са описани тези, които се ползват реално

const PROGRAM_DATA = {
  Name: "initial name",
  Tags: ["string"],
  Client: "Client ID",
  Trainers: ["Trainer IDs"],
  Weeks: [
    {
      Days: [
        {
          DayName: "Day 1",
          isCompleted: false,
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

const DEFAULT_SET_DATA2 = {
  Reps: 10,
  Weight: "30",
  WeightType: "pureWeight",
  Rest: 60,
}

const DEFAULT_EXERCISE_DATA2 = {
  Name: "item.Name",
  ID: "item.ID",
  Position: 1,
  isExpanded: false,
  increaseReps: 1,
  increaseWeight: 0,
  Sets: [{ ...DEFAULT_SET_DATA2 }, { ...DEFAULT_SET_DATA2 }, { ...DEFAULT_SET_DATA2 }],
}

const DEFAULT_ONE_DAY_DATA2 = {
  DayName: "Day 1",
  isCompleted: false,
  Exercises: [],
}

const DEFAULT_WEEKS_DATA2 = {
  Days: [{ ...DEFAULT_ONE_DAY_DATA2 }],
}

const EMPTY_PROGRAM_DATA2 = {
  Name: "initial name",
  Tags: [],
  Client: "No client yet",
  Trainers: ["No trainers yet"],
  isCompleted: false,
  Weeks: [
    { ...DEFAULT_WEEKS_DATA2 },
    { ...DEFAULT_WEEKS_DATA2 },
    { ...DEFAULT_WEEKS_DATA2 },
    { ...DEFAULT_WEEKS_DATA2 },
    { ...DEFAULT_WEEKS_DATA2 },
  ],
}

export interface IProgram extends SnapshotIn<typeof Program> {}
export interface IProgram_Model extends SnapshotIn<typeof Program_Model> {}

export const trainingProgramsStoreModel = types
  .model("RootStore")
  .props({
    programs: types.array(Program_Model),
    collection: "trainingPrograms",
  })
  .actions(self => ({
    refreshItems(items) {
      self.programs = items
    },
  }))
  .actions(self => firebaseFuncs<IProgram>(self.refreshItems, self.collection))
  .actions(self => ({
    async createProgram(program: any) {
      // console.log("test", values(self.programs))
      // let emptyProgram = Program
      // console.log(emptyProgram)
      self.addItem({
        ...EMPTY_PROGRAM_DATA2,
        ...program,
      })
    },
    async deleteProgram(id: string) {
      self.deleteItem(id)
    },
    async saveProgram(id: string) {
      let newProgram: any = self.programs.find(program => program.id === id)
      console.log(newProgram)
      self.updateItem(id, getSnapshot(newProgram.item))
    },
  }))
  .views(self => ({
    program(id: string) {
      let oneProgram = values(self.programs).filter(x => x.id === id)
      return oneProgram[0]
    },
    getProgramIndexByID(id: string) {
      const findProgram = element => element.id === id
      let newIndex = self.programs.findIndex(findProgram)
      return newIndex
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
  }))
