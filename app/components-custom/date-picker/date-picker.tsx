import React, {useState, useEffect} from 'react';
import {View, Text, Platform} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button } from '../../components/button/button';
import moment from 'moment'
import { getStampFromDate } from '../../global-helper';

interface DatePickerProps {
  showPicker: Function,
  inputDateStamp: number,
  onDateChange: Function
}

export const DatePicker: React.FunctionComponent<DatePickerProps> = props => {
  const {showPicker, inputDateStamp, onDateChange} = props
  const [date, setDate] = useState<Date>(moment(inputDateStamp).toDate() || moment().toDate());

  return (
    <View>
        <DateTimePicker
          testID="dateTimePicker"
          timeZoneOffsetInMinutes={0}
          value={date}
          mode={'date'}
          is24Hour={true}
          display="default"
          onChange={(event, _date) => {
            setDate(_date)
            onDateChange(getStampFromDate(_date))
          }}
        />
        <Button 
          style={[{
            backgroundColor: 'white'
          }]}
        onPress={() => showPicker()}><Text>{'save & close'}</Text></Button>
    </View>
  );
}
