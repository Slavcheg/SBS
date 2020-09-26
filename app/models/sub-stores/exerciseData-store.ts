import { types, SnapshotIn } from "mobx-state-tree"
import { firebaseFuncs } from "../../services/firebase/firebase.service"

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
