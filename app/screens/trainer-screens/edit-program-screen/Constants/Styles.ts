import { DefaultTheme } from "react-native-paper"
import { StyleSheet, Dimensions, Appearance } from "react-native"
import { iTheme, lightTheme, darkTheme } from "./Themes"

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height
const colorScheme = Appearance.getColorScheme()

const size1 = 20
const size2 = 12

const iStyles = StyleSheet.create({
  defaultText: {
    fontSize: 20,
    color: colorScheme === "dark" ? darkTheme.color0 : lightTheme.color0,
  },
  greyText: {
    fontSize: size1,
    color: "grey",
  },
  selectedText: {
    fontSize: 22,
    color: colorScheme === "dark" ? darkTheme.color1 : lightTheme.color1,
  },
  bottomButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  oneButtonWrapper: {
    marginHorizontal: 0.5,
    marginVertical: 1,
  },
  exerciseHeader: {
    // fontFamily: 'Oswald-Regular',
    fontSize: 20,
    color: "blue",
  },
  exerciseText: {
    // fontFamily: 'Oswald-Regular',
    fontSize: 15,
  },
  exerciseNormalText: {
    fontSize: 15,
  },
  exercisePropContainer: {
    flexDirection: "row",
  },
  screenViewWrapper: {
    backgroundColor: colorScheme === "dark" ? darkTheme.background : lightTheme.background,
    flex: 1,
    // alignItems: 'center',
  },
  text1: {
    fontSize: size1,
    color: colorScheme === "dark" ? darkTheme.color1 : lightTheme.color1,
    // color: colorScheme==='dark' ? iTheme.colors.primary,
  },
  text2: {
    fontSize: size1,
    color: colorScheme === "dark" ? darkTheme.color2 : lightTheme.color2,
  },
  text3: {
    fontSize: size1,
    color: colorScheme === "dark" ? darkTheme.color3 : lightTheme.color3,
  },
  smallImputBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 60,
    // width: 50,
    // borderWidth: 2,
  },
  smallerOutlineOverInputBox: {
    borderWidth: 1,
    borderColor: colorScheme === "dark" ? darkTheme.color1 : lightTheme.color1,
    width: "95%",
    height: "80%",
    alignItems: "center",
    justifyContent: "center",
  },
  smallIcon: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginHorizontal: 1,
  },
  smallIconOld: {
    alignItems: "center",
    justifyContent: "center",
    width: 47,
    height: 20,
    borderRadius: 10,
    marginHorizontal: 1,
  },
  mediumRoundIcon: {
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    width: 35,
    height: 25,
    borderRadius: 10,
    margin: 2,
    marginHorizontal: 1,
  },
  carouselScreen: {
    flex: 1,
    width: Dimensions.get("window").width,
  },
  text1Small: {
    fontSize: size2,
    color: colorScheme === "dark" ? darkTheme.color1 : lightTheme.color1,
  },
  text2Small: {
    fontSize: size2,
    color: colorScheme === "dark" ? darkTheme.color2 : lightTheme.color2,
  },
  text3Small: {
    fontSize: size2,
    color: colorScheme === "dark" ? darkTheme.color3 : lightTheme.color3,
  },
  greyTextSmall: {
    fontSize: size2,
    color: "grey",
  },
  textYellow: {
    color: colorScheme === "dark" ? darkTheme.colorYellow : lightTheme.colorYellow,
  },
  text0: {
    color: colorScheme === "dark" ? darkTheme.color0 : lightTheme.color0,
  },
  backGround: {
    color: colorScheme === "dark" ? darkTheme.background : lightTheme.background,
  },
})

export default iStyles
