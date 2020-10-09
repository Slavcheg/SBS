import iStyles from "../Constants/Styles"

export const getVideoID = originalLink => {
  let newVideoID = originalLink
  let newVideo2 = originalLink

  newVideoID.includes("www.youtube.com")
    ? (newVideoID = newVideoID.substring(32, 43))
    : (newVideoID = newVideoID.substring(17, 28))
  console.log(originalLink)

  return newVideoID
}

export const getVideoTime = originalLink => {
  let newVideoID = originalLink
  let videoTime = 0

  newVideoID.includes("?t=") ? (newVideoID = newVideoID.substring(31, 35)) : (newVideoID = 0)

  videoTime = parseInt(newVideoID)

  console.log(videoTime)

  return videoTime
}

export function getColorByExercisePosition(position) {
  let color1 = iStyles.text2.color
  let color2 = iStyles.text1.color
  let color3 = iStyles.text3.color

  switch (position) {
    case 1: {
      return color1
    }
    case 2: {
      return color2
    }
    case 3: {
      return color3
    }
    case 4: {
      return color1
    }
    case 5: {
      return color2
    }
    case 6: {
      return color3
    }
    case 7: {
      return color1
    }
    case 8: {
      return color2
    }
    case 9: {
      return color3
    }

    default: {
      return color1
    }
  }
}
