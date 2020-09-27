import React, {
  useState,
  useEffect,
  Children,
  PropsWithChildren,
  ReactChild,
  ReactNode,
  ReactChildren,
} from 'react';
import {View, Text, TextInput as TextInput2, Pressable} from 'react-native';

type GetTextProps = {
  startingValue?: any;
  onEnd: any;
  style?: object;
  numeric?: boolean;
  autoFocus?: boolean;
  isNumber?: boolean;
  convertToString?: boolean;
  editable?: boolean;
};

export const GetText = (props: GetTextProps) => {
  const [text, setText] = useState(props.startingValue.toString());
  useEffect(() => {
    setText((text) => props.startingValue.toString());
  }, [props.startingValue]);

  const onSubmitHandler = () => {
    let output = text;
    if (props.isNumber) {
      if (!isNaN(parseFloat(output))) {
        output = parseFloat(output).toFixed(1);
        if (output.toString().includes('.0')) {
          let string = output.toString().split('');
          if (string[output.length - 2] === '.') {
            string.splice(output.length - 2, 2);
          }
          output = string.join('');
        }
      }
    }
    if (props.convertToString) output = output.toString();

    props.onEnd(output);
  };

  return (
    <TextInput2
      style={props.style}
      value={text}
      onChangeText={(value) => setText((text) => value)}
      onEndEditing={onSubmitHandler}
      keyboardType={props.numeric ? 'numeric' : 'default'}
      autoFocus={props.autoFocus}
      editable={props.editable}
      // placeholder={props.startingValue}
    />
  );
};

type EditableTextProps = {
  onEnd: any;
  style?: object;
  textStyle?: object;
  startingValue?: string;
  children: ReactChildren;
  onPress?: any;
};

export const EditableText = (props: EditableTextProps) => {
  const [isEditable, setIsEditable] = useState(false);
  const [text, setText] = useState(props.children);

  const onEndHandler = (newValue) => {
    setIsEditable(false);
    setText(newValue);
    props.onEnd(newValue);
  };

  return (
    <View style={props.style}>
      {isEditable ? (
        <GetText
          style={props.textStyle}
          onEnd={onEndHandler}
          startingValue={props.children}
          editable={isEditable}
          autoFocus={true}
        />
      ) : (
        <Pressable
          onLongPress={() => setIsEditable(true)}
          onPress={props.onPress}>
          <Text style={props.textStyle}>{text}</Text>
        </Pressable>
      )}
    </View>
  );
};
