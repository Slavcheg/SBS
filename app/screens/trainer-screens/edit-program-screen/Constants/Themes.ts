import { DefaultTheme } from "react-native-paper"

export const iTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "dodgerblue",
    accent: "red",
    secondary: "green",
    third: "purple",
  },
}

export const lightTheme = {
  background: "white",
  color0: "#000000",
  color1: "#0085C8",
  color2: "#00B456",
  color3: "#805E73",
  colorYellow: "#FFC000",
  blue1: "#38BBFF",
  blue2: "#00A1F2",
  blue3: "#0085C8",
  blue_transparent: "#0085C835",
  green1: "#00E76F",
  green2: "#00B456",
  green3: "#009246",
  green_transparent: "#00924635",
  purple1: "#805E73",
  purple2: "#634959",
  purple3: "#523C4A",
  grey1: "#595959",
  grey2: "#404040",
  black: "#000000",
  transparent: function(color: string, transperancy = 25) {
    return `${this[color]}${transperancy}`
  },
}

export const darkTheme = {
  ...lightTheme,
  background: "#000000",
  color0: "#A6A6A6",
  color1: "#65CCFF",
  color2: "#19FF87",
  color3: "#A17F94",
  colorYellow: "#FFD54F",
}
