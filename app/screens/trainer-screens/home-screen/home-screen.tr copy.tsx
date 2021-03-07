import React, { useEffect, useState } from "react"
import { Text, View } from "react-native"
import { spacing, color } from "../../../theme"
import { Screen, MainHeader_Tr, ButtonSquare } from "../../../components"
import ProgressCircle from "react-native-progress-circle"
import { displayDateFromTimestamp, today_vs_last_day } from "../../../global-helper"
import { NavigationProps } from "../../../models/commomn-navigation-props"
import { observer } from "mobx-react-lite"
import { useStores } from "../../../models/root-store"
import { translate } from "../../../i18n"

interface menuProps extends NavigationProps {}

const MenuButtonsList: React.FunctionComponent<menuProps> = observer(props => {
  const { navigation } = props
  const sessionStore = useStores().sessionStore
  const userStore2 = useStores().userStore2
  const [isUserAdmin, setIsUserAdmin] = useState<boolean>(false)

  useEffect(() => {
    let mounted = true
    if (mounted) {
      userStore2.getItems()
      let user = userStore2.users.find(user => user.item.email === sessionStore.userEmail)
      setIsUserAdmin(user.item.isAdmin)
      console.log("user is admin: ", isUserAdmin)
    }
    return () => (mounted = false)
  }, [isUserAdmin])

  const menuList = require("./menu-list-tr.json")
  return menuList.map((el, i) => {
    const onPress = el.onClick !== "goSomewhere" ? () => navigation.navigate(el.onClick) : null

    if (el.needsAdminRights && !isUserAdmin) return null
    return el.show ? (
      <ButtonSquare
        style={{ marginTop: 20 }}
        key={i}
        title={translate(el.title)}
        onPress={onPress}
        leftIcon={el.iconLeft}
        rightIcon={el.iconRight}
      ></ButtonSquare>
    ) : null
  })
})

interface HomeScreenTrainerProps extends NavigationProps {}

export const HomeScreenTrainer: React.FunctionComponent<HomeScreenTrainerProps> = observer(
  props => {
    const { navigation } = props
    const rootStore = useStores()
    rootStore.hideLoader()

    // useEffect(() => {

    // }, [])

    return (
      <Screen
        preset="scroll"
        unsafe={false}
        style={{
          flexGrow: 1,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          backgroundColor: color.palette.transparent,
        }}
      >
        <MainHeader_Tr navigation={navigation} style={{ paddingHorizontal: 25 }} />
        <View
          style={[
            {
              paddingVertical: spacing[8],
            },
          ]}
        >
          <ProgressCircle
            percent={today_vs_last_day() * 100}
            radius={100}
            borderWidth={15}
            color={color.palette.blue_sbs}
            shadowColor="#CCCCCC"
            bgColor="#fff"
          >
            <View
              style={{
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 30,
                  fontWeight: "bold",
                  color: color.palette.blue_sbs,
                }}
              >
                {rootStore.numberOfTrainingsForLoggedTrainerThisMonth}
              </Text>
              <Text
                style={{
                  color: "#666666",
                }}
              >
                {translate("trainerHomeScreen.progressCircleTextTop")}
              </Text>
              <Text
                style={{
                  color: "#666666",
                }}
              >
                {translate("trainerHomeScreen.progressCircleTextBottom") +
                  " " +
                  displayDateFromTimestamp()}
              </Text>
            </View>
          </ProgressCircle>
        </View>
        <View
          style={[
            {
              flex: 1,
              width: "100%",
              backgroundColor: "#F4F8FB",
              paddingTop: 5,
              paddingHorizontal: 25,
            },
          ]}
        >
          <MenuButtonsList navigation={navigation} />
        </View>
      </Screen>
    )
  },
)
