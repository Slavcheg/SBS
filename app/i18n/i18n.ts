import * as RNLocalize from "react-native-localize"
import i18n from "i18n-js"

const en = require("./en")
const bg = require("./bg")

i18n.fallbacks = true
// use en for DEV
i18n.translations = { en }

// uncomment bg for PROD
// i18n.translations = { bg }

const fallback = { languageTag: "en", isRTL: false }
// const fallback = { languageTag: "bg", isRTL: false }

const { languageTag } =
  RNLocalize.findBestAvailableLanguage(Object.keys(i18n.translations)) || fallback
i18n.locale = languageTag
