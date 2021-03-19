import { useState, useEffect } from "react"
import { BackHandler } from "react-native"
import { useGlobalState } from "../../globalState"
import { T_client_short } from "../../types"

export const useTempValue = (
  originalValue,
  callback: (newValue: any) => any,
  optionalDependencies?: any[],
  delay = 500,
) => {
  const [tempValue, setTempValue] = useState(originalValue)
  const [countDown, setCountDown] = useState(delay)

  const COUNTDOWN_DECREMENT = 500

  const decreaseTimer = () => {
    setCountDown(countDown - COUNTDOWN_DECREMENT)
  }
  useEffect(() => {
    if (tempValue !== originalValue) setCountDown(delay)
  }, [tempValue])

  useEffect(() => {
    if (countDown > 0) setTimeout(decreaseTimer, COUNTDOWN_DECREMENT)

    if (countDown <= 0 && tempValue !== originalValue) {
      callback(tempValue)
    }
  }, [countDown])

  useEffect(() => {
    if (tempValue !== originalValue) setTempValue(originalValue)
  }, [originalValue, ...optionalDependencies])

  return [tempValue, setTempValue]
}

export const useBackHandler = (isGoingBack: () => boolean, deps: Array<any> = []) => {
  useEffect(() => {
    const onBack = () => {
      const response = isGoingBack()
      return !response
    }

    BackHandler.addEventListener("hardwareBackPress", onBack)
    return () => BackHandler.removeEventListener("hardwareBackPress", onBack)
  }, [...deps])
}

export const useTrainerClients = () => {
  const [globalState, setGlobalState] = useGlobalState()
  const [clients, setClients] = useState<T_client_short[]>([])

  useEffect(() => {
    setClients(globalState.loggedUser.Clients)
  }, [globalState.loggedUser.Clients])

  return clients
}
