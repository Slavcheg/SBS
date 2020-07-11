import React, { useEffect } from "react"
import { View, ImageBackground } from 'react-native';
import { spacing, color } from '../../../theme';
import { imgs } from '../../../assets'
import {Button, Screen, GoogleLogin} from '../../../components'
import { googleInitialize } from "../../../services/auth/auth.service";

export function WelcomeScreen({ navigation }, {state}) {
  const { green_sbs, blue_sbs } = color.palette
  
  useEffect(() => {
    googleInitialize()
  }, [])

  return (
    <Screen 
      preset="scroll"
      unsafe={true} 
      style={{ 
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'flex-start',
        backgroundColor: 'white'
      }}
    >
      <ImageBackground
        source={imgs.bg}
        style={{
          flex: 1,
          width: "100%",
          alignItems: 'center', 
        }}
        resizeMode= "cover"
      >
      <View
        style={{
            flex:1
        }}
      ></View>

      {/* <Button
        style={{
          width: '90%',
          marginTop: spacing[8],
          paddingVertical: spacing[4],
          backgroundColor: blue_sbs
        }}
        textStyle={{
          color: 'white',
          fontSize: 16
        }}
        tx={'welcomeScreen.registrationBtn'}
        onPress={()=> navigation.navigate('registration')} 
      />     */}
      <Button
        style={{
          width: '90%',
          marginTop: spacing[6],
          paddingVertical: spacing[4],
          backgroundColor: green_sbs,
        }}
        textStyle={{
          color: 'white',
          fontSize: 16
        }}
        tx={'welcomeScreen.entryBtn'}
        onPress={()=> { navigation.navigate('signin') }} 
      />
      <GoogleLogin navigation={navigation}/>
      <View style={{marginBottom: "10%"}}></View>
      </ImageBackground>
    </Screen>
  );
}
  