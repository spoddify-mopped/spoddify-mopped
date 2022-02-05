module.exports = {
  coveragePathIgnorePatterns: [
    'src/entity',
    'src/__tests__/__helpers__',
    'dist',
  ],
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['src/__tests__/__helpers__', 'dist'],
};
