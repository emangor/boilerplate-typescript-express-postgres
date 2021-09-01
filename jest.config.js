module.exports = {
    clearMocks: true,
    roots: ['<rootDir>/src/', '<rootDir>/tests/'],
    testEnvironment: 'node',
    preset: 'ts-jest',
    collectCoverage: true,
    collectCoverageFrom: [
        "**/*.{js,ts}",
        "!**/node_modules/**",
        "!**/build/**"
    ],
    coverageReporters: ["text"]
};