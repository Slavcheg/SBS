import { ViewStyle } from "react-native";

export interface MainHeaderProps {
    /**
     * Picks up the navigation variable from parent.
     */
    navigation: any

    /**
     * Container style overrides.
     */
    style?: ViewStyle
}