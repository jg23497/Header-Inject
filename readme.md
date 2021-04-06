# Header Inject

A Chrome extension for injecting HTTP request headers. Simply.

![Header Inject in action](doc/images/header-configured.png)


## Test

Header Inject relies on the Jasmine unit testing framework. Assuming Python 3 is installed, you can run the unit tests in your favourite browser:

```
python run-tests-in-browser.py
``` 

Or use the Karma test runner, assuming Node.js is installed:

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