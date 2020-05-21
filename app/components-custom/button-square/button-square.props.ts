import { ViewStyle } from "react-native"
import { IconTypes } from "../../assets"

export interface ButtonSquareProps {
    style?: ViewStyle,
    title?: string,
    onPress?(): void,
    leftIcon?: IconTypes,
    rightIcon?: IconTypes
}