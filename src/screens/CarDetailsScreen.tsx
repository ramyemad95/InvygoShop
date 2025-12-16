import React, { useCallback, useMemo, useState, useEffect, useRef } from "react"
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Animated } from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import { useAppTheme } from "@/theme/context"
import { useAppSelector } from "@/store"
import { Car } from "@/types/car"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Button } from "@/components/Button"
import { Icon } from "@/components/Icon"
import { CachedImage } from "@/components/CachedImage"
import { CheckoutModal } from "@/components/CheckoutModal"
import { SuccessModal } from "@/components/SuccessModal"

const { width: SCREEN_WIDTH } = Dimensions.get("window")

export const CarDetailsScreen = () => {
  const router = useRouter()
  const { carId } = useLocalSearchParams<{ carId: string }>()
  const { theme } = useAppTheme()
  const { cars } = useAppSelector((state) => state.cars)

  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [showCheckout, setShowCheckout] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [scrollX, setScrollX] = useState(0)

  const car = useMemo(() => {
    if (!carId) return undefined
    // Decode the carId (it's URL encoded)
    const decodedCarId = decodeURIComponent(carId)
    return cars.find((c) => `${c.brand} ${c.name}` === decodedCarId || c.name === decodedCarId)
  }, [cars, carId])

  const allImages = useMemo(() => {
    if (!car) return []
    return [car.main_image, ...car.secondary_images]
  }, [car])

  const currentImageIndex = useMemo(() => {
    if (allImages.length === 0) return 0
    return Math.round(scrollX / SCREEN_WIDTH)
  }, [scrollX, allImages.length])

  const handleBuyPress = () => {
    if (!selectedColor) {
      // Show error or highlight color selection
      return
    }
    setShowCheckout(true)
  }

  const handleCheckoutConfirm = () => {
    setShowCheckout(false)
    // Show loading for 2 seconds before showing success
    setTimeout(() => {
      setShowSuccess(true)
    }, 2000)
  }

  const handleSuccessClose = () => {
    setShowSuccess(false)
    // Reset navigation stack to Home
    router.replace("/home")
  }

  if (!car) {
    return (
      <Screen>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Icon icon="back" size={24} />
          </TouchableOpacity>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.centerContainer}>
          <Text text="Car not found" />
        </View>
      </Screen>
    )
  }

  return (
    <Screen preset="scroll">
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon icon="back" size={24} />
        </TouchableOpacity>
        <View style={styles.placeholder} />
      </View>
      <View style={styles.imageContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={(e) => setScrollX(e.nativeEvent.contentOffset.x)}
          scrollEventThrottle={16}
        >
          {allImages.map((image, index) => (
            <CachedImage
              key={index}
              source={{ uri: image }}
              style={[styles.image, { width: SCREEN_WIDTH }]}
              resizeMode="cover"
            />
          ))}
        </ScrollView>
        {allImages.length > 1 && (
          <View style={styles.imageIndicators}>
            {allImages.map((_, index) => {
              const isActive = index === currentImageIndex
              return (
                <Animated.View
                  key={index}
                  style={[
                    styles.indicator,
                    {
                      backgroundColor: isActive
                        ? theme.colors.palette.neutral100
                        : theme.colors.palette.neutral400,
                      width: isActive ? 24 : 8,
                      opacity: isActive ? 1 : 0.5,
                    },
                  ]}
                />
              )
            })}
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text preset="heading" text={`${car.brand} ${car.name}`} style={styles.title} />
        <Text preset="subheading" text={`$${car.price.toLocaleString()}`} style={styles.price} />
        <Text
          preset="formHelper"
          text={`Rent: $${car.rent_price_per_day}/day`}
          style={styles.rentPrice}
        />

        <View style={styles.specsContainer}>
          <Text preset="formLabel" text="Specs:" />
          <Text text={car.specs} style={styles.specsValue} />
        </View>

        <View style={styles.colorsContainer}>
          <Text preset="formLabel" text="Available Colors:" style={styles.colorsTitle} />
          <View style={styles.colorChips}>
            {car.available_colors.map((color) => (
              <Button
                key={color}
                text={color}
                preset={selectedColor === color ? "filled" : "default"}
                onPress={() => setSelectedColor(color)}
                style={styles.colorChip}
              />
            ))}
          </View>
          {!selectedColor && (
            <Text preset="formHelper" text="Please select a color" style={styles.errorText} />
          )}
        </View>

        <Button
          text="Buy Now"
          preset="filled"
          onPress={handleBuyPress}
          disabled={!selectedColor}
          style={styles.buyButton}
        />
      </View>

      <CheckoutModal
        visible={showCheckout}
        car={car}
        selectedColor={selectedColor!}
        onConfirm={handleCheckoutConfirm}
        onClose={() => setShowCheckout(false)}
      />

      <SuccessModal visible={showSuccess} onClose={handleSuccessClose} />
    </Screen>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  backButton: {
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 20,
  },
  placeholder: {
    width: 40,
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    height: 300,
  },
  imageIndicators: {
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  indicator: {
    height: 8,
    borderRadius: 4,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  price: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
  },
  rentPrice: {
    fontSize: 16,
    marginBottom: 16,
  },
  specsContainer: {
    marginBottom: 16,
  },
  specsValue: {
    fontSize: 16,
    textTransform: "capitalize",
    marginTop: 4,
  },
  colorsContainer: {
    marginBottom: 24,
  },
  colorsTitle: {
    marginBottom: 12,
  },
  colorChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  colorChip: {
    minWidth: 80,
  },
  errorText: {
    color: "red",
  },
  buyButton: {
    marginTop: 8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
})

