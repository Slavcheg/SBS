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
}

export const darkTheme = {
  background: "#000000",
  color0: "#A6A6A6",
  color1: "#65CCFF",
  color2: "#19FF87",
  color3: "#A17F94",
  colorYellow: "#FFD54F",
}
