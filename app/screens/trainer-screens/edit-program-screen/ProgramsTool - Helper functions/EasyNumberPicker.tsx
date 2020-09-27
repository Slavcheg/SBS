import {Button, Portal, Modal, TextInput} from 'react-native-paper';
// import crashlytics from '@react-native-firebase/crashlytics';
import {Picker} from '@react-native-community/picker';

import React, {useState, useEffect, useReducer} from 'react';

import {
  View,
  Text,
  Button as ButtonOriginal,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Keyboard,
  ScrollView,
  Pressable,
  useWindowDimensions,
  TextInput as TextInput2,
  KeyboardAvoidingView,
  Platform,
  BackHandler,
  YellowBox,
  LogBox,
  Modal as Modal2,
  Alert,
} from 'react-native';

import {GetText} from './index';
import _ from 'lodash';

type EasyNumberPickerProps = {
  easyNumbers: number[];
  isActive?: boolean;
  currentlySelected?: number;
  onChange?: any;
  textStyle?: object;
  inactiveTextStyle?: object;
  easyMode?: string;
  onLongPressMode?: string;
  validSelection?: number[];
  convertToNumber?: boolean;
};

const PickerReducer = (state, action) => {
  switch (action.type) {
    case 'update status': {
      //to fix some bug i do not understand which breaks it sometimes. wasn't intended like that
      state.printCustom = true;
      state.customNumber = state.selected;
      break;
    }

    case 'update with custom value matching a recommended one': {
      state.printCustom = false;
      state.selected = action.value;
      state.isLongPressed = false;
      state.customNumber = action.value;
      state.isCustomPrintedSelected = false;
      state.customMatchingOriginals = true;
      break;
    }
    case 'update with custom value being unique': {
      state.printCustom = true;
      state.selected = action.value;
      state.isLongPressed = false;
      state.customNumber = action.value;
      state.isCustomPrintedSelected = true;
    }

    case 'toggle long press': {
      state.isLongPressed = !state.isLongPressed;
      break;
    }

    case 'press recommended value': {
      state.selected = action.value;
      state.isCustomPrintedSelected = false;
      break;
    }

    case 'pressed custom value': {
      state.selected = state.customNumber;
      state.isCustomPrintedSelected = true;
      break;
    }

    case 'update with text': {
      state.printCustom = true;
      let newValue = action.value;
      if (Number.isNaN(newValue)) {
        newValue = 0;
      }
      state.selected = newValue;
      state.isLongPressed = false;
      state.customNumber = state.selected;
      state.isCustomPrintedSelected = true;
      break;
    }

    default:
      throw new Error('Unexpected action in PickerReducer');
  }

  return {...state};
};

interface State {
  easyNumbers: number[];
  inactiveStyle: object;
  selected: number;
  activeStyle: object;
  printCustom: boolean;
  customNumber: number;
}

type PrintNumberProps = {
  state: State;
  number: number;
};

const PrintNumber = (props: PrintNumberProps) => {
  const {
    easyNumbers,
    inactiveStyle,
    selected,
    activeStyle,
    printCustom,
    customNumber,
  } = props.state;

  let style = inactiveStyle;
  let pressable = true;
  if (props.number === selected) {
    style = activeStyle;
    pressable = false;
  }
  return <Text style={style}> {props.number} </Text>;
};

const SquareList = (props: any) => {
  const {
    easyNumbers,
    inactiveStyle,
    selected,
    activeStyle,
    printCustom,
    customNumber,
  } = props.state;

  let justifyCont: any = printCustom ? 'space-between' : 'center';

  return (
    <View>
      <View style={{justifyContent: justifyCont, flexDirection: 'row'}}>
        <Pressable onLongPress={props.onLongPress}>
          <Pressable
            onLongPress={props.onLongPress}
            onPress={() => props.onPressRecommended(easyNumbers[0])}>
            <PrintNumber state={props.state} number={easyNumbers[0]} />
          </Pressable>
        </Pressable>
        {printCustom && (
          <Pressable
            onLongPress={props.onLongPress}
            onPress={props.onPressCustom}>
            <PrintNumber state={props.state} number={customNumber} />
          </Pressable>
        )}
      </View>
      <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
        <Pressable onLongPress={props.onLongPress}>
          <Pressable
            onLongPress={props.onLongPress}
            onPress={() => props.onPressRecommended(easyNumbers[1])}>
            <PrintNumber state={props.state} number={easyNumbers[1]} />
          </Pressable>
        </Pressable>
        <Pressable onLongPress={props.onLongPress}>
          <Pressable
            onLongPress={props.onLongPress}
            onPress={() => props.onPressRecommended(easyNumbers[2])}>
            <PrintNumber state={props.state} number={easyNumbers[2]} />
          </Pressable>
        </Pressable>
      </View>
    </View>
  );
};

const HorizontalList = (props: any) => {
  const {
    easyNumbers,
    inactiveStyle,
    selected,
    activeStyle,
    printCustom,
    customNumber,
  } = props.state;

  return (
    <Pressable onLongPress={props.onLongPress}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        {!printCustom && (
          <View style={{flexDirection: 'row'}}>
            {easyNumbers.map((number, index) => {
              return (
                <Pressable
                  key={index}
                  onLongPress={props.onLongPress}
                  onPress={() => props.onPressRecommended(number)}>
                  <PrintNumber state={props.state} number={number} />
                </Pressable>
              );
            })}
          </View>
        )}
        {printCustom && (
          <Pressable
            onLongPress={props.onLongPress}
            onPress={props.onPressCustom}>
            <PrintNumber state={props.state} number={customNumber} />
          </Pressable>
        )}
      </View>
    </Pressable>
  );
};

export const EasyNumberPicker = (props: EasyNumberPickerProps) => {
  const initialState = {
    easyNumbers: props.easyNumbers,
    selected: props.currentlySelected,
    isLongPressed: false,
    printCustom: false,
    customNumber: 0,
    isCustomPrintedSelected: false,
    isPickerActive: false,
    isFlatlistVisible: false,
    customMatchingOriginals: false, //checking of custom number is included in original suggestions. If it is > we dont print it too
    isActive: props.isActive || true,
    onLongPressMode: props.onLongPressMode || 'get text',
    easyMode: props.easyMode || 'horizontal',
    inactiveStyle: {
      color: 'grey',
      fontSize: 20,
      opacity: 0.3,
      ...props.inactiveTextStyle,
    },
    activeStyle: {
      color: 'blue',
      fontSize: 22,
      opacity: 1,
      ...props.textStyle,
    },
  };

  const {currentlySelected, onChange, validSelection} = props;
  const [state, dispatch] = useReducer(PickerReducer, initialState);

  const {
    easyNumbers,
    selected,
    isLongPressed,
    printCustom,
    customNumber,
    isCustomPrintedSelected,
    isPickerActive,
    isFlatlistVisible,
    customMatchingOriginals,
    isActive,
    onLongPressMode,
    easyMode,
    activeStyle,
    inactiveStyle,
  } = state;

  let customPrintedStyle = isCustomPrintedSelected
    ? activeStyle
    : inactiveStyle;
  useEffect(() => {
    //to fix some bug i do not understand which breaks it sometimes. wasn't intended like that
    //in case currently selected is different than easy numbers
    let flag: boolean = true; //dont update if flag stays false
    easyNumbers.forEach((number) => {
      if (number === currentlySelected) flag = false;
    });

    if (flag === true) dispatch({type: 'update status'});
  }, []);

  if (props.easyMode === 'square')
    if (props.easyNumbers.length > 3) {
      console.error(
        'easyMode Square supports only 3 recommended inputs + 1 custom. ',
        props.easyNumbers.length,
        ' have been detected',
      );
    }

  const onChangeHandler = (value) => {
    if (props.convertToNumber !== false) value = _.toNumber(value);
    onChange(value);
  };

  const onNewValueHandler = (value) => {
    let flag = true;
    let newValue = value;

    easyNumbers.forEach((number: number) => {
      if (number === newValue) {
        dispatch({
          type: 'update with custom value matching a recommended one',
          value: newValue,
        });
        flag = false;
      }
    });
    if (flag) {
      dispatch({
        type: 'update with custom value being unique',
        value: newValue,
      });
    }
    onChangeHandler(newValue);
  };

  const onLongPressHandler = () => {
    dispatch({type: 'toggle long press'});
  };

  const onPressRecommendedHandler = (number) => {
    dispatch({type: 'press recommended value', value: number});
    onChangeHandler(number);
  };

  const onPressCustomHandler = () => {
    dispatch({type: 'pressed custom value'});
    onChangeHandler(customNumber);
  };

  const renderItem = ({item, index}) => {
    return (
      <Pressable onPress={() => onNewValueHandler(item)}>
        <Text style={activeStyle}>{item}</Text>
      </Pressable>
    );
  };
  if (!isActive)
    return (
      <View style={{flexDirection: 'row'}}>
        {easyNumbers.map((number) => (
          <Text style={inactiveStyle}> {number} </Text>
        ))}
      </View>
    );
  else {
    if (!isLongPressed)
      return (
        <View>
          {easyMode === 'horizontal' && (
            <HorizontalList
              onLongPress={onLongPressHandler}
              state={state}
              onPressRecommended={onPressRecommendedHandler}
              onPressCustom={onPressCustomHandler}
              customPrintedStyle={customPrintedStyle}
              customNumber={customNumber}
            />
          )}
          {easyMode === 'square' && (
            <SquareList
              onLongPress={onLongPressHandler}
              state={state}
              onPressRecommended={onPressRecommendedHandler}
              onPressCustom={onPressCustomHandler}
              customPrintedStyle={customPrintedStyle}
              customNumber={customNumber}
            />
          )}
        </View>
      );
    else
      return (
        <View style={{flexDirection: 'row'}}>
          {onLongPressMode === 'picker' && (
            // <View style={{height: 250, width: 50}}>
            //   <Portal>
            //     <Modal visible={true}>
            //       <FlatList
            //         renderItem={renderItem}
            //         data={MAX_SETS}
            //         keyExtractor={(item, index) => index.toString()}
            //       />
            //     </Modal>
            //   </Portal>
            // </View>
            <Picker
              mode={'dropdown'}
              selectedValue={selected}
              style={{height: 50, width: 100}}
              itemStyle={activeStyle}
              onValueChange={(itemValue) => onNewValueHandler(itemValue)}>
              {validSelection.map((value) => (
                <Picker.Item
                  key={value}
                  label={value.toString()}
                  value={value}
                />
              ))}
            </Picker>
          )}
          {onLongPressMode === 'get text' && (
            <GetText
              startingValue={selected}
              style={activeStyle}
              numeric={true}
              autoFocus={true}
              onEnd={(newValue) => {
                dispatch({type: 'update with text', value: newValue});
                onChangeHandler(newValue);
              }}
            />
          )}
        </View>
      );
  }
};
