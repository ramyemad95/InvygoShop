import { useMemo, useState } from "react"
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Animated } from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"

import { Button } from "@/components/Button"
import { CachedImage } from "@/components/CachedImage"
import { CheckoutModal } from "@/components/CheckoutModal"
import { Icon } from "@/components/Icon"
import { Screen } from "@/components/Screen"
import { SuccessModal } from "@/components/SuccessModal"
import { Text } from "@/components/Text"
import { useAppSelector } from "@/store"
import { useAppTheme } from "@/theme/context"

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
        <View style={[styles.header, { backgroundColor: theme.colors.palette.overlay50 }]}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.backButton, { backgroundColor: theme.colors.palette.neutral100 + "E6" }]}
          >
            <Icon icon="back" size={24} />
          </TouchableOpacity>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.centerContainer}>
          <Text tx="carDetailsScreen:carNotFound" />
        </View>
      </Screen>
    )
  }

  return (
    <Screen preset="scroll">
      <View style={[styles.header, { backgroundColor: theme.colors.palette.overlay50 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backButton, { backgroundColor: theme.colors.palette.neutral100 + "E6" }]}
        >
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
                    isActive ? styles.indicatorActive : styles.indicatorInactive,
                    {
                      backgroundColor: isActive
                        ? theme.colors.palette.neutral900
                        : theme.colors.palette.neutral400,
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
          tx="carDetailsScreen:rentPerDay"
          txOptions={{ price: car.rent_price_per_day }}
          style={styles.rentPrice}
        />

        <View style={styles.specsContainer}>
          <Text preset="formLabel" tx="carDetailsScreen:specs" />
          <Text text={car.specs} style={styles.specsValue} />
        </View>

        <View style={styles.colorsContainer}>
          <Text
            preset="formLabel"
            tx="carDetailsScreen:availableColors"
            style={styles.colorsTitle}
          />
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
            <Text
              preset="formHelper"
              tx="carDetailsScreen:selectColor"
              style={[styles.errorText, { color: theme.colors.error }]}
            />
          )}
        </View>

        <Button
          tx="carDetailsScreen:buyNow"
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
  backButton: {
    borderRadius: 20,
    padding: 8,
  },
  buyButton: {
    marginTop: 8,
  },
  centerContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: 32,
  },
  colorChip: {
    minWidth: 80,
  },
  colorChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  colorsContainer: {
    marginBottom: 24,
  },
  colorsTitle: {
    marginBottom: 12,
  },
  content: {
    padding: 16,
  },
  errorText: {
    color: undefined, // Will be set dynamically
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    left: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 10,
  },
  image: {
    height: 300,
  },
  imageContainer: {
    position: "relative",
  },
  imageIndicators: {
    alignItems: "center",
    bottom: 16,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
  },
  indicator: {
    borderRadius: 4,
    height: 8,
    marginHorizontal: 4,
    width: 8,
  },
  indicatorActive: {
    opacity: 1,
  },
  indicatorInactive: {
    opacity: 0.5,
  },
  placeholder: {
    width: 40,
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
    marginTop: 4,
    textTransform: "capitalize",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
})
