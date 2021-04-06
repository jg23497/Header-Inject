import * as Constants from "../../src/common/constants.js"
import Injector from "../../src/common/injector.js"

describe("Injector", () => {

    const booleanTestCases = [
        {
            value: true
        },
        {
            value: false
        }
    ];

    const missingValueTestCases = [
        {
            value: null
        },
        {
            value: undefined
        }
    ];

    function getHeaderOverrides() {
        return [
            {
                name: "foo",
                value: "test",
                enabled: true
            },
            {
                name: "bar",
                value: "123",
                enabled: false
            }
        ];
    }

    function getRequest() {
        return {
            requestHeaders: [
                {
                    name: "FOO",
                    value: "abc"
                },
                {
                    name: "Another",
                    value: "value"
                }
            ]
        };
    }

    describe("handleStatusChange", () => {

        var configurationMock;

        beforeEach(() => {
            configurationMock = jasmine.createSpyObj("storage", [
                "setEnabled",
                "getEnabled"
            ]);
        });

        it("should set IsEnabled configuration value to true when existing status is false", () => {
            // Arrange
            var runtime = null;
            var injector = new Injector(configurationMock, runtime);

            // Act
            injector.handleStatusChange(false, false);

            // Assert
            expect(configurationMock.setEnabled).toHaveBeenCalledWith(true);
            expect(configurationMock.setEnabled.calls.count()).toEqual(1);
        });

        it("should set IsEnabled configuration value to false when existing status is true", () => {
            // Arrange
            var runtime = null;
            var injector = new Injector(configurationMock, runtime);

            // Act
            injector.handleStatusChange(true, false);

            // Assert
            expect(configurationMock.setEnabled).toHaveBeenCalledWith(false);
            expect(configurationMock.setEnabled.calls.count()).toEqual(1);
        });

        it("should send redraw message when sourceContextMenu is true", () => {
            // Arrange
            var runtime = jasmine.createSpyObj("runtime", ["sendMessage"]);
            var injector = new Injector(configurationMock, runtime);

            // Act
            injector.handleStatusChange(true, true);

            // Assert
            expect(runtime.sendMessage).toHaveBeenCalledWith({ command: Constants.Messaging.Commands.Redraw });
            expect(runtime.sendMessage.calls.count()).toEqual(1);
        });

        it("should not send redraw message when sourceContextMenu is false", () => {
            // Arrange
            var runtime = jasmine.createSpyObj("runtime", ["sendMessage"]);
            var injector = new Injector(configurationMock, runtime);

            // Act
            injector.handleStatusChange(true, false);

            // Assert
            expect(runtime.sendMessage).not.toHaveBeenCalled();
        });

    });

    describe("run", () => {

        var configurationMock;
        var runtimeMock;

        var onChangeEnabledCallback;
        var addContextMenuItemCallback;
        var getEnabledCallback;
        var getOnChangeCallback;
        var getHttpHeaderOverridesCallback;
        var addBeforeSendHeadersCallback;

        beforeEach(() => {
            configurationMock = jasmine.createSpyObj("storage", [
                "setEnabled",
                "getEnabled",
                "onChangeEnabled",
                "getOnChange",
                "getHttpHeaderOverrides"
            ]);

            runtimeMock = jasmine.createSpyObj("runtime", [
                "clearContextMenu",
                "addContextMenuItem",
                "sendMessage",
                "removeBeforeSendHeadersCallback",
                "addBeforeSendHeadersCallback"
            ]);

            configurationMock.onChangeEnabled.and.callFake(function (callback) {
                onChangeEnabledCallback = callback;
            });

            configurationMock.getEnabled.and.callFake((callback) => {
                getEnabledCallback = callback;
            });

            runtimeMock.addContextMenuItem.and.callFake(function (title, callback) {
                addContextMenuItemCallback = callback;
            });

            configurationMock.getHttpHeaderOverrides.and.callFake((callback) => {
                getHttpHeaderOverridesCallback = callback;
            });

            runtimeMock.addBeforeSendHeadersCallback.and.callFake((callback) => {
                addBeforeSendHeadersCallback = callback;
            });

            configurationMock.getOnChange.and.callFake((target, keys, callback) => {
                getOnChangeCallback = callback;
            });
        });

        it("should not clear send headers callback when requestHeaderHandleListener is not already configured", () => {
            // Arrange
            var injector = new Injector(configurationMock, runtimeMock);
            // Act
            injector.run();
            // Assert
            expect(runtimeMock.removeBeforeSendHeadersCallback).not.toHaveBeenCalled();
        });

        describe("onChangeEnabled", () => {

            it("should update context menu status entry with 'Disable' when enabled value is true", () => {
                // Arrange
                var injector = new Injector(configurationMock, runtimeMock);
                injector.run();
                // Act
                onChangeEnabledCallback(true);
                // Assert
                expect(runtimeMock.clearContextMenu).toHaveBeenCalled();
                expect(runtimeMock.addContextMenuItem).toHaveBeenCalledWith("Disable", jasmine.any(Function));
            });

            it("should update context menu status entry with 'Enable' when enabled value is false", () => {
                // Arrange
                var injector = new Injector(configurationMock, runtimeMock);
                injector.run();
                // Act
                onChangeEnabledCallback(false);
                // Assert
                expect(runtimeMock.clearContextMenu).toHaveBeenCalled();
                expect(runtimeMock.addContextMenuItem).toHaveBeenCalledWith("Enable", jasmine.any(Function));
            });

        });

        describe("addContextMenuItemCallback", () => {

            booleanTestCases.forEach(test => {
                it(`should call handleStatusChange with isEnabled value of '${test.value}' when enabled value is '${test.value}'`, () => {
                    // Arrange
                    var injector = new Injector(configurationMock, runtimeMock);
                    spyOn(injector, "handleStatusChange");
                    injector.run();
                    onChangeEnabledCallback(test.value);
                    // Act
                    addContextMenuItemCallback();
                    // Assert
                    expect(runtimeMock.clearContextMenu).toHaveBeenCalled();
                    expect(injector.handleStatusChange).toHaveBeenCalledWith(test.value, true);
                });
            });

        });

        describe("getEnabledCallback", () => {

            it("should set header overriding callback when injection is enabled", () => {
                // Arrange
                var injector = new Injector(configurationMock, runtimeMock);
                injector.run();
                // Act
                getEnabledCallback(true);
                // Assert
                expect(configurationMock.getHttpHeaderOverrides).toHaveBeenCalled();
            });

            it("should not set header overriding callback when injection is disabled", () => {
                // Arrange
                var injector = new Injector(configurationMock, runtimeMock);
                injector.run();
                // Act
                getEnabledCallback(false);
                // Assert
                expect(configurationMock.getHttpHeaderOverrides).not.toHaveBeenCalled();
            });

            booleanTestCases.forEach(test => {

                var status = test.value
                    ? "enabled"
                    : "disabled";

                it(`should configure getOnChange callback when is injection is ${status}`, () => {
                    // Arrange
                    var injector = new Injector(configurationMock, runtimeMock);
                    injector.run();
                    // Act
                    getEnabledCallback(test.value);
                    // Assert
                    expect(configurationMock.getOnChange).toHaveBeenCalledWith("HttpHeaders", [
                        "HttpHeaders",
                        "IsEnabled"
                    ], getOnChangeCallback);
                });

            });

        });

        describe("getHttpHeaderOverridesCallback", () => {

            missingValueTestCases.forEach(test => {

                it(`should not configure addBeforeSendHeadersCallback when headers instance is ${test.value}`, () => {
                    // Arrange
                    var injector = new Injector(configurationMock, runtimeMock);
                    injector.run();
                    getEnabledCallback(true);

                    // Act
                    getHttpHeaderOverridesCallback(test.value);

                    // Assert
                    expect(runtimeMock.addBeforeSendHeadersCallback).not.toHaveBeenCalled();
                });

            });

            it("should configure addBeforeSendHeadersCallback when headers instance is not null or defined", () => {
                // Arrange
                var injector = new Injector(configurationMock, runtimeMock);
                injector.run();
                getEnabledCallback(true);
                var headerOverrides = [];

                // Act
                getHttpHeaderOverridesCallback(headerOverrides);

                // Assert
                expect(runtimeMock.addBeforeSendHeadersCallback).toHaveBeenCalled();
            });

        });

        describe("addBeforeSendHeadersCallback", () => {

            it("should return modified HTTP headers when triggered", () => {
                // Arrange
                var headerOverrides = getHeaderOverrides();
                var request = getRequest();
                var injector = new Injector(configurationMock, runtimeMock);
                injector.run();
                getEnabledCallback(true);
                getHttpHeaderOverridesCallback(headerOverrides);

                // Act
                var headers = addBeforeSendHeadersCallback(request);

                // Assert
                expect(headers.requestHeaders).toEqual([
                    {
                        name: "Another",
                        value: "value"
                    },
                    {
                        name: "foo",
                        value: "test"
                    }
                ]);
            });

        });

        describe("handleStatusChange", () => {

            it("should trigger removal of addBeforeSendHeadersCallback when disabling header injection", () => {
                // Arrange
                var headerOverrides = getHeaderOverrides();
                var request = getRequest();
                var injector = new Injector(configurationMock, runtimeMock);
                injector.run();
                getEnabledCallback(true);
                getHttpHeaderOverridesCallback(headerOverrides);
                addBeforeSendHeadersCallback(request);

                // Act
                injector.handleStatusChange(true, false);

                // Assert
                expect(runtimeMock.removeBeforeSendHeadersCallback).toHaveBeenCalledWith(addBeforeSendHeadersCallback);
            });

        });

        describe("getOnChangeCallback", () => {

            it("should clear header interception event listener and reconfigure header interception when header configuration changes are present and injection enabled", () => {
                // Arrange
                var headerOverrides = getHeaderOverrides();
                var request = getRequest();
                var injector = new Injector(configurationMock, runtimeMock);
                injector.run();
                getEnabledCallback(true);
                getHttpHeaderOverridesCallback(headerOverrides);
                addBeforeSendHeadersCallback(request);

                var changes = {
                    HttpHeaders: [
                        {
                            name: "a",
                            value: "b",
                            enabled: true
                        },
                        {
                            name: "c",
                            value: "d",
                            enabled: false
                        }
                    ],
                    IsEnabled: true
                };

                getOnChangeCallback(changes)

                // Act
                var headers = addBeforeSendHeadersCallback(request);

                // Assert
                expect(runtimeMock.removeBeforeSendHeadersCallback).toHaveBeenCalledWith(jasmine.any(Function));
                expect(runtimeMock.clearContextMenu).toHaveBeenCalled();
                expect(runtimeMock.addContextMenuItem).toHaveBeenCalledWith("Disable", jasmine.any(Function));
                expect(runtimeMock.addBeforeSendHeadersCallback).toHaveBeenCalled();
                expect(headers.requestHeaders).toEqual([
                    {
                        name: "Another",
                        value: "value"
                    },
                    {
                        name: "foo",
                        value: "test"
                    },
                    {
                        name: "a",
                        value: "b"
                    }
                ]);
            });

            it("should clear header interception event listener and not reconfigure header interception when configuration change for IsEnabled is false", () => {
                // Arrange
                var headerOverrides = getHeaderOverrides();
                var request = getRequest();
                var injector = new Injector(configurationMock, runtimeMock);
                injector.run();
                getEnabledCallback(true);
                getHttpHeaderOverridesCallback(headerOverrides);
                addBeforeSendHeadersCallback(request);

                var changes = {
                    HttpHeaders: [
                        {
                            name: "a",
                            value: "b",
                            enabled: true
                        }
                    ],
                    IsEnabled: false
                };

                // Assume
                expect(runtimeMock.removeBeforeSendHeadersCallback).not.toHaveBeenCalled();
                expect(runtimeMock.addBeforeSendHeadersCallback.calls.count()).toBe(1);

                // Act
                getOnChangeCallback(changes)

                // Assert
                expect(runtimeMock.removeBeforeSendHeadersCallback).toHaveBeenCalledWith(jasmine.any(Function));
                expect(runtimeMock.addBeforeSendHeadersCallback.calls.count()).toBe(1);
            });

            it("should clear header interception event listener and not reconfigure header interception when all header overrides are removed", () => {
                // Arrange
                var headerOverrides = getHeaderOverrides();
                var request = getRequest();
                var injector = new Injector(configurationMock, runtimeMock);
                injector.run();
                getEnabledCallback(true);
                getHttpHeaderOverridesCallback(headerOverrides);
                addBeforeSendHeadersCallback(request);

                var changes = {
                    HttpHeaders: [],
                    IsEnabled: true
                };

                // Assume
                expect(runtimeMock.removeBeforeSendHeadersCallback).not.toHaveBeenCalled();
                expect(runtimeMock.addBeforeSendHeadersCallback.calls.count()).toBe(1);

                // Act
                getOnChangeCallback(changes)

                // Assert
                expect(runtimeMock.removeBeforeSendHeadersCallback).toHaveBeenCalledWith(jasmine.any(Function));
                expect(runtimeMock.addBeforeSendHeadersCallback.calls.count()).toBe(1);
            });

            it("should clear header interception event listener and not reconfigure header interception when all header overrides is undefined", () => {
                // Arrange
                var headerOverrides = getHeaderOverrides();
                var request = getRequest();
                var injector = new Injector(configurationMock, runtimeMock);
                injector.run();
                getEnabledCallback(true);
                getHttpHeaderOverridesCallback(headerOverrides);
                addBeforeSendHeadersCallback(request);

                var changes = {
                    HttpHeaders: undefined,
                    IsEnabled: true
                };

                // Assume
                expect(runtimeMock.removeBeforeSendHeadersCallback).not.toHaveBeenCalled();
                expect(runtimeMock.addBeforeSendHeadersCallback.calls.count()).toBe(1);

                // Act
                getOnChangeCallback(changes)

                // Assert
                expect(runtimeMock.removeBeforeSendHeadersCallback).toHaveBeenCalledWith(jasmine.any(Function));
                expect(runtimeMock.addBeforeSendHeadersCallback.calls.count()).toBe(1);
            });

        });


    });

});