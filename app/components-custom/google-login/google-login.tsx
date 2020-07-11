import React, { useEffect } from "react"
import { Button } from "../../components/button/button"
import { spacing, color } from "../../theme"
import { onGoogleButtonPress } from "../../services/auth/auth.service"
import { View, Text } from "react-native"
import {useStores } from "../../models/root-store"
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import { border_boxes } from "../../global-helper"

export function GoogleLogin({navigation}) {
  const {userStore, sessionStore} = useStores()
    useEffect(() => {
      userStore.ggetItems()
    }, [])

    return (
        <Button
            style={{
                width: '90%',
                marginTop: spacing[4],
                paddingVertical: spacing[2],
                backgroundColor: color.palette.white,
                borderColor: '#dd4b39',
                borderWidth: 1,
                borderRadius: 20,
                marginHorizontal: '5%'
            }}
            onPress={() => onGoogleButtonPress().then((x) => {
              // TODO do a loader until auth comes in
              // Do after login successful
              if (userStore.isUserExistend(x.additionalUserInfo.profile)){
                sessionStore.logIn(x.additionalUserInfo.profile.email)
                navigation.navigate('home_tr')
              } else {
                // Do after login unsuccessful
                console.log('google not found!')
                // TODO:    Отказан достъп. Моля свържете се с вашият треньор за информация как да използвате Гугъл акаунта си
              
              }
            })}
        >
          <View
            style={[
              // border_boxes().orange,
              {
              flexDirection: 'row',
              alignItems: 'center'
            }]}
          >
            <FontAwesomeIcon 
                  style={[{
                    marginRight: 10
                  }]}
                  icon={ faGoogle }
                  color={'#dd4b39'}
                  size={30}
              />
            <Text style={[{color: '#dd4b39'}]}>{'Sign-in with Google'}</Text>
          </View>          
        </Button>    
    )
}