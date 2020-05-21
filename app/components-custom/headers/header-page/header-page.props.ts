import { ViewStyle } from "react-native";

export interface PageHeaderProps {
    /**
     * Picks up the navigation variable from parent.
     */
    navigation: any

    /**
     * Container style overrides.
     */
    style?: ViewStyle

     /**
     * Title of the page
     */
    title?: string
}