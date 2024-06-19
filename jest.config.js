
module.exports = {
    testEnvironment: 'node', // Ensures Jest is set up to test Node.js applications
    verbose: true, // Provides detailed test results
    testTimeout: 30000, // Increases the default test timeout (optional)
    coverageDirectory: './coverage', // Directory to store test coverage reports
    coverageReporters: ['json', 'lcov', 'text', 'clover'], // Formats for coverage reports
  };
  