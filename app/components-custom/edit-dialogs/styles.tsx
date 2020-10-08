import { StyleSheet } from "react-native";
import { color, spacing } from "../../theme";

export const styles = StyleSheet.create({
    rowSpace: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    inputContainerStyle: {
        backgroundColor: color.palette.grey_sbs,
        paddingLeft: spacing[4],
        borderBottomColor: color.palette.grey_sbs,
        borderRadius: 4,
    },
    inputTextStyle: {
        fontSize: 12,
        opacity: 0.5
    },
})