import React, { useState, useEffect } from "react"
import { StyleSheet, Text, View, ImageBackground, Image, SafeAreaView } from 'react-native';
import { Input, CheckBox } from "react-native-elements"
import { spacing, color } from '../../../theme';
import { imgs } from '../../../assets'
import {Button, Screen} from '../../../components'
import { Api } from '../../../services/api'

export function WelcomeScreen({ navigation }, {state}) {
    const { green_sbs, blue_sbs } = color.palette
  // const goSomewhere = () => {
  //   const API = new Api()
  //   API.setup()
  //   API.getPing()
  //     .then((res: any) => {
  //       console.log(res)
  //       if (res.data === 'ok!') {
  //         navigation.navigate('registration')
  //       }               
  //     })        
  // }
  
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
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          width: '80%',
        }}
      >
        <Button
        style={{
          backgroundColor: blue_sbs
        }}
        textStyle={{
          color: 'white',
          fontSize: 16
        }}
        text={'trainer'}
        onPress={()=> navigation.navigate('home_tr')} 
        />
        <Button
        style={{
          backgroundColor: green_sbs
        }}
        textStyle={{
          color: 'white',
          fontSize: 16
        }}
        text={'client'}
        onPress={()=> { navigation.navigate('home_cl') }} 
        />
      </View>
      <Button
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
      />    
      <Button
        style={{
          width: '90%',
          marginTop: spacing[6],
          paddingVertical: spacing[4],
          backgroundColor: green_sbs,
          // marginBottom: '20%'
        }}
        textStyle={{
          color: 'white',
          fontSize: 16
        }}
        tx={'welcomeScreen.entryBtn'}
        onPress={()=> { navigation.navigate('signin') }} 
      />   
      <View style={{marginBottom: "10%"}}></View>
      </ImageBackground>
    </Screen>
  );
}
  