/** @type {import('@jest/types').Config.ProjectConfig} */
module.exports = {
  preset: "jest-expo",
  setupFiles: ["<rootDir>/test/setup.ts"],
  collectCoverage: true,
  collectCoverageFrom: [
    "<rootDir>/src/api/**/*.{ts,tsx}",
    "<rootDir>/src/store/**/*.{ts,tsx}",
    "<rootDir>/src/utils/**/*.{ts,tsx}",
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "<rootDir>/src/devtools/",
    "<rootDir>/src/i18n/",
    "<rootDir>/src/config/",
    "<rootDir>/src/screens/",
    "<rootDir>/src/app/",
    "<rootDir>/src/utils/gestureHandler.ts",
    "<rootDir>/src/utils/gestureHandler.native.ts",
    "<rootDir>/src/utils/useHeader.tsx",
    "<rootDir>/src/utils/formatDate.ts",
    "<rootDir>/src/utils/useSafeAreaInsetsStyle.ts",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(jest-)?react-native|@react-native|react-clone-referenced-element|@react-navigation|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|@unimodules/.*|@react-native-community/.*|@react-native-js/.*|@shopify/flash-list|@gorhom/bottom-sheet|react-redux|@reduxjs/toolkit|immer)",
  ],
}
