import { StyleSheet, Text, View, ImageBackground, Image } from 'react-native';
import { spacing, color } from '../../../theme';

export const regStyles = StyleSheet.create({
    inputContainerStyle: {
      backgroundColor: '#F4F8FB',
      marginTop: spacing[4],
      paddingLeft: spacing[4],
      borderBottomColor: '#F4F8FB',
      borderRadius: 4,
      // marginLeft: 0,
      // marginRight: 0,
      marginHorizontal: spacing[3]
    },
    inputTextStyle: {
      fontSize: 12,
      opacity: 0.5
    }
  })