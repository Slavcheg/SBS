import _ from "lodash"
import { isInteger } from "validate.js"
import { ActivityCalculatorQuestionsAndAnswers, PointsToActivityRatio, QuestionaireIDs } from "../Constants/questionaires"

type T_answer = {
  answerString: string
  points: number
}

export type T_activity_question = {
  question: string
  answers: T_answer[]
}

// export type T_activity_QnA = {
//   answerIndex: number
// }

export type T_Activity_calculator = {
  answers: number[]
  activityCoef: number
  questionsID: string
}

export const Questionaires = [
  {
    QuestionsAndAnswers: [...ActivityCalculatorQuestionsAndAnswers],
    questionaireID: QuestionaireIDs[0],
    PointsToActivityRatio: { ...PointsToActivityRatio },
  },
]

const getEmptyAnswersArray = QnA_ID => {
  const nullAnswers = []
  const questionaire = Questionaires.find(que => que.questionaireID === QnA_ID)
  questionaire.QuestionsAndAnswers.forEach(que => {
    nullAnswers.push(null)
  })
  return nullAnswers
}

const DEFAULT_ACTIVITY_CALCULATION: T_Activity_calculator = {
  answers: getEmptyAnswersArray(QuestionaireIDs[0]),
  activityCoef: null,
  questionsID: QuestionaireIDs[0],
}

const getActivityCoef = (QnA_ID: string, answers: number[]): number => {
  let points = 0
  const questionaire = Questionaires.find(que => que.questionaireID === QnA_ID)

  questionaire.QuestionsAndAnswers.forEach((question, qIndex) => {
    const answerIndex = answers[qIndex]
    if (isInteger(answers[qIndex])) {
      points += question.answers[answerIndex].points
    }
  })

  return questionaire.PointsToActivityRatio[points]
}

export const DEFAULT_ACTIVITY_ElEMENTS = {
  DEFAULT_ELEMENTS: (): T_Activity_calculator => _.cloneDeep(DEFAULT_ACTIVITY_CALCULATION), //just testing
  getActivityCoef: (answers: number[]) => getActivityCoef(DEFAULT_ACTIVITY_CALCULATION.questionsID, answers),
}
