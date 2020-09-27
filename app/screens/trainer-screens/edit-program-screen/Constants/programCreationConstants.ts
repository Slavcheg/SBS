const MAX_SETS_NUMBER = 12; //actual numbers we need to change. We use array of elements in the programs instead
const MAX_REPS_NUMBER = 30; //actual numbers we need to change. We use array of elements in the programs instead
const MAX_WEIGHT_NUMBER = 100;

// to use Picker component properly we need an array of elements. We create these arrays by getMAX function
const getMAX = (maxNumber: number, toString = false) => {
  let newArray = [];
  // if (toString === true)
  //   for (let i = 1; i <= maxNumber; i++) newArray.push(i.toString());
  // else
  for (let i = 1; i <= maxNumber; i++) newArray.push(i);
  return newArray;
};

export const MAX_SETS: number[] = getMAX(MAX_SETS_NUMBER);
export const MAX_REPS: number[] = getMAX(MAX_REPS_NUMBER);
export const MAX_WEIGHT: number[] = getMAX(MAX_WEIGHT_NUMBER);

export const DEFAULT_SET_DATA = {
  Reps: 10,
  Weight: 30,
  WeightType: 'pureWeight',
  Rest: 60,
};

export const DEFAULT_EXERCISE_DATA = {
  Name: 'item.Name', //При вписване добавяй
  ID: 'item.ID', //При вписване добавяй твои
  Position: 1,
  isExpanded: false,
  increaseReps: 1,
  increaseWeight: 0,
  Sets: [{...DEFAULT_SET_DATA}, {...DEFAULT_SET_DATA}, {...DEFAULT_SET_DATA}],
};

export const DEFAULT_ONE_DAY_DATA = {
  DayName: 'Day 1',
  isCompleted: false,
  Exercises: [],
};

export const DEFAULT_WEEKS_DATA = {Days: [{...DEFAULT_ONE_DAY_DATA}]};

export const EMPTY_PROGRAM = {
  Name: 'initial name',
  ID: 'initial ID, change to doc id',
  Tags: [],
  ClientID: 'No client yet',
  Trainers: ['No trainers yet'],
  isCompleted: false,
  Weeks: [
    {...DEFAULT_WEEKS_DATA},
    {...DEFAULT_WEEKS_DATA},
    {...DEFAULT_WEEKS_DATA},
    {...DEFAULT_WEEKS_DATA},
    {...DEFAULT_WEEKS_DATA},
  ],
};

const PROGRAM = {
  Name: 'initial name',
  ID: 'initial ID, change to doc id',
  Tags: ['string'],
  ClientID: 'Client ID',
  Trainers: ['Trainer IDs'],
  Weeks: [
    {
      Days: [
        {
          DayName: 'Day 1',
          isCompleted: false,
          Exercises: [
            {
              Name: 'item.Name',
              ID: 'item.ID',
              Position: 1,
              isExpanded: false,
              increaseReps: 1,
              increaseWeight: 0,
              Sets: [
                {
                  Reps: 10,
                  Weight: '30',
                  WeightType: 'pureWeight',
                  Rest: 60,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
