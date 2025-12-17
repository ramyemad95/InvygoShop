import { Car } from "@/types/car"
import { logger } from "@/utils/logger"
import { sanitizeSearchQuery, validateSearchQuery } from "@/utils/validation"

// Import JSON data with proper typing
// Using require with type assertion for Metro bundler compatibility
const carsData = require("../../data/cars.json") as Car[]

const ITEMS_PER_PAGE = 15

/**
 * Simulates fetching cars from an API with pagination
 * @param page - Page number (1-indexed)
 * @param searchQuery - Optional search string (matches name or brand)
 * @returns Promise with cars for the requested page and total count
 */
export const fetchCars = (
  page: number = 1,
  searchQuery: string = "",
): Promise<{ cars: Car[]; total: number; hasMore: boolean }> => {
  // Validate page number
  const validPage = Math.max(1, Math.floor(page))

  return new Promise((resolve) => {
    setTimeout(
      () => {
        // Validate and sanitize search query
        const validation = validateSearchQuery(searchQuery)
        if (!validation.isValid) {
          logger.warn("[API] Invalid search query:", validation.error)
        }
        const sanitizedQuery = sanitizeSearchQuery(searchQuery)

        // Convert image URLs to direct image URLs
        // Using picsum.photos with seed based on car name for variety
        const allCarsWithFixedImages: Car[] = carsData.map((car: Car, index: number) => {
          const seed = car.name.replace(/\s+/g, "").toLowerCase()
          return {
            ...car,
            main_image: `https://picsum.photos/seed/${seed}${index}/800/600`,
            secondary_images: car.secondary_images.map((_: string, imgIndex: number) => {
              return `https://picsum.photos/seed/${seed}${index}${imgIndex}/800/600`
            }),
          }
        })

        const normalizedQuery = sanitizedQuery.toLowerCase()
        const filteredCars =
          normalizedQuery.length > 0
            ? allCarsWithFixedImages.filter(
                (car) =>
                  car.name.toLowerCase().includes(normalizedQuery) ||
                  car.brand.toLowerCase().includes(normalizedQuery),
              )
            : allCarsWithFixedImages

        const startIndex = (validPage - 1) * ITEMS_PER_PAGE
        const endIndex = startIndex + ITEMS_PER_PAGE
        const paginatedCars = filteredCars.slice(startIndex, endIndex)
        const total = filteredCars.length
        const hasMore = endIndex < total

        logger.debug(
          `[API] Loading page ${validPage}: ${paginatedCars.length} items (${startIndex}-${endIndex - 1} of ${total})`,
        )

        resolve({
          cars: paginatedCars,
          total,
          hasMore,
        })
      },
      validPage === 1 ? 800 : 2000,
    ) // Simulate network delay: 800ms for initial load, 2s for pagination
  })
}
