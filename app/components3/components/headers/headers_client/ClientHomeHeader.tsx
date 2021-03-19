import React from "react"
import { DefaultHeader } from "../DefaultHeader"
import { icons, colors } from "../../../../components3"

type HeaderProps = {
  onPressBack?: any
  onPressRight?: any
}

export const Header_ClientHome: React.FC<HeaderProps> = props => {
  return (
    <DefaultHeader
      onPressLeft={props.onPressBack}
      onPressRight={props.onPressRight}
      mainText={`Здравей!`}
      iconLeft={icons.logout}
      iconRight={icons.calendar}
    />
  )
}
// export const Header_ClientHome = props => {
//   const width = useWindowDimensions().width
//   return (
//     <View
//       style={{
//         flexDirection: "row",
//         backgroundColor: colors.blue3,
//         width: width,
//         justifyContent: "space-between",
//       }}
//     >
//       <BackButton onPress={props.onPressBack} mode="text" color="white" />
//       <Text style={{ fontSize: 20, color: "white", fontFamily: fonts.optimum.bold }}>
//         Редактиране на програма
//       </Text>
//       <MenuButton onPress={props.onPressMenu} mode="text" color="white" />
//     </View>
//   )
// }
