// const getExerciseDB = async (onDownload: Function) => {
//   const JSON_SHEET_ID =
//     "https://spreadsheets.google.com/feeds/cells/10p7fr48q1AUOwndsZkmvv-ExkJKcD3SqsSmtwsOc4NE/od6/public/basic?alt=json"

//   let data

//   fetch(JSON_SHEET_ID)
//     .then(response => response.json())
//     .then(json => (data = json.feed.entry))
//     .catch(error => console.error(error))
//     .finally(() => {
//       let newFalseDB = []
//       let colA = [] //Exercise Name
//       let colB = [] //MainMuscleGroup
//       let colC = [] //YouTubeLink
//       let colF = [] //glutes
//       let colG = [] //chest
//       let colH = [] //shoulders
//       let colI = [] //triceps
//       let colJ = [] //back
//       let colK = [] //rear shoulders
//       let colL = [] //quads
//       let colM = [] //hamstrings
//       let colN = [] //biceps
//       let colO = [] //lats
//       let colP = [] //abs
//       let colQ = [] //calves
//       let colR = [] //cardio
//       let colS = [] //forearms
//       let colT = [] //lower back
//       let colU = [] //traps
//       let colV = [] //low traps
//       let colW = [] //neck
//       let colX = [] //adductors
//       let colY = [] //abductors

//       data.forEach((entry, index) => {
//         let title = entry.title.$t.replace(/[0-9]/g, "") //remove numbers from title
//         let number = entry.title.$t.replace(/\D/g, "") //remove letters from title
//         let content = entry.content.$t

//         //ръчно проверяваме всяка клетка в базата данни отдясно на въведеното име. ако се правят размествания на колоните трябва да се внимава, съответно

//         if (title === "A") colA[number] = content
//         if (title === "B") colB[number] = content
//         if (title === "C") colC[number] = content
//         if (title === "F") colF[number] = content
//         if (title === "G") colG[number] = content
//         if (title === "H") colH[number] = content
//         if (title === "I") colI[number] = content
//         if (title === "J") colJ[number] = content
//         if (title === "K") colK[number] = content
//         if (title === "L") colL[number] = content
//         if (title === "M") colM[number] = content
//         if (title === "N") colN[number] = content
//         if (title === "O") colO[number] = content
//         if (title === "P") colP[number] = content
//         if (title === "Q") colQ[number] = content
//         if (title === "R") colR[number] = content
//         if (title === "S") colS[number] = content
//         if (title === "T") colT[number] = content
//         if (title === "U") colU[number] = content
//         if (title === "V") colV[number] = content
//         if (title === "W") colW[number] = content
//         if (title === "X") colX[number] = content
//         if (title === "Y") colY[number] = content
//       })

//       colA.forEach((exerciseName, index) => {
//         newFalseDB.push({
//           Name: exerciseName,
//           ID: Math.random().toString(25),
//           MainMuscleGroup: colB[index] ? colB[index] : "No group",
//           YouTubeLink: colC[index] ? colC[index] : "No link",
//           Coefs: {
//             glutes: colF[index] ? parseFloat(colF[index]) : 0,
//             chest: colG[index] ? parseFloat(colG[index]) : 0,
//             shoulders: colH[index] ? parseFloat(colH[index]) : 0,
//             triceps: colI[index] ? parseFloat(colI[index]) : 0,
//             back: colJ[index] ? parseFloat(colJ[index]) : 0,
//             rShoulders: colK[index] ? parseFloat(colK[index]) : 0,
//             quads: colL[index] ? parseFloat(colL[index]) : 0,
//             hamstrings: colM[index] ? parseFloat(colM[index]) : 0,
//             biceps: colN[index] ? parseFloat(colN[index]) : 0,
//             lats: colO[index] ? parseFloat(colO[index]) : 0,
//             abs: colP[index] ? parseFloat(colP[index]) : 0,
//             calves: colQ[index] ? parseFloat(colQ[index]) : 0,
//             cardio: colR[index] ? parseFloat(colR[index]) : 0,
//             forearms: colS[index] ? parseFloat(colS[index]) : 0,
//             lowBack: colT[index] ? parseFloat(colT[index]) : 0,
//             traps: colU[index] ? parseFloat(colU[index]) : 0,
//             lowTraps: colV[index] ? parseFloat(colV[index]) : 0,
//             neck: colW[index] ? parseFloat(colW[index]) : 0,
//             adductors: colX[index] ? parseFloat(colX[index]) : 0,
//             abductors: colY[index] ? parseFloat(colY[index]) : 0,
//           },
//         })
//       })
//       onDownload(newFalseDB)
//     })
// }

// const getExerciseDB = async (onDownload: Function) => {

//   let downloadedExerciseDB = []
//   await firestore()
//     .collection("exerciseData")
//     .get()
//     .then(items => {
//       items.forEach(item => {
//         downloadedExerciseDB.push(item.data())
//       })
//       // console.log(downloadedExerciseDB.length, downloadedExerciseDB[0])
//       onDownload(downloadedExerciseDB)
//     })
// }
