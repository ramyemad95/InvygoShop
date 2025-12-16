import React, { useEffect } from "react"
import { View, Animated, StyleSheet } from "react-native"
import { useRouter } from "expo-router"
import { useAppTheme } from "@/theme/context"
import { Text } from "@/components/Text"

export const SplashScreen = () => {
  const router = useRouter()
  const { theme } = useAppTheme()
  const fadeAnim = React.useRef(new Animated.Value(0)).current
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current

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
  }, [])

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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
