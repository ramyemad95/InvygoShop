import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from "axios"
import { store } from "@/store"

const API_TIMEOUT = 10000

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: "https://api.example.com", // Mock API base URL
      timeout: API_TIMEOUT,
      headers: {
        "Content-Type": "application/json",
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const state = store.getState()
        const language = state.ui.language

        // Attach language header
        if (config.headers) {
          config.headers["Accept-Language"] = language
        }

        return config
      },
      (error) => {
        return Promise.reject(error)
      },
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response
      },
      (error) => {
        // Normalize errors
        if (error.response) {
          // Server responded with error status
          const message = error.response.data?.message || error.message || "An error occurred"
          return Promise.reject(new Error(message))
        } else if (error.request) {
          // Request made but no response received
          return Promise.reject(new Error("Network error. Please check your connection."))
        } else {
          // Something else happened
          return Promise.reject(error)
        }
      },
    )
  }

  get instance(): AxiosInstance {
    return this.client
  }
}

export const apiClient = new ApiClient()

