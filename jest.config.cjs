module.exports = {
  bail: 1,
  verbose: true,
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
  rootDir: ".",
  moduleFileExtensions: ["js"],
  testMatch: [`<rootDir>/tests/*spec.js`],
  testEnvironment: "node",
  setupFilesAfterEnv: ["jest-extended/all"],
  testTimeout: 30000,
};
