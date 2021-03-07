import React, { useEffect, useState } from "react"
import { Button } from "../../components/button/button"
import { spacing, color } from "../../theme"
import { onGoogleButtonPress, GoogleSignOut } from "../../services/auth/auth.service"
import { View, Text, Alert } from "react-native"
import { useStores } from "../../models/root-store"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faGoogle } from "@fortawesome/free-brands-svg-icons"
import { border_boxes } from "../../global-helper"
import { useGlobalState } from "../../models/global-state-regular"
import firestore from "@react-native-firebase/firestore"

import functions from "@react-native-firebase/functions"

export function GoogleLogin({ navigation }) {
  const { userStore2, sessionStore } = useStores()
  const rootStore = useStores()
  const [globalState, setGlobalState] = useGlobalState()
  const [userReady, setUserReady] = useState(false)
  // useEffect(() => {
  //   userStore2.getItems()
  // }, [])

  useEffect(() => {
    if (globalState.loggedUser.email !== "") {
      if (globalState.loggedUser.isTrainer) navigation.navigate("home_tr")
      else navigation.navigate("homeScreenClient2")
    }
  }, [globalState.loggedUser])

  const onGetProfile = profile => {
    let userData
    firestore()
      .collection("trainees")
      .where("email", "==", profile.email)
      .get()
      .then(query => {
        if (query.docs.length > 1)
          console.error("critical error, more than 1 user with the same email found")
        query.docs.forEach(doc => {
          userData = doc.data()
          if (!userData.profilePicture)
            if (profile.picture) {
              userData.profilePicture = profile.picture
              // firestore()
              //   .collection("trainees")
              //   .doc(userData.ID)
              //   .update(userData)
              //   .then(() => console.log("picture updated"))
            }
        })
        if (userData) {
          setGlobalState({ type: "login with user", user: userData })
        } else {
          Alert.alert(
            "",
            "Не намерихме профил с този имейл. Свържи се с екипа на Strong by Science за повече информация",
            [{ text: "ок" }],
            {
              cancelable: false,
            },
          )
          GoogleSignOut()
        }
      })
      .catch(error => console.error(error))
  }

  const onGetToken = async token => {
    const profile = token.additionalUserInfo.profile
    const response = await functions().httpsCallable("getUser")()
    const user = response.data.userData
    const userDiary = response.data.userDiary
    console.log("received response: ", user)
    if (user) setGlobalState({ type: "login with user", user: user, userDiary: userDiary })
  }
  return (
    <Button
      style={{
        width: "90%",
        marginTop: spacing[4],
        paddingVertical: spacing[2],
        backgroundColor: color.palette.white,
        borderColor: "#dd4b39",
        borderWidth: 1,
        borderRadius: 20,
        marginHorizontal: "5%",
      }}
      onPress={() => onGoogleButtonPress(rootStore.showLoader).then(onGetToken)}
    >
      <View
        style={[
          // border_boxes().orange,
          {
            flexDirection: "row",
            alignItems: "center",
          },
        ]}
      >
        <FontAwesomeIcon
          style={[
            {
              marginRight: 10,
            },
          ]}
          icon={faGoogle}
          color={"#dd4b39"}
          size={30}
        />
        <Text style={[{ color: "#dd4b39" }]}>{"Sign-in with Google"}</Text>
      </View>
    </Button>
  )
}
