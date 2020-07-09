import { ParamListBase, RouteProp } from "@react-navigation/native"
import { NativeStackNavigationProp } from "react-native-screens/native-stack"
import { PrimaryParamList } from "../navigation/types"

export interface CommonNavigationProps {
    navigation: NativeStackNavigationProp<ParamListBase>
    route: RouteProp<PrimaryParamList, undefined>
}

export interface NavigationProps {
    navigation: NativeStackNavigationProp<ParamListBase>
}