import React from "react"
import { View, StyleSheet } from "react-native"
import { useWindowDimensions } from "react-native"
import { useAppTheme } from "@/theme/context"
import { ShimmerView } from "./ShimmerView"

export const CarListItemShimmer = () => {
  const { width } = useWindowDimensions()
  const { theme } = useAppTheme()
  const isTablet = width >= 768
  const itemWidth = isTablet ? width / 2 - 24 : width - 32

  return (
    <View
      style={[
        styles.container,
        {
          width: itemWidth,
          backgroundColor: theme.colors.palette.neutral100,
        },
      ]}
    >
      <ShimmerView width="100%" height={200} borderRadius={0} />
      <View style={styles.content}>
        <ShimmerView width="70%" height={20} style={styles.titleShimmer} />
        <ShimmerView width="40%" height={18} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
    marginHorizontal: 8,
  },
  content: {
    padding: 12,
  },
  titleShimmer: {
    marginBottom: 8,
  },
})

