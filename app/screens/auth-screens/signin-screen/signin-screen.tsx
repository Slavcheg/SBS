import React, { useEffect, useState } from "react"
import { StyleSheet, Text, View, ImageBackground, Image } from 'react-native';
import { Input, CheckBox } from "react-native-elements"
import { spacing, color } from '../../../theme';
import { imgs } from '../../../assets'
import {Button, Screen} from '../../../components'
import {auth_screens_styles as ass} from '../auth-screens-style'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Api } from '../../../services/api';
import ProgressLoader from 'rn-progress-loader';
import { SocialIcon } from 'react-native-elements'
import { NavigationProps } from "../../../models/commomn-navigation-props";
import { observer } from "mobx-react-lite";
import {useStores } from "../../../models/root-store"

interface SignInScreenProps extends NavigationProps {
}

export const SignInScreen: React.FunctionComponent<SignInScreenProps> = observer(props => {
  const { navigation } = props
  const [screenVisible, setScreenVisible] = useState(false); 
  const [email, setEmail] = useState('');  
  const [pass, setPass] = useState('');  

  const [serverError, setServerError] = useState(''); 
  const isServerErrored = serverError !== '';

  const [infoMessage, setInfoMessage] = useState(''); 
  const isInfo = infoMessage !== '';

  const [submitBtnClicked, setSubmitBtnClicked] = useState(false);   

  const userStore = useStores().userStore
  useEffect(() => {
    userStore.ggetItems()
  }, [])

  const signInUser = () => {
    setScreenVisible(true)

    if (userStore.clientLogIn(email.toLocaleLowerCase(), pass) == undefined) {
      setServerError('Непознат потребител. Моля свържете се с вашия треньор.')
      setInfoMessage('')
    } else {
      navigation.navigate('home_cl')
    }      
    setScreenVisible(false)

  }       
  
  const sendResetPasswordEmail = () => {
    setScreenVisible(true)
    if (email === '') {
      setScreenVisible(false)
      setInfoMessage('Just fill your email and press Forgotten password!')
      setServerError('')
      return;
    }
    const API = new Api()
    API.setup();
    API.postSendResetPasswordEmail(email.toLocaleLowerCase())
    .then( (res: any) => {
      setScreenVisible(false)
      // console.log(res)
      if (res.data.message !== 'ok!') {
        setServerError(res.data.message);
        setInfoMessage('')
      } else {
        setInfoMessage("We have sent you an email!")
        setServerError('')
      }      
    })
    .catch(err => {
      setScreenVisible(false)
      console.log(err)
      setServerError("Something went wrong! Please try agasin later!")
      setInfoMessage('')
    })
  }

  return (
    <Screen 
      preset="scroll"
      unsafe={true}
      style={{ 
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'flex-start',
        backgroundColor: color.palette.green_sbs
      }}
    >
      <ProgressLoader
                visible={screenVisible}
                isModal={false} 
                // isHUD={true}
                // hudColor={"#FFFFFF"}
                color={"#FFFFFF"} />
      <Image
        source={imgs.logo_white}
        style={{
          marginTop: '20%'
        }}
      />
      <View
        style={{
            flex:1
        }}
      ></View>
      <View
        style={{
          backgroundColor: 'white',
          width: '100%',
          borderTopStartRadius: 38,
          borderTopEndRadius: 38,
          paddingBottom: "10%"
        }}
      >
        <Text
          style={{
            marginTop: '10%',
            marginLeft: '5%',
            fontSize: 24,
            color: color.palette.green_sbs,
            marginBottom: spacing[8]
          }}
        >{'ВХОД'}</Text>
        <Input
          autoCapitalize='none'
          autoCompleteType="off"
          autoCorrect={false}
          onChangeText={val => setEmail(val)}
          placeholder={'име'}
          placeholderTextColor={'#999999'}
          inputContainerStyle={ass.inputContainerStyle}          
          inputStyle={ass.inputTextStyle}
        />
        <Input
          autoCapitalize='none'
          autoCompleteType="off"
          autoCorrect={false}
          onChangeText={val => setPass(val)}
          placeholder={'парола'}
          placeholderTextColor={'#999999'}
          inputContainerStyle={ass.inputContainerStyle}          
          inputStyle={ass.inputTextStyle}
        />
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
        {/* <TouchableOpacity
          onPress={() => sendResetPasswordEmail()}
        >
          <Text
            style={{
              marginTop: spacing[4],
              marginRight: spacing[4],
              fontSize: 12,
              color: 'black',
              alignSelf: 'flex-end'
            }}
          >{'забравена парола?'}</Text>
        </TouchableOpacity> */}
        {
          isInfo?
            <Text
              style={[
                ass.gereralStyle,
                {
                  color: color.palette.green_sbs
                }
              ]}
            >{infoMessage}</Text>
          : null 
        }        
         <Button
          style={{
            width: '90%',
            marginTop: spacing[8],
            paddingVertical: spacing[4],
            backgroundColor: color.palette.green_sbs,
            marginHorizontal: '5%'
          }}
          textStyle={{
            color: 'white',
            fontSize: 16
          }}
          tx={'welcomeScreen.entryBtn'}
          onPress={()=> signInUser()} 
        />               
      </View>
    </Screen>
  )
})