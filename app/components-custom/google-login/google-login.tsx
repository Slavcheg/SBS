import React, { useEffect } from "react"
import { Button } from "../../components/button/button"
import { spacing, color } from "../../theme"
import { onGoogleButtonPress } from "../../services/auth/auth.service"
import { View, Text } from "react-native"
import { SocialIcon } from "react-native-elements"
import {useStores } from "../../models/root-store"

export function GoogleLogin({navigation}) {
  const userStore = useStores().userStore
    useEffect(() => {
      userStore.ggetItems()
    }, [])

    return (
        <Button
            style={{
                width: '90%',
                marginTop: spacing[4],
                paddingVertical: spacing[1],
                backgroundColor: color.palette.white,
                borderColor: '#dd4b39',
                borderWidth: 1,
                borderRadius: 20,
                marginHorizontal: '5%'
            }}
            onPress={() => onGoogleButtonPress().then((x) => {
              // TODO do a loader until auth comes in
              if(
                userStore.users
                  .find(user => user.item.email == x.additionalUserInfo.profile.email)
              ) {
                // Do after login successful
                console.log('google found!')
                navigation.navigate('home_tr')
              } else {
                // Do after login unsuccessful
                console.log('google not found!')
                // TODO:    Отказан достъп. Моля свържете се с вашият треньор за информация как да използвате Гугъл акаунта си
              }
            })}
        >
          <View
            style={[{
              flexDirection: 'row',
              alignItems: 'center'
            }]}
          >
            <SocialIcon
              raised={false}
              light
              type='google'
            />
            <Text style={[{color: '#dd4b39'}]}>{'Sign-in with Google'}</Text>
          </View>          
        </Button>    
    )
}