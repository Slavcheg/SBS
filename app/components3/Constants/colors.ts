import { Appearance, StyleSheet } from "react-native"
import { lightTheme, darkTheme } from "./Themes"

const colorScheme = Appearance.getColorScheme()

const theme = colorScheme === "dark" ? darkTheme : lightTheme

export const colors = {
  ...theme,
}
