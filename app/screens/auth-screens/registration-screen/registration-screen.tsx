import React, { useEffect, useState } from "react"
import { StyleSheet, Text, View, ImageBackground, Image } from 'react-native';
import { Input, CheckBox } from "react-native-elements"
import { spacing, color } from '../../../theme';
import { imgs } from '../../../assets'
import {regStyles} from './registration-style'
import {Button, Screen} from '../../../components'
import { Api } from '../../../services/api'
import {auth_screens_styles as ass} from '../auth-screens-style'

export function RegistrationScreen({navigation}) {
  const [email, setEmail] = useState('');  
  const [pass, setPass] = useState('');  
  const [confPass, setConfPass] = useState('');
  
  // validation
  const isValidEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
  const isValidPassword = pass.length > 6;
  const isPassMatch = pass === confPass && pass !== '';
  const [serverError, setServerError] = useState(''); 
  const isServerErrored = serverError !== '';
  const [submitBtnClicked, setSubmitBtnClicked] = useState(false);   

  const createUser = () => {
    setSubmitBtnClicked(true);

    const API = new Api()
    API.setup();
    if (isValidEmail && isValidPassword && isPassMatch) {
      API.postCreateUser(email.toLocaleLowerCase(), pass)
        .then((res: any) => {
          if (res.data.message !== 'ok!') {
            setServerError(res.data.message)
          } else {
            navigation.navigate('home_cl')
          }      
        })
        .catch(err => {setServerError(err)})
    }        
  }
  return (
      <Screen 
        preset="scroll"
        unsafe={true}
        style={{ 
          flex: 1, 
          alignItems: 'center', 
          justifyContent: 'flex-start',
          backgroundColor: color.palette.blue_sbs
        }}
      >
        <Image
          source={imgs.logo_white}
          style={{
            marginTop: '20%'
          }}
        >
        </Image>
        <View
          style={{
              flex:1
          }}
        ></View>
        <View
          style={{
            // flex: 1,
            backgroundColor: 'white',
            width: '100%',
            borderTopStartRadius: 38,
            borderTopEndRadius: 38,
            paddingBottom: "10%"
          }}
        >
          <Text
            style={{
              marginTop: 50,
              marginLeft: 20,
              fontSize: 24,
              color: color.palette.blue_sbs,
              marginBottom: spacing[8]
            }}
          >{'РЕГИСТРАЦИЯ'}</Text>
          <Input
            autoCapitalize='none'
            autoCompleteType="off"
            autoCorrect={false}
            onChangeText={val => setEmail(val)}
            placeholder={'емайл'}
            placeholderTextColor={'#999999'}
            inputContainerStyle={regStyles.inputContainerStyle}          
            inputStyle={regStyles.inputTextStyle}
          />
          {
            !isValidEmail && submitBtnClicked ?
              <Text
                style={[
                  ass.gereralStyle,
                  {
                    color: color.error
                  }
                ]}
              >{'Email is invalid!'}</Text>
            : null
          }
          
          <Input
            autoCapitalize='none'
            autoCompleteType="off"
            autoCorrect={false}
            placeholder={'име'}
            placeholderTextColor={'#999999'}
            inputContainerStyle={regStyles.inputContainerStyle}          
            inputStyle={regStyles.inputTextStyle}
          />
          <Input
            autoCapitalize='none'
            autoCompleteType="off"
            autoCorrect={false}
            placeholder={'фамилия'}
            placeholderTextColor={'#999999'}
            inputContainerStyle={regStyles.inputContainerStyle}          
            inputStyle={regStyles.inputTextStyle}
          />
          <Input
            autoCapitalize='none'
            autoCompleteType="off"
            autoCorrect={false}
            onChangeText={val => setPass(val)}
            placeholder={'парола'}
            placeholderTextColor={'#999999'}
            inputContainerStyle={regStyles.inputContainerStyle}          
            inputStyle={regStyles.inputTextStyle}
          />
          {
            !isValidPassword && submitBtnClicked ?
            <Text
              style={[
                ass.gereralStyle,
                {
                  color: color.error
                }
              ]}
            >{'Password must be over 6 characters!'}</Text>
            : null
          }
          <Input
            autoCapitalize='none'
            autoCompleteType="off"
            autoCorrect={false}
            onChangeText={val => setConfPass(val)}
            placeholder={'потвърди паролата'}
            placeholderTextColor={'#999999'}
            inputContainerStyle={regStyles.inputContainerStyle}          
            inputStyle={regStyles.inputTextStyle}
          />
          {
            !isPassMatch && submitBtnClicked ?
              <Text
                style={[
                  ass.gereralStyle,
                  {
                    color: color.error
                  }
                ]}
              >{'Confirm password field does not match with password!'}</Text>
            : null 
          }
          {
            isServerErrored ?
              <Text
                style={[
                  ass.gereralStyle,
                  {
                    color: color.error
                  }
                ]}
              >{serverError}</Text>
            : null 
          }
          <CheckBox
            title='Права и условия'
            checked={false}
            checkedColor={'black'}
            uncheckedColor={'black'}
            containerStyle={{
              backgroundColor: 'white',
              borderColor: 'white'
            }}
            textStyle={{
              fontSize: 11,
              fontWeight: '400',
              color: 'black'
            }}
          />
          <Button
            style={{
              width: '90%',
              marginTop: spacing[4],
              paddingVertical: spacing[4],
              backgroundColor: color.palette.blue_sbs,
              marginHorizontal: 20
            }}
            textStyle={{
              color: 'white',
              fontSize: 16
            }}
            tx={'welcomeScreen.registrationBtn'}
            onPress={()=> createUser()} 
          />  
        </View>
      </Screen>
    );
  }