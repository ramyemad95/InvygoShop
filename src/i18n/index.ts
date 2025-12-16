import { I18nManager } from "react-native"
import * as Localization from "expo-localization"
import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import "intl-pluralrules"
import { loadString } from "@/utils/storage"

// if English isn't your default language, move Translations to the appropriate language file.
import ar from "./ar"
import en, { Translations } from "./en"
import es from "./es"
import fr from "./fr"
import hi from "./hi"
import ja from "./ja"
import ko from "./ko"

const fallbackLocale = "en"

const systemLocales = Localization.getLocales()

const resources = { ar, en, ko, es, fr, ja, hi }
const supportedTags = Object.keys(resources)

// Checks to see if the device locale matches any of the supported locales
// Device locale may be more specific and still match (e.g., en-US matches en)
const systemTagMatchesSupportedTags = (deviceTag: string) => {
  const primaryTag = deviceTag.split("-")[0]
  return supportedTags.includes(primaryTag)
}

const pickSupportedLocale: () => Localization.Locale | undefined = () => {
  return systemLocales.find((locale) => systemTagMatchesSupportedTags(locale.languageTag))
}

const locale = pickSupportedLocale()
const resolvedLanguageTag = locale?.languageTag.split("-")[0] ?? fallbackLocale

// Prefer stored user choice; fall back to detected language
const storedLanguage = loadString("app.language") as string | null
const initialLanguage = storedLanguage || resolvedLanguageTag

export let isRTL = initialLanguage === "ar" || locale?.textDirection === "rtl"

const applyRTL = (rtl: boolean) => {
  I18nManager.allowRTL(rtl)
  I18nManager.forceRTL(rtl)
  I18nManager.swapLeftAndRightInRTL(rtl)
  isRTL = rtl
}

// Need to set RTL ASAP to ensure the app is rendered correctly. Waiting for i18n to init is too late.
applyRTL(isRTL)

export const setRTLFromLanguage = (language: string) => {
  applyRTL(language === "ar")
}

export const initI18n = async () => {
  i18n.use(initReactI18next)

  await i18n.init({
    resources,
    lng: initialLanguage,
    fallbackLng: fallbackLocale,
    interpolation: {
      escapeValue: false,
    },
  })

  return i18n
}

/**
 * Builds up valid keypaths for translations.
 */

export type TxKeyPath = RecursiveKeyOf<Translations>

// via: https://stackoverflow.com/a/65333050
type RecursiveKeyOf<TObj extends object> = {
  [TKey in keyof TObj & (string | number)]: RecursiveKeyOfHandleValue<TObj[TKey], `${TKey}`, true>
}[keyof TObj & (string | number)]

type RecursiveKeyOfInner<TObj extends object> = {
  [TKey in keyof TObj & (string | number)]: RecursiveKeyOfHandleValue<TObj[TKey], `${TKey}`, false>
}[keyof TObj & (string | number)]

type RecursiveKeyOfHandleValue<
  TValue,
  Text extends string,
  IsFirstLevel extends boolean,
> = TValue extends any[]
  ? Text
  : TValue extends object
    ? IsFirstLevel extends true
      ? Text | `${Text}:${RecursiveKeyOfInner<TValue>}`
      : Text | `${Text}.${RecursiveKeyOfInner<TValue>}`
    : Text
