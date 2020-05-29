import React, { useEffect } from "react"
import { Button } from "../../components/button/button"
import { spacing, color } from "../../theme"
import { onGoogleButtonPress } from "../../services/auth/auth.service"
import { View, Text } from "react-native"
import { SocialIcon } from "react-native-elements"
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export function GoogleLogin({navigation}) {
    let google_pass_collection: Promise<FirebaseFirestoreTypes.QuerySnapshot>;
        
    useEffect(() => {
        google_pass_collection = 
            firestore()
                .collection('google-login-pass')
                .get()
                .then(x => {
                    console.log('coll came')
                    return x
                })
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
            google_pass_collection
                .then(snap => {
                   if( 
                        snap
                            .docs
                            .find(y => y.id == x.additionalUserInfo.profile.email)
                            .exists 
                    ) {
// Do after login successful
                        navigation.navigate('home_tr')
                   } else {
// Do after login unsuccessful
                    // TODO:    Отказан достъп. Моля свържете се с вашият треньор за информация как да използвате Гугъл акаунта си
                   }
                })
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