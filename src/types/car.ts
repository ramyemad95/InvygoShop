export type CarSpecs = "solo" | "couple" | "family" | "business" | "offroad"

export interface Car {
  brand: string
  name: string
  price: number
  main_image: string
  secondary_images: string[]
  specs: CarSpecs
  rent_price_per_day: number
  available_colors: string[]
}
