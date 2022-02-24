module.exports = {
  collectCoverageFrom: ['src/**/*.ts'],
  coveragePathIgnorePatterns: ['src/db', 'src/__tests__/__helpers__'],
  preset: 'ts-jest',
  testEnvironment: 'node',
};
