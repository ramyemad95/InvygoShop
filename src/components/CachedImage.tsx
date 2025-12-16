import { useEffect, useState, type FC } from "react"
import { Image, ImageProps, ImageSourcePropType } from "react-native"

import { loadString, saveString } from "@/utils/storage"

const CACHE_TTL_MS = 24 * 60 * 60 * 1000 // 24 hours
const CACHE_KEY_PREFIX = "image_cache_"

interface CachedImageProps extends Omit<ImageProps, "source"> {
  source: { uri: string } | ImageSourcePropType
  cacheKey?: string
}

export const CachedImage: FC<CachedImageProps> = ({ source, cacheKey, ...props }) => {
  const [cachedUri, setCachedUri] = useState<string | null>(null)

  useEffect(() => {
    if (typeof source === "object" && "uri" in source && source.uri) {
      const uri = source.uri
      const key = cacheKey || uri
      const cacheKeyStr = `${CACHE_KEY_PREFIX}${key}`

      // Check if we have cached timestamp
      const cachedData = loadString(cacheKeyStr)
      const now = Date.now()

      if (cachedData) {
        try {
          const { lastFetchedAt } = JSON.parse(cachedData)
          const timeSinceFetch = now - lastFetchedAt

          if (timeSinceFetch < CACHE_TTL_MS) {
            // Cache is still valid, use original URI
            setCachedUri(uri)
            return
          }
        } catch {
          // Invalid cache data, continue to bust cache
        }
      }

      // Cache expired or doesn't exist, bust cache with timestamp
      const bustedUri = `${uri}${uri.includes("?") ? "&" : "?"}t=${now}`
      setCachedUri(bustedUri)

      // Update cache timestamp
      saveString(cacheKeyStr, JSON.stringify({ lastFetchedAt: now }))
    } else {
      // Static image source, no caching needed
      setCachedUri(null)
    }
  }, [source, cacheKey])

  if (cachedUri) {
    return <Image {...props} source={{ uri: cachedUri }} />
  }

  return <Image {...props} source={source} />
}
