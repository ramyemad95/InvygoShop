import { View, StyleSheet, TouchableOpacity } from "react-native"
import { DevSettings } from "react-native"
import { useRouter } from "expo-router"
import i18n from "i18next"

import { Icon } from "@/components/Icon"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Switch } from "@/components/Toggle/Switch"
import { setRTLFromLanguage } from "@/i18n"
import { useAppDispatch, useAppSelector } from "@/store"
import { setTheme, setLanguage } from "@/store/slices/uiSlice"
import { useAppTheme } from "@/theme/context"

export const SettingsScreen = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { theme, setThemeContextOverride } = useAppTheme()
  const { theme: reduxTheme, language } = useAppSelector((state) => state.ui)

  const handleThemeToggle = (value: boolean) => {
    const newTheme = value ? "dark" : "light"
    dispatch(setTheme(newTheme))
    setThemeContextOverride(newTheme)
  }

  const handleLanguageToggle = async (value: boolean) => {
    const newLanguage = value ? "ar" : "en"
    dispatch(setLanguage(newLanguage))
    await i18n.changeLanguage(newLanguage)

    // Update RTL
    setRTLFromLanguage(newLanguage)

    // Reload the app to fully apply direction/layout
    DevSettings.reload()
  }

  return (
    <Screen preset="scroll">
      <View style={[styles.header, { borderBottomColor: theme.colors.separator }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon icon="back" size={24} />
        </TouchableOpacity>
        <Text preset="heading" tx="settingsScreen:title" style={styles.title} />
        <View style={styles.placeholder} />
      </View>
      <View style={styles.container}>
        <View style={styles.section}>
          <View style={[styles.settingRow, { borderBottomColor: theme.colors.separator }]}>
            <View style={styles.settingInfo}>
              <Text preset="subheading" tx="settingsScreen:theme" />
              <Text
                preset="formHelper"
                tx={reduxTheme === "dark" ? "settingsScreen:dark" : "settingsScreen:light"}
              />
            </View>
            <Switch value={reduxTheme === "dark"} onValueChange={handleThemeToggle} />
          </View>

          <View style={[styles.settingRow, { borderBottomColor: theme.colors.separator }]}>
            <View style={styles.settingInfo}>
              <Text preset="subheading" tx="settingsScreen:language" />
              <Text
                preset="formHelper"
                tx={language === "ar" ? "settingsScreen:arabic" : "settingsScreen:english"}
              />
            </View>
            <Switch value={language === "ar"} onValueChange={handleLanguageToggle} />
          </View>
        </View>
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  backButton: {
    padding: 8,
  },
  container: {
    padding: 16,
  },
  header: {
    alignItems: "center",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  placeholder: {
    width: 40,
  },
  section: {
    marginBottom: 24,
  },
  settingInfo: {
    flex: 1,
  },
  settingRow: {
    alignItems: "center",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
})
