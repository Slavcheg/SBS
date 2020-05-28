import * as React from "react"
import { View, ViewStyle, TextStyle } from "react-native"
import { CustomHeaderProps } from "./header-custom.props"
import { Icon } from "../../../components/icon/icon"
import { Button } from "../../../components/button/button"
import { Text } from "../../../components/text/text"
import { translate } from "../../../i18n"
import { IconTypes } from "../../../components/icon/icons"
import { border_boxes } from "../../../global-helper"

// static styles
const ROOT: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-start",
  width: '100%'
}
const TITLE: TextStyle = { textAlign: "center" }
const TITLE_MIDDLE: ViewStyle = { flex: 1, justifyContent: "center", alignItems: 'center' }
const LEFT: ViewStyle = { width: 32 }
const RIGHT: ViewStyle = { width: 32 }

/**
 * Header that appears on many screens. Will hold navigation buttons and screen title.
 */
export const CustomHeader: React.FunctionComponent<CustomHeaderProps> = props => {
  let {
    onLeftPress,
    onRightPress,
    rightIcon,
    leftIcon,
    headerLogo,
    headerText,
    headerTx,
    style,
    titleStyle,
  } = props
  const header = headerLogo || headerText || (headerTx && translate(headerTx)) || ""

leftIcon = makeIconClickable(leftIcon, onLeftPress, LEFT)
rightIcon = makeIconClickable(rightIcon, onRightPress, RIGHT)

return (
      <View
        style={[
          { ...ROOT, ...style }
        ]}
      >        
        {leftIcon}
        
        <View style={[
                TITLE_MIDDLE
              ]}
        >
          {
            headerLogo ? headerLogo
              : <Text style={{ ...TITLE, ...titleStyle }} text={header} />
          }
        </View>

        {rightIcon}

      </View>
  )
}

function makeIconClickable(icon: IconTypes | JSX.Element, onClick, style) {

  switch(typeof icon){
    case 'string': {
      icon =  <Button preset="link" style={border_boxes().orange} onPress={onClick}>
                {/* <Icon icon={icon} /> */}
              </Button>
      break;
    }
    case 'object': {
      icon =  <Button preset="link" onPress={onClick}>
                {icon}
              </Button>
      break;
    }
    default: {
      icon = <View style={[style]} />
      break;
    }
  }  

  return icon
}
