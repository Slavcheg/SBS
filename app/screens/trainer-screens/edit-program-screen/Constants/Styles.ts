import {DefaultTheme} from 'react-native-paper';
import {StyleSheet, Dimensions} from 'react-native';
import iTheme from './Themes';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const size1 = 20;
const size2 = 12;

const iStyles = StyleSheet.create({
  defaultText: {
    fontSize: 20,
    color: 'black',
  },
  greyText: {
    fontSize: size1,
    color: 'grey',
  },
  selectedText: {
    fontSize: 22,
    color: iTheme.colors.primary,
  },
  bottomButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  oneButtonWrapper: {
    marginHorizontal: 0.5,
    marginVertical: 1,
  },
  exerciseHeader: {
    // fontFamily: 'Oswald-Regular',
    fontSize: 20,
    color: 'blue',
  },
  exerciseText: {
    // fontFamily: 'Oswald-Regular',
    fontSize: 15,
  },
  exerciseNormalText: {
    fontSize: 15,
  },
  exercisePropContainer: {
    flexDirection: 'row',
  },
  screenViewWrapper: {
    backgroundColor: 'white',
    flex: 1,
    // alignItems: 'center',
  },
  text1: {
    fontSize: size1,
    color: iTheme.colors.primary,
  },
  text2: {
    fontSize: size1,
    color: iTheme.colors.secondary,
  },
  text3: {
    fontSize: size1,
    color: iTheme.colors.third,
  },
  smallImputBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    // width: 50,
    // borderWidth: 2,
  },
  smallerOutlineOverInputBox: {
    borderWidth: 1,
    borderColor: iTheme.colors.primary,
    width: '95%',
    height: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 20,
    borderRadius: 10,
    marginHorizontal: 1,
  },
  mediumRoundIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
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
    color: iTheme.colors.primary,
  },
  text2Small: {
    fontSize: size2,
    color: iTheme.colors.secondary,
  },
  text3Small: {
    fontSize: size2,
    color: iTheme.colors.third,
},  greyTextSmall: {
  fontSize: size2,
  color: 'grey',
},

})

export default iStyles;
