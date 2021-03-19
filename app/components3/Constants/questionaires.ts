import { T_activity_question } from "../types/activityMeasurementQuestions"

export const QuestionaireIDs = ["LeighPeele_Fat_Loss_Troubleshooter_go_buy_it"]

export const ActivityCalculatorQuestionsAndAnswers: T_activity_question[] = [
  {
    question: "1. Започвам деня си със:",
    answers: [
      { answerString: "А: Доспиване/дрямка", points: 1 },
      { answerString: "Б: Бързо кафенце и обличане", points: 2 },
      { answerString: "В: Дълго оправяне за деня и закуска вкъщи", points: 3 },
      { answerString: "Г: Сутрeшна разходка или тичане", points: 4 },
      { answerString: "Д: Силова и аеробна тренировка", points: 5 },
    ],
  },
  {
    question: "2. Ходя до работа със:",
    answers: [
      { answerString: "А: Работя вкъщи", points: 1 },
      { answerString: "Б: Ходя с колата и използвам асансьори", points: 2 },
      { answerString: "В: Ходя с колата и се старая да паркирам по-далече или изкачвам стълби", points: 3 },
      { answerString: "Г: Работата ми е достатъчно близо и ходя пеша", points: 4 },
      { answerString: "Д: Работата ми е далече, но ходя или карам колело до там", points: 5 },
    ],
  },
  {
    question: "3. Работата ми представлява:",
    answers: [
      { answerString: "А: Работя вкъщи и седя на компютър по цял ден", points: 1 },
      { answerString: "Б: Седя на бюро/компютър по цял ден", points: 2 },
      {
        answerString: "В: Напред назад съм през по-голямата част от деня, понякога сядам за малко",
        points: 3,
      },
      { answerString: "Г: Почти не сядам, на крак съм постоянно", points: 4 },
      {
        answerString: "Д: Движа се през цялото време, работата ми е много физически натоварваща",
        points: 5,
      },
    ],
  },
  {
    question: "4. Физически работата ми я оценявам като:",
    answers: [
      { answerString: "А: 1-2 (работа вкъщи, в офис)", points: 1 },
      { answerString: "Б: 3-4 (козметик, фризьор)", points: 2 },
      { answerString: "В: 5-6 (касиер в голям магазин)", points: 3 },
      { answerString: "Г: 7-8 (сервитьор, камериер)", points: 4 },
      { answerString: "Д: 9-10 (атлет съм)", points: 5 },
    ],
  },
  {
    question: "5. След работа:",
    answers: [
      { answerString: "А: Вече съм си вкъщи", points: 1 },
      {
        answerString: "Б: Прибирам се с колата директно вкъщи или минавам да си взема нещо за хапване",
        points: 2,
      },
      { answerString: "В: Върша задачки за по-дълъг период от време", points: 3 },
      { answerString: "Г: Тренирам в залата или тренирам вкъщи", points: 4 },
      { answerString: "Д: Ходя на втората си работа/тренирам повече от час", points: 5 },
    ],
  },
  {
    question: "6. Тренирам:",
    answers: [
      { answerString: "А: Никога", points: 1 },
      { answerString: "Б: 1-3 пъти седмично, леко", points: 2 },
      {
        answerString: "В: 3-5 пъти седмично, със средна интензивност (силова тренировка)",
        points: 3,
      },
      {
        answerString: "Г: 3-5 пъти седмично с висока интензивност (силово и аеробно/анаеробно)",
        points: 4,
      },
      { answerString: "Д: 5-7 пъти седмично с висока интензивност", points: 5 },
    ],
  },
  {
    question: "7. Вечер:",
    answers: [
      { answerString: "А: Лежа или гледам телевизия", points: 1 },
      { answerString: "Б: Гледам телевизия, но сам си готвя вечерята", points: 2 },
      { answerString: "В: Излизам с приятели", points: 3 },
      { answerString: "Г: Тренирам и си готвя вечеря", points: 4 },
      { answerString: "Д. Продължавам да работя", points: 5 },
    ],
  },
  {
    question: "8. Спя по:",
    answers: [
      { answerString: "А: 10+ часа", points: 1 },
      { answerString: "Б: 8-10 часа", points: 2 },
      { answerString: "В: 6-8 часа", points: 3 },
      { answerString: "Г: 4-6 часа", points: 4 },
      { answerString: "Д: По-малко от 4 часа на нощ", points: 5 },
    ],
  },
  {
    question: "9. Когато тренирам:",
    answers: [
      { answerString: "А: Правя малко ходене на пътеката и се разтягам", points: 1 },
      { answerString: "Б: Ходя бързо или ходя много и правя няколко упражнения", points: 2 },
      { answerString: "В: Силова тренировка и евентуално малко кардио", points: 3 },
      { answerString: "Г: Много интензивни силови и кардио тренировки", points: 4 },
      { answerString: "Д: Тренирам с часове, атлет съм", points: 5 },
    ],
  },
  {
    question: "10. Събота и неделя:",
    answers: [
      { answerString: "А: Наваксвам си с телевизията и компютърните игри и си почивам", points: 1 },
      { answerString: "Б: Основно седя, малко домакинска работа, готвя хапване", points: 2 },
      { answerString: "В: Ходя на разходка с приятели или спортувам", points: 3 },
      { answerString: "Г: Участвам в организирани аеробни и силови тренировки", points: 4 },
      { answerString: "Д: Тренирам с часове, атлет съм", points: 5 },
    ],
  },
]

export const PointsToActivityRatio = {
  10: 1.1,
  11: 1.12,
  12: 1.14,
  13: 1.16,
  14: 1.18,
  15: 1.2,
  16: 1.3,
  17: 1.311,
  18: 1.322,
  19: 1.33,
  20: 1.34,
  21: 1.36,
  22: 1.37,
  23: 1.375,
  24: 1.38,
  25: 1.39,
  26: 1.4,
  27: 1.43,
  28: 1.46,
  29: 1.49,
  30: 1.51,
  31: 1.54,
  32: 1.57,
  33: 1.6,
  34: 1.61,
  35: 1.63,
  36: 1.65,
  37: 1.68,
  38: 1.7,
  39: 1.73,
  40: 1.75,
  41: 1.78,
  42: 1.8,
  43: 1.81,
  44: 1.83,
  45: 1.84,
  46: 1.85,
  47: 1.86,
  48: 1.88,
  49: 1.89,
  50: 1.9,
}
