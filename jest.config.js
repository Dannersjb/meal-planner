module.exports = {
  preset: "jest-expo",
  transformIgnorePatterns: [
    // Ignore everything in node_modules except these packages (transform these)
    "node_modules/(?!(jest-)?react-native|@react-native|@react-native-js-polyfills|@react-native-community|@expo|expo|@unimodules|expo-modules-core)/",
  ],
  setupFiles: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jsdom",
};
