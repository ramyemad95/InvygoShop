# InvygoShop 🚗

A modern, cross-platform car shopping application built with React Native and Expo. Browse, search, filter, and purchase cars with an intuitive and beautiful user interface.

## 📱 Features

- **Car Browsing**: Browse through a catalog of cars with pagination support
- **Search**: Real-time search functionality with debounced input
- **Advanced Filtering**: Filter cars by price range and available colors
- **Car Details**: View detailed information, multiple images, and specifications
- **Checkout Flow**: Complete purchase flow with payment form validation
- **Dark Mode**: Full support for light and dark themes
- **Internationalization**: Support for English and Arabic (RTL)
- **Image Caching**: Optimized image loading with caching
- **Responsive Design**: Tablet and phone layouts
- **Pull to Refresh**: Refresh car listings with pull-to-refresh gesture
- **Error Handling**: Comprehensive error boundaries and user-friendly error messages

## 📸 Screenshots

<div align="center">
  <img src="screenshots/Simulator Screenshot - iPhone 16 Pro Max - 2025-12-17 at 14.18.03.png" width="200" alt="Screenshot 1" />
  <img src="screenshots/Simulator Screenshot - iPhone 16 Pro Max - 2025-12-17 at 14.18.06.png" width="200" alt="Screenshot 2" />
  <img src="screenshots/Simulator Screenshot - iPhone 16 Pro Max - 2025-12-17 at 14.18.11.png" width="200" alt="Screenshot 3" />
  <img src="screenshots/Simulator Screenshot - iPhone 16 Pro Max - 2025-12-17 at 14.18.13.png" width="200" alt="Screenshot 4" />
  <img src="screenshots/Simulator Screenshot - iPhone 16 Pro Max - 2025-12-17 at 14.18.21.png" width="200" alt="Screenshot 5" />
  <img src="screenshots/Simulator Screenshot - iPhone 16 Pro Max - 2025-12-17 at 14.18.24.png" width="200" alt="Screenshot 6" />
  <img src="screenshots/Simulator Screenshot - iPhone 16 Pro Max - 2025-12-17 at 14.18.34.png" width="200" alt="Screenshot 7" />
  <img src="screenshots/Simulator Screenshot - iPhone 16 Pro Max - 2025-12-17 at 14.19.10.png" width="200" alt="Screenshot 8" />
  <img src="screenshots/Simulator Screenshot - iPhone 16 Pro Max - 2025-12-17 at 14.19.37.png" width="200" alt="Screenshot 9" />
  <img src="screenshots/Simulator Screenshot - iPhone 16 Pro Max - 2025-12-17 at 14.19.43.png" width="200" alt="Screenshot 10" />
  <img src="screenshots/Simulator Screenshot - iPhone 16 Pro Max - 2025-12-17 at 14.19.47.png" width="200" alt="Screenshot 11" />
  <img src="screenshots/Simulator Screenshot - iPhone 16 Pro Max - 2025-12-17 at 14.19.49.png" width="200" alt="Screenshot 12" />
  <img src="screenshots/Simulator Screenshot - iPhone 16 Pro Max - 2025-12-17 at 14.19.52.png" width="200" alt="Screenshot 13" />
</div>

## 🛠 Tech Stack

- **Framework**: React Native 0.81.5 with Expo SDK 54
- **Navigation**: Expo Router (file-based routing)
- **State Management**: Redux Toolkit
- **UI Components**: Custom component library with theme support
- **Internationalization**: i18next with react-i18next
- **Image Handling**: Custom CachedImage component
- **Animations**: React Native Reanimated
- **Storage**: MMKV for fast, synchronous storage
- **Testing**: Jest with React Native Testing Library
- **E2E Testing**: Maestro
- **CI/CD**: GitHub Actions
- **Code Quality**: ESLint, Prettier, TypeScript

## 📋 Prerequisites

- Node.js >= 20.0.0
- npm or yarn
- iOS Simulator (for iOS development) or Android Emulator (for Android development)
- Expo CLI (optional, but recommended)
- EAS CLI (for building production apps)

## 🚀 Getting Started

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd InvygoShop
```

2. Install dependencies:

```bash
npm install --legacy-peer-deps
```

### Running the App

#### Development Mode

Start the Expo development server:

```bash
npm run start
```

Then:

- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your device

#### Platform-Specific Commands

```bash
# iOS Simulator
npm run ios

# Android Emulator
npm run android

# Web Browser
npm run web
```

### Building for Production

#### iOS

```bash
# Simulator build
npm run build:ios:sim

# Device build (development)
npm run build:ios:device

# Production build
npm run build:ios:prod
```

#### Android

```bash
# Simulator build
npm run build:android:sim

# Device build (development)
npm run build:android:device

# Production build
npm run build:android:prod
```

## 📁 Project Structure

```
InvygoShop/
├── src/
│   ├── api/              # API client and car data fetching
│   ├── app/              # Expo Router routes (file-based routing)
│   ├── components/       # Reusable UI components
│   ├── config/           # Environment configurations
│   ├── devtools/         # Reactotron configuration
│   ├── i18n/             # Internationalization files
│   ├── screens/          # Screen components
│   ├── services/         # API service layer
│   ├── store/            # Redux store and slices
│   ├── theme/            # Theme configuration and context
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions and hooks
├── assets/              # Images, icons, and other assets
├── data/                # Static data (cars.json)
├── test/                # Test configuration
└── .maestro/            # E2E test flows
```

## 🏗 Architecture

### State Management

The app uses Redux Toolkit for state management with three main slices:

- **carsSlice**: Manages car data, loading states, and pagination
- **filtersSlice**: Handles search queries, color filters, and price range filters
- **uiSlice**: Manages theme preferences and language settings

### Navigation

File-based routing with Expo Router:

- `/` - Splash screen
- `/home` - Main car listing screen
- `/car-details` - Car detail view
- `/settings` - App settings

### Component Architecture

- **Screen Components**: Top-level screen components (`HomeScreen`, `CarDetailsScreen`, etc.)
- **UI Components**: Reusable components (`Button`, `TextField`, `Card`, etc.)
- **Layout Components**: Layout wrappers (`Screen`, `Header`, etc.)

### API Layer

The app uses a simulated API (`carsApi.ts`) that:

- Simulates network delays
- Provides pagination support
- Supports search functionality
- Returns car data with image URLs

## 🧪 Testing

### Unit Tests

Run unit tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

### E2E Tests

Run Maestro E2E tests:

```bash
npm run test:maestro
```

### Code Quality

```bash
# Lint code
npm run lint

# Check linting without fixing
npm run lint:check

# Type check
npm run compile

# Dependency analysis
npm run depcruise
```

## 🎨 Theming

The app supports both light and dark themes with:

- Dynamic color schemes
- Typography system
- Spacing system
- Theme-aware components

Users can toggle themes in the Settings screen.

## 🌍 Internationalization

Currently supports:

- English (en)
- Arabic (ar) with RTL support

Translation files are located in `src/i18n/`. To add a new language:

1. Create a new translation file (e.g., `fr.ts`)
2. Add translations following the existing structure
3. Update `src/i18n/index.ts` to include the new language

## 📦 Available Scripts

- `npm start` - Start Expo development server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run web` - Run in web browser
- `npm test` - Run tests
- `npm run lint` - Lint and fix code
- `npm run compile` - Type check TypeScript
- `npm run build:ios:sim` - Build for iOS simulator
- `npm run build:ios:device` - Build for iOS device (development)
- `npm run build:ios:prod` - Build for iOS production
- `npm run build:android:sim` - Build for Android emulator
- `npm run build:android:device` - Build for Android device (development)
- `npm run build:android:prod` - Build for Android production

## 🔧 Configuration

### Environment Variables

The app uses environment-specific configurations:

- `config.base.ts` - Base configuration
- `config.dev.ts` - Development configuration
- `config.prod.ts` - Production configuration

### App Configuration

Main app configuration is in `app.json` and `app.config.ts`:

- App name, version, and bundle identifiers
- Platform-specific settings
- Plugins and permissions

## 🐛 Debugging

### Reactotron

In development mode, Reactotron is available for:

- Redux state inspection
- Network request monitoring
- Logging and debugging

### Error Boundaries

The app includes error boundaries to catch and display React errors gracefully.

## 📱 Platform Support

- ✅ iOS (Simulator and Device)
- ✅ Android (Emulator and Device)
- ✅ Web (with limitations)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow the existing code style
- Use TypeScript for all new code
- Write tests for new features
- Update documentation as needed

## 🙏 Acknowledgments

- Built with [Ignite](https://github.com/infinitered/ignite) boilerplate
- Uses [Expo](https://expo.dev/) for React Native development
- Icons and images from various sources


Made by Ramy Mehanna
