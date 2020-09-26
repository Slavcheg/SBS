import React, { useEffect, useState } from "react"
import { Text, View, TouchableOpacity, Pressable } from "react-native"
import { spacing, color, styles } from "../../../theme"
import { Screen, MainHeader_Tr, ButtonSquare } from "../../../components"
import ProgressCircle from "react-native-progress-circle"
import { displayDateFromTimestamp, today_vs_last_day } from "../../../global-helper"
import { NavigationProps } from "../../../models/commomn-navigation-props"
import { observer } from "mobx-react-lite"
import { useStores } from "../../../models/root-store"
import { translate } from "../../../i18n"
import { SwipeRow } from "react-native-swipe-list-view"

import { Button } from "react-native-paper"

interface EditProgramScreenProps extends NavigationProps {}

export const EditProgramScreen: React.FunctionComponent<EditProgramScreenProps> = observer(
  props => {
    const { navigation } = props
    const sessionStore = useStores().sessionStore
    const userStore2 = useStores().userStore2
    const programsStore = useStores().trainingProgramsStore
    const exercisesStore = useStores().exerciseDataStore
    const rootStore = useStores()

    const [state, setState] = useState({ selectedProgram: 0, loadedExercises: false })

    useEffect(() => {
      programsStore.getItems()
    }, [programsStore])
    return (
      <View>
        <Text>EditProgramScreen</Text>
      </View>
    )
  },
)
