module.exports = {
  "rules": {
    // Specific rules for test files
    "import/no-extraneous-dependencies": [0, { "devDependencies": true }],
    "no-unused-vars": [0, { "varsIgnorePattern": 'should' }]
  }
}
