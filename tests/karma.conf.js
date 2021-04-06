module.exports = function (config) {
    config.set({

        basePath: '../',
        frameworks: ['jasmine'],

        files: [
            { pattern: 'src/**/*.js', type: 'module', included: false },
            { pattern: 'tests/spec/*.tests.js', type: 'module' }
        ],

        exclude: [
            "src/common/popup.js",
            "src/chrome/background.js"
        ],

        preprocessors: {
            'src/**/*.js': ['coverage']
        },

        coverageReporter: {
            type: 'html',
            dir: 'tests/coverage/'
        },

        reporters: ['progress', 'verbose', 'coverage'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['ChromeHeadless'],
        singleRun: true,
        concurrency: Infinity
        
    })
}