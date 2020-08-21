import React, {useState, useEffect} from 'react';
import {View, Text, Platform} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button } from '../../components/button/button';

export function DatePicker({showPicker, useValue}) {
  const [date, setDate] = useState(new Date(1598051730000));

  // const onChange = (event, selectedDate) => {
  //   const currentDate = selectedDate || date;
  //   setDate(currentDate);
  //   console.log(date);
  //   (date) => useValue(date)
  // };

  return (
    <View>
        <View>
        <DateTimePicker
          testID="dateTimePicker"
          timeZoneOffsetInMinutes={0}
          value={date}
          mode={'date'}
          is24Hour={true}
          display="default"
          onChange={(e, d) => {
            const currentDate = d || date;
            setDate(currentDate)
            //showPicker(Platform.OS === 'ios');
            useValue(currentDate)
          }}
        />
        {/*<Button 
          style={[{
            backgroundColor: 'white'
          }]}
        onPress={() => showPicker()}><Text>{'save & close'}</Text></Button>*/}
        </View>
    </View>
  );
}
