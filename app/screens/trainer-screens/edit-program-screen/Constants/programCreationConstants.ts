const MAX_SETS_NUMBER = 12 //actual numbers we need to change. We use array of elements in the programs instead
const MAX_REPS_NUMBER = 50 //actual numbers we need to change. We use array of elements in the programs instead
const MAX_WEIGHT_NUMBER = 300

import _ from "lodash"
import { NO_CLIENT_YET } from "./DatabaseConstants"
import * as dateHelpers from "../../../../global-helper/global-date-helper/global-date-helper"
// to use Picker component properly we need an array of elements. We create these arrays by getMAX function
const getMAX = (maxNumber: number, toString = false) => {
  let newArray = []
  // if (toString === true)
  //   for (let i = 1; i <= maxNumber; i++) newArray.push(i.toString());
  // else
  for (let i = 1; i <= maxNumber; i++) newArray.push(i)
  return newArray
}

export const MAX_SETS: number[] = getMAX(MAX_SETS_NUMBER)
export const MAX_REPS: number[] = getMAX(MAX_REPS_NUMBER)
export const MAX_WEIGHT: number[] = getMAX(MAX_WEIGHT_NUMBER)

export const DEFAULT_SET_DATA = {
  Reps: 10,
  Weight: 30,
  WeightType: "pureWeight",
  Rest: 60,
}

export const DEFAULT_EXERCISE_DATA = {
  Name: "item.Name", //При вписване добавяй
  ID: "item.ID", //При вписване добавяй твои
  Position: 1,
  isExpanded: false,
  increaseReps: 1,
  increaseWeight: 0,
  Sets: [
    { ..._.cloneDeep(DEFAULT_SET_DATA) },
    { ..._.cloneDeep(DEFAULT_SET_DATA) },
    { ..._.cloneDeep(DEFAULT_SET_DATA) },
  ],
}

export const DEFAULT_ONE_DAY_DATA = {
  DayName: "Day 1",
  isCompleted: false,
  Exercises: [],
}

export const DEFAULT_WEEKS_DATA = { Days: [{ ..._.cloneDeep(DEFAULT_ONE_DAY_DATA) }] }

export const getEMPTY_PROGRAM = () => {
  const program = {
    Name: "initial name",
    ID: "initial ID, change to doc id",
    Tags: [],
    ClientID: NO_CLIENT_YET,
    Trainers: ["No trainers yet"],
    isCompleted: false,
    Weeks: [..._.cloneDeep(DEFAULT_WEEKS_DATA)],
  }
  for (let i = 0; i < 5; i++) program.Weeks.push(_.cloneDeep(DEFAULT_WEEKS_DATA))

  return program
}

const PROGRAM = {
  Name: "initial name",
  ID: "initial ID, change to doc id",
  Tags: ["string"],
  ClientID: "Client ID",
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
export const DEFAULT_ONE_DAY_DATA2 = {
  DayName: "Day 1",
  isCompleted: false,
  completedOn: dateHelpers.return_todays_datestamp(),
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
