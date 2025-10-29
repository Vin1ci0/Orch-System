{
  "testEnvironment": "node",
  "testMatch": ["**/__tests__/**/*.test.js"],
  "collectCoverageFrom": [
    "src/**/*.js",
    "!src/database/migrations/**",
    "!src/database/seeders/**"
  ],
  "coverageDirectory": "__tests__/coverage",
  "setupFilesAfterEnv": ["<rootDir>/__tests__/setup.js"]
}