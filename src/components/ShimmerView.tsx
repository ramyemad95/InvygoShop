import React, { useEffect, useRef } from "react"
import { Animated, StyleSheet, View, ViewStyle, DimensionValue } from "react-native"
import { useAppTheme } from "@/theme/context"

interface ShimmerViewProps {
  width?: DimensionValue
  height?: DimensionValue
  style?: ViewStyle
  borderRadius?: number
}

export const ShimmerView: React.FC<ShimmerViewProps> = ({
  width = "100%",
  height = 20,
  style,
  borderRadius = 4,
}) => {
  const { theme } = useAppTheme()
  const shimmerAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start()
  }, [shimmerAnim])

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  })

  return (
    <View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: theme.colors.palette.neutral300,
          overflow: "hidden",
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: theme.colors.palette.neutral100,
            opacity,
          },
        ]}
      />
    </View>
  )
}

