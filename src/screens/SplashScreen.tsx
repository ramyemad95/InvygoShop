import { useEffect, useRef } from "react"
import { View, Animated, StyleSheet } from "react-native"
import { useRouter } from "expo-router"

import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"

export const SplashScreen = () => {
  const router = useRouter()
  const { theme } = useAppTheme()
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.8)).current

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start()

    // Navigate to Home after animation
    const timer = setTimeout(() => {
      router.replace("/home")
    }, 1500)

    return () => clearTimeout(timer)
  }, [fadeAnim, scaleAnim, router])

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text preset="heading" text="Invygo Shop" style={styles.title} />
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
})
