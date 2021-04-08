# Header Inject

[![Unit tests](https://github.com/jg23497/Header-Inject/actions/workflows/node.js.yml/badge.svg?branch=master)](https://github.com/jg23497/Header-Inject/actions/workflows/node.js.yml)

A Chrome extension for injecting HTTP request headers. Simply.

![Header Inject in action](doc/images/header-configured.png)


## Test

Header Inject relies on the [Jasmine](https://jasmine.github.io) unit testing framework. Assuming [Python 3](https://www.python.org) is installed, you can run the unit tests in your favourite browser:

```
python run-tests-in-browser.py
``` 

Or use the [Karma](https://karma-runner.github.io) test runner, assuming [Node.js](https://nodejs.org/en/) is installed:

```
cd tests
npm i
karma start
```

Karma is configured to produce a unit test coverage report. After a test run completes, the report will be available at `tests/coverage`.

## Publish


On Windows:

```
"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --pack-extension=<path>\HeaderInject\src
```
