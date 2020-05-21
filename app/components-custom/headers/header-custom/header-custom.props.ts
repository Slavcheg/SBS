import { ViewStyle, TextStyle } from "react-native"
import { IconTypes } from "../../../components/icon/icons"

export interface CustomHeaderProps {
  /**
   * Main header, e.g. POWERED BY BOWSER
   */
  headerTx?: string

  /**
   * header non-i18n
   */
  headerText?: string

  /**
   *  Image/ Logo to go at the middle
   */ 
  headerLogo? : any

  /**
   * Icon that should appear on the left
   */
  leftIcon?: IconTypes | JSX.Element

  /**
   * What happens when you press the left icon
   */
  onLeftPress?(): void

  /**
   * Icon that should appear on the right
   */
  rightIcon?: IconTypes | JSX.Element

  /**
   * What happens when you press the right icon
   */
  onRightPress?(): void

  /**
   * Container style overrides.
   */
  style?: ViewStyle

  /**
   * Title style overrides.
   */
  titleStyle?: TextStyle
}
