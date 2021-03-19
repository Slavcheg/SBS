import React, { useCallback, useMemo } from "react"
import { View, FlatList, Pressable, TextStyle } from "react-native"
import {
  Text,
  GetSomeNumber,
  colors,
  Button,
  icons,
  T_Activity_calculator,
  Questionaires,
  T_activity_question,
  DEFAULT_ACTIVITY_ElEMENTS,
  PressableText,
  T_measurement,
} from "../../../../../components3"
import _ from "lodash"
import { errors } from "./errors"
import { EditBasicMeasurementProps } from "./EditMeasurements"
import { T_Dispatch_Measurements, T_State_Measurements } from "../../MeasureClients_Reducer"

export const ActivityMeasures: React.FC<EditBasicMeasurementProps> = props => {
  return useMemo(() => {
    return <ActivityMeasuresMemoed {...props} />
    // }, [props.measurement.activity])
  }, [...props.measurement.activity.answers])
}

export const ActivityMeasuresMemoed: React.FC<EditBasicMeasurementProps> = props => {
  const { measurement, state, dispatch } = props
  const error = errors.activity(measurement, props.state.editedDoc)
  //to FIX
  const Questionaire = Questionaires[0]

  return (
    <View>
      <FlatList
        data={Questionaire.QuestionsAndAnswers}
        keyExtractor={(item, index) => `${index}`}
        scrollEnabled={false}
        renderItem={({ item, index }) => (
          // <RenderQuestion item={item} index={index} measurement={measurement} onChangeMes={onChangeMes} />
          <RenderQuestion item={item} index={index} measurement={measurement} state={state} dispatch={dispatch} />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 10, borderWidth: 1 }}></View>}
        initialNumToRender={3}
      />
      <View style={{ height: 15 }}></View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View>
          {/* <Text style={{ fontSize: 17 }}>Резултати</Text> */}
          {error && (
            <View>
              <Text style={{ color: colors.red }}>{error}</Text>
            </View>
          )}

          {!error && (
            <View style={{ justifyContent: "center", flex: 1 }}>
              <Text>{`Твоят коефициент на активност е ${measurement.activity.activityCoef}`}</Text>
              {/* <Text>{`Мазнини ${results.fatWeight} кг`}</Text>
              <Text>{`Чисто тегло ${results.leanWeight} кг`}</Text> */}
            </View>
          )}
        </View>
        <View>
          <Button
            icon={icons.trash}
            color={colors.red}
            onPress={() => dispatch({ type: "delete some measures from one mesurement", value: "activity QnA" })}
          >
            активност
          </Button>
        </View>
      </View>
    </View>
  )
}

type RenderQuestionProps = {
  item: T_activity_question
  index: number
  measurement: T_measurement
  dispatch: T_Dispatch_Measurements
  state: T_State_Measurements
}

const RenderQuestion: React.FC<RenderQuestionProps> = props => {
  return useMemo(() => {
    return <RenderQuestionMemo {...props} />
  }, [props.measurement.activity.answers[props.index]])
}

const defTextStyle: TextStyle = { fontWeight: "bold", fontSize: 17 }
const RenderQuestionMemo: React.FC<RenderQuestionProps> = props => {
  const { item, index, measurement, dispatch } = props

  const Q_index = index
  const Q_Item: T_activity_question = item //for typescript purposes
  const isAnswered = Number.isInteger(measurement.activity.answers[index]) ? true : false

  const onChangeMes2 = (qIndex, aIndex) => {
    dispatch({ type: "change activity questions answer", questionIndex: qIndex, newAnswerIndex: aIndex })
  }

  return (
    <View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {!isAnswered && <Text style={{ ...defTextStyle, color: colors.black }}>{Q_Item.question}</Text>}
        {isAnswered && (
          <View style={{ flex: 5 }}>
            <Pressable onPress={() => onChangeMes2(index, null)}>
              <Text style={{ ...defTextStyle, color: colors.grey1 }}>{`${Q_Item.question}`}</Text>
              <Text>{`${Q_Item.answers[measurement.activity.answers[Q_index]].answerString}`}</Text>
            </Pressable>
          </View>
        )}
        {isAnswered && (
          <Button icon={icons.check} color={colors.green3} labelStyle={{ fontSize: 17 }} compact={true} style={{ flex: 1 }}>
            {""}
          </Button>
        )}
      </View>
      {!isAnswered && (
        <FlatList
          data={Q_Item.answers}
          keyExtractor={(item, index) => `${index}`}
          renderItem={({ item, index }) => {
            return (
              <PressableText style={{ fontSize: 18 }} onPress={() => onChangeMes2(Q_index, index)}>
                {item.answerString}{" "}
              </PressableText>
            )
          }}
        />
      )}
    </View>
  )
}
