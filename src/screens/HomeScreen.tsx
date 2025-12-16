import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  RefreshControl,
  FlatList,
  Animated,
} from "react-native"
import { useWindowDimensions } from "react-native"
import { useRouter } from "expo-router"
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Button } from "@/components/Button"
import { CachedImage } from "@/components/CachedImage"
import { CarListItemShimmer } from "@/components/CarListItemShimmer"
import { Icon } from "@/components/Icon"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { translate } from "@/i18n/translate"
import { useAppDispatch, useAppSelector } from "@/store"
import { loadCars, resetCars } from "@/store/slices/carsSlice"
import {
  setSearchQuery,
  toggleColor,
  setPriceRange,
  resetFilters,
} from "@/store/slices/filtersSlice"
import { useAppTheme } from "@/theme/context"
import { Car } from "@/types/car"
import { useDebounce } from "@/utils/useDebounce"

const CarListItem = memo(({ car, onPress }: { car: Car; onPress: () => void }) => {
  const { theme } = useAppTheme()
  const { width } = useWindowDimensions()
  const isTablet = width >= 768
  const itemWidth = isTablet ? width / 2 - 24 : width - 32

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.carItem,
        {
          width: itemWidth,
          backgroundColor: theme.colors.palette.neutral100,
        },
      ]}
    >
      <CachedImage source={{ uri: car.main_image }} style={styles.carImage} resizeMode="cover" />
      <View style={styles.carInfo}>
        <Text preset="subheading" text={`${car.brand} ${car.name}`} />
        <Text preset="formHelper" text={`$${car.price.toLocaleString()}`} style={styles.price} />
      </View>
    </Pressable>
  )
})

CarListItem.displayName = "CarListItem"

export const HomeScreen = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { theme } = useAppTheme()
  const { width } = useWindowDimensions()
  const insets = useSafeAreaInsets()
  const isTablet = width >= 768
  const contentPadding = useMemo(() => ({ paddingBottom: insets.bottom + 32 }), [insets.bottom])

  const { cars, loading, loadingMore, hasMore, total } = useAppSelector((state) => state.cars)
  const { searchQuery, selectedColors, priceRange } = useAppSelector((state) => state.filters)

  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery)
  const debouncedSearchQuery = useDebounce(localSearchQuery, 300)
  const [refreshing, setRefreshing] = useState(false)
  const [page, setPage] = useState(1)
  const pullAnim = useRef(new Animated.Value(0)).current
  const [, setPullDistance] = useState(0)

  // Debug: Log state changes
  useEffect(() => {
    console.log("[HomeScreen] 📈 State:", {
      carsCount: cars.length,
      loading,
      loadingMore,
      hasMore,
      total,
      page,
    })
  }, [cars.length, loading, loadingMore, hasMore, total, page])

  const bottomSheetRef = useRef<BottomSheet>(null)
  const snapPoints = useMemo(() => ["60%", "90%"], [])
  const [bottomSheetIndex, setBottomSheetIndex] = useState(-1)
  const isLoadingMoreRef = useRef(false)
  const hasScrolledRef = useRef(false)
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        opacity={0.8}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
      />
    ),
    [],
  )

  useEffect(() => {
    dispatch(resetCars())
    dispatch(loadCars({ page: 1, searchQuery }))
    setPage(1)
    isLoadingMoreRef.current = false
    hasScrolledRef.current = false
  }, [dispatch, searchQuery])

  useEffect(() => {
    dispatch(setSearchQuery(debouncedSearchQuery))
    dispatch(resetCars())
    dispatch(loadCars({ page: 1, searchQuery: debouncedSearchQuery }))
    setPage(1)
    isLoadingMoreRef.current = false
    hasScrolledRef.current = false
    // eslint-disable-next-line react-hooks/exhaustive-deps -- debouncedSearchQuery is the correct dependency, not searchQuery
  }, [debouncedSearchQuery, dispatch])

  const filteredCars = useMemo(() => {
    let filtered = cars

    // Search filter - search in both name and brand
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (car) => car.name.toLowerCase().includes(query) || car.brand.toLowerCase().includes(query),
      )
    }

    // Color filter
    if (selectedColors.length > 0) {
      filtered = filtered.filter((car) =>
        car.available_colors.some((color) => selectedColors.includes(color)),
      )
    }

    // Price range filter
    if (priceRange.min !== null) {
      filtered = filtered.filter((car) => car.price >= priceRange.min!)
    }
    if (priceRange.max !== null) {
      filtered = filtered.filter((car) => car.price <= priceRange.max!)
    }

    return filtered
  }, [cars, searchQuery, selectedColors, priceRange])

  // Filter cars (client-side filtering on already loaded cars)
  const paginatedCars = useMemo(() => {
    return filteredCars
  }, [filteredCars])

  const allColors = useMemo(() => {
    const colors = new Set<string>()
    cars.forEach((car) => {
      car.available_colors.forEach((color) => colors.add(color))
    })
    return Array.from(colors).sort()
  }, [cars])

  const [localMinPrice, setLocalMinPrice] = useState(priceRange.min?.toString() || "")
  const [localMaxPrice, setLocalMaxPrice] = useState(priceRange.max?.toString() || "")
  const placeholderItems = useMemo(
    () => Array.from({ length: 6 }, (_, i) => `placeholder-${i}`),
    [],
  )

  const handleCarPress = useCallback(
    (car: Car) => {
      router.push({
        pathname: "/car-details",
        params: { carId: `${car.brand} ${car.name}` },
      })
    },
    [router],
  )

  const handleApplyFilters = () => {
    dispatch(
      setPriceRange({
        min: localMinPrice ? Number(localMinPrice) : null,
        max: localMaxPrice ? Number(localMaxPrice) : null,
      }),
    )
    setPage(1) // Reset to first page when filters change
    bottomSheetRef.current?.close()
    setBottomSheetIndex(-1)
  }

  const handleResetFilters = () => {
    dispatch(resetFilters())
    setLocalMinPrice("")
    setLocalMaxPrice("")
    setLocalSearchQuery("")
    setPage(1)
    bottomSheetRef.current?.close()
    setBottomSheetIndex(-1)
  }

  const handleRefresh = useCallback(async () => {
    setRefreshing(true)
    setPage(1)
    hasScrolledRef.current = false
    try {
      dispatch(resetCars())
      await dispatch(loadCars({ page: 1, searchQuery })).unwrap()
    } catch (error) {
      console.error("Error refreshing cars:", error)
    } finally {
      setRefreshing(false)
    }
  }, [dispatch, searchQuery])

  const handleLoadMore = useCallback(async () => {
    console.log("[LoadMore] Called", {
      hasMore,
      loading,
      loadingMore,
      refreshing,
      page,
      isLoadingMore: isLoadingMoreRef.current,
    })
    if (!hasScrolledRef.current) {
      console.log("[LoadMore] Blocked - no user scroll yet")
      return
    }

    // Prevent multiple simultaneous loads
    if (isLoadingMoreRef.current || !hasMore || loading || loadingMore || refreshing) {
      console.log("[LoadMore] Blocked by guard")
      return
    }

    console.log("[LoadMore] Loading page", page + 1)
    isLoadingMoreRef.current = true
    const nextPage = page + 1
    setPage(nextPage)
    try {
      await dispatch(loadCars({ page: nextPage, searchQuery })).unwrap()
      console.log("[LoadMore] Successfully loaded page", nextPage)
      // Reset immediately after successful load
      isLoadingMoreRef.current = false
    } catch (error) {
      console.error("Error loading more cars:", error)
      setPage((prev) => prev - 1) // Revert page on error
      isLoadingMoreRef.current = false
    }
  }, [hasMore, loading, loadingMore, refreshing, page, dispatch, searchQuery])

  const handleFilterButtonPress = useCallback(() => {
    if (bottomSheetIndex === -1) {
      bottomSheetRef.current?.snapToIndex(1)
      setBottomSheetIndex(1)
    } else {
      bottomSheetRef.current?.close()
      setBottomSheetIndex(-1)
    }
  }, [bottomSheetIndex])

  const renderCarItem = useCallback(
    ({ item }: { item: Car }) => <CarListItem car={item} onPress={() => handleCarPress(item)} />,
    [handleCarPress],
  )

  return (
    <>
      <Screen preset="fixed" style={styles.container} contentContainerStyle={styles.screenContent}>
        <View style={styles.header}>
          <Text preset="heading" tx="homeScreen:title" style={styles.title} />
          <TouchableOpacity onPress={() => router.push("/settings")} style={styles.settingsButton}>
            <Icon icon="settings" size={24} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <TextField
            placeholder={translate("homeScreen:searchPlaceholder")}
            value={localSearchQuery}
            onChangeText={setLocalSearchQuery}
            containerStyle={styles.searchInput}
          />
          <TouchableOpacity
            onPress={handleFilterButtonPress}
            style={[styles.filterButton, { backgroundColor: theme.colors.palette.neutral300 }]}
          >
            <Icon icon="menu" size={20} />
            <Text tx="homeScreen:filters" style={styles.filterButtonText} />
          </TouchableOpacity>
        </View>
        <Animated.View
          style={[
            styles.pullIndicator,
            {
              opacity: pullAnim.interpolate({
                inputRange: [0, 20, 60],
                outputRange: [0, 0.3, 1],
                extrapolate: "clamp",
              }),
              transform: [
                {
                  translateY: pullAnim.interpolate({
                    inputRange: [0, 60],
                    outputRange: [10, 0],
                    extrapolate: "clamp",
                  }),
                },
                {
                  scale: pullAnim.interpolate({
                    inputRange: [0, 60, 100],
                    outputRange: [0.95, 1, 1.05],
                    extrapolate: "clamp",
                  }),
                },
              ],
            },
          ]}
        >
          <Text
            tx="homeScreen:pullToRefresh"
            preset="formHelper"
            style={styles.pullIndicatorText}
          />
        </Animated.View>

        {loading ? (
          <FlatList
            style={styles.list}
            data={placeholderItems}
            renderItem={() => <CarListItemShimmer />}
            keyExtractor={(item) => item}
            numColumns={isTablet ? 2 : 1}
            contentContainerStyle={[styles.listContent, contentPadding]}
          />
        ) : paginatedCars.length === 0 ? (
          <View style={[styles.centerContainer, contentPadding]}>
            <Text tx="homeScreen:noCarsFound" />
          </View>
        ) : (
          <FlatList<Car>
            style={styles.list}
            data={paginatedCars}
            renderItem={renderCarItem}
            keyExtractor={(item: Car) => `${item.brand}-${item.name}`}
            numColumns={isTablet ? 2 : 1}
            contentContainerStyle={[styles.listContent, contentPadding]}
            onEndReached={() => {
              console.log("[FlatList] onEndReached fired")
              handleLoadMore()
            }}
            onEndReachedThreshold={0.3}
            onScroll={(event) => {
              const offsetY = event.nativeEvent.contentOffset.y
              // Track pull distance for animated hint (negative offset means pull-down)
              const pullDistanceValue = Math.max(-offsetY, 0)
              setPullDistance(pullDistanceValue)
              pullAnim.setValue(Math.min(pullDistanceValue, 120))

              if (offsetY > 40 && !hasScrolledRef.current) {
                hasScrolledRef.current = true
                console.log("[FlatList] Scroll detected, enabling load more")
              }
            }}
            onMomentumScrollBegin={() => {
              if (!hasScrolledRef.current) {
                hasScrolledRef.current = true
                console.log("[FlatList] Momentum scroll detected, enabling load more")
              }
            }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                title={translate("homeScreen:pullToRefresh")}
                titleColor={theme.colors.palette.primary500}
                tintColor={theme.colors.palette.primary500}
                colors={[theme.colors.palette.primary500]}
              />
            }
            ListFooterComponent={
              hasMore && loadingMore ? (
                <View style={styles.loadingFooter}>
                  {Array.from({ length: 2 }).map((_, index) => (
                    <CarListItemShimmer key={`footer-${index}`} />
                  ))}
                </View>
              ) : null
            }
          />
        )}
      </Screen>

      <BottomSheet
        ref={bottomSheetRef}
        index={bottomSheetIndex}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        enablePanDownToClose
        onChange={(index) => setBottomSheetIndex(index)}
        backgroundStyle={{ backgroundColor: theme.colors.background }}
        android_keyboardInputMode="adjustResize"
      >
        <BottomSheetView style={[styles.bottomSheetContent, { paddingBottom: insets.bottom + 16 }]}>
          <Text preset="heading" tx="homeScreen:filters" style={styles.filterTitle} />

          <View style={styles.filterSection}>
            <Text
              preset="subheading"
              tx="homeScreen:priceRange"
              style={styles.filterSectionTitle}
            />
            <View style={styles.priceInputs}>
              <TextField
                placeholder={translate("homeScreen:minPrice")}
                value={localMinPrice}
                onChangeText={setLocalMinPrice}
                keyboardType="numeric"
                containerStyle={styles.priceInput}
              />
              <TextField
                placeholder={translate("homeScreen:maxPrice")}
                value={localMaxPrice}
                onChangeText={setLocalMaxPrice}
                keyboardType="numeric"
                containerStyle={styles.priceInput}
              />
            </View>
          </View>

          <View style={styles.filterSection}>
            <Text preset="subheading" tx="homeScreen:colors" style={styles.filterSectionTitle} />
            <View style={styles.colorChips}>
              {allColors.map((color) => (
                <TouchableOpacity
                  key={color}
                  onPress={() => dispatch(toggleColor(color))}
                  style={[
                    styles.colorChip,
                    {
                      backgroundColor: selectedColors.includes(color)
                        ? theme.colors.palette.primary500
                        : theme.colors.palette.neutral300,
                    },
                  ]}
                >
                  <Text
                    text={color}
                    style={[
                      styles.colorChipText,
                      {
                        color: selectedColors.includes(color)
                          ? theme.colors.palette.neutral100
                          : theme.colors.text,
                      },
                    ]}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.filterActions}>
            <Button
              tx="homeScreen:reset"
              onPress={handleResetFilters}
              style={styles.filterButton}
            />
            <Button
              tx="homeScreen:apply"
              preset="filled"
              onPress={handleApplyFilters}
              style={styles.filterButton}
            />
          </View>
        </BottomSheetView>
      </BottomSheet>
    </>
  )
}

const styles = StyleSheet.create({
  bottomSheetContent: {
    flex: 1,
    padding: 16,
  },
  carImage: {
    height: 200,
    width: "100%",
  },
  carInfo: {
    padding: 12,
  },
  carItem: {
    borderRadius: 12,
    marginBottom: 16,
    marginHorizontal: 8,
    overflow: "hidden",
  },
  centerContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: 32,
  },
  colorChip: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  colorChipText: {
    fontSize: 14,
  },
  colorChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  container: {
    flex: 1,
  },
  filterActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: "auto",
  },
  filterButton: {
    alignItems: "center",
    borderRadius: 8,
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterButtonText: {
    fontSize: 14,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    marginBottom: 12,
  },
  filterTitle: {
    marginBottom: 24,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  list: {
    flex: 1,
  },
  listContent: {
    alignItems: "center",
    padding: 16,
  },
  loadingFooter: {
    padding: 16,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 4,
  },
  priceInput: {
    flex: 1,
  },
  priceInputs: {
    flexDirection: "row",
    gap: 12,
  },
  pullIndicator: {
    alignItems: "center",
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
  pullIndicatorText: {
    textAlign: "center",
  },
  screenContent: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    gap: 12,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  searchInput: {
    flex: 1,
  },
  settingsButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
})
