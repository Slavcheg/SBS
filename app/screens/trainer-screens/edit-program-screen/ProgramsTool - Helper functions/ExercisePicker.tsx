import React, { useState, useEffect, useCallback } from "react"
import { View, FlatList, Pressable, Text, StyleSheet } from "react-native"
import { Button } from "react-native-paper"
import { SearchBar } from "react-native-elements"
import iStyles from "../Constants/Styles"
import { StoreContext } from "../../StoreProvider"
import { useStores } from "../../../../models/root-store"

import { COLLECTION, DB_EXERCISE_COLLECTION, YOUTUBE_API_KEY } from "../Constants/DatabaseConstants"
import YouTube, { YouTubeStandaloneAndroid } from "react-native-youtube"
import { getVideoID, getVideoTime } from "./smallFunctions"

const EXERCISE_ITEM_HEIGHT = 30

function filterExercises(text, array) {
  function filterFunction(exercise) {
    if (exercise.Name.toUpperCase().includes(text.toUpperCase())) return true
  }
  let newArray = array.filter(exercise => filterFunction(exercise))

  return newArray
}

export const ExercisePicker = React.memo(function ExercisePicker(props: any) {
  // console.log('rendered ExercisePicker');
  const allExercises: any = useStores().exerciseDataStore.exercises
  const [searchText, setSearchText] = useState("")
  const [currentArray, setCurrentArray] = useState(props.shownArray)
  useEffect(() => {
    setCurrentArray(props.shownArray)
    return () => {
      setCurrentArray(props.shownArray)
    }
  }, [props.shownArray])

  const onCancelHandler = useCallback(() => {
    setSearchText("")
    setCurrentArray(props.shownArray)
  }, [])
  const onChangeTextHandler = useCallback(text => {
    setCurrentArray(currentArray => filterExercises(text, allExercises))
    setSearchText(searchText => text)
  }, [])

  const renderExerciseDB = ({ item }) => {
    return (
      <View style={styles.renderContainer}>
        <View style={{ width: "100%", alignItems: "center" }}>
          <Pressable
            // style={({pressed}) => [
            //   {
            //     width: '100%',
            //     alignContent: 'stretch',
            //     backgroundColor: pressed ? iStyles.text1.color : 'white',
            //     borderRadius: 15,
            //   },
            //   {padding: 5},
            // ]}
            onPress={() => props.onClickMainText(item)}
            // onLongPress={props.onClickV.bind(this, item)}
            onLongPress={() =>
              YouTubeStandaloneAndroid.playVideo({
                apiKey: YOUTUBE_API_KEY, //
                videoId: getVideoID(item.YouTubeLink),
                autoplay: true,
                lightboxMode: true,
                startTime: getVideoTime(item.YouTubeLink),
              })
                .then(() => console.log("Standalone Player Exited"))
                .catch(errorMessage => console.error(errorMessage))
            }
          >
            {({ pressed }) => (
              <View style={{ width: "100%", alignItems: "center" }}>
                <Text
                  style={{
                    ...iStyles.selectedText,
                    fontSize: pressed ? 25 : 23,
                    color: pressed ? iStyles.text1.color : "black",
                  }}
                >
                  {item.Name}
                </Text>
              </View>
            )}
          </Pressable>
        </View>
        {/* <View style={{flex: 1}}>
          <View style={{alignSelf: 'flex-end', paddingVertical: 1}}>
            <Pressable onPress={props.onClickV.bind(this, item)}>
              {({pressed}) => (
                <Button
                  mode="contained"
                  compact={true}
                  color={pressed ? iStyles.text2.color : iStyles.text1.color}
                  // style={{marginVertical: 0.5}}
                >
                  V
                </Button>
              )}
            </Pressable>
          </View>
        </View> */}
      </View>
    )
  }

  if (!props.isVisible) return <View></View>
  else
    return (
      <View
        style={{
          // flexDirection: 'row',
          width: "100%",
          height: "100%",
          // flex: 1,
          // display: props.isVisible ? 'flex' : 'none',
          // borderWidth: 3,
          // borderColor: 'red',
        }}
      >
        <FlatList
          data={currentArray}
          keyExtractor={(item, index) => {
            return `${item.ID}-${index}`
          }}
          initialNumToRender={15}
          renderItem={renderExerciseDB}
          keyboardShouldPersistTaps="always"
          getItemLayout={(data, index) => ({
            length: EXERCISE_ITEM_HEIGHT,
            offset: EXERCISE_ITEM_HEIGHT * index,
            index,
          })}
        />
        <View style={{ marginBottom: 35, justifyContent: "flex-end" }}>
          <SearchBar
            placeholder="Search for an exercise"
            containerStyle={{ backgroundColor: iStyles.text1.color }}
            inputContainerStyle={{ backgroundColor: "white" }}
            lightTheme={true}
            round={true}
            value={searchText}
            onChangeText={text => onChangeTextHandler(text)}
            onCancel={onCancelHandler}
            onClear={onCancelHandler}
            autoFocus={props.autoFocusSearch}
          />
        </View>
      </View>
    )
  // };
})
// export const ExercisePicker = React.memo(SlowExercisePicker);

const styles = StyleSheet.create({
  renderContainer: {
    flexDirection: "row",
    width: "100%",
    height: EXERCISE_ITEM_HEIGHT,
  },
})
