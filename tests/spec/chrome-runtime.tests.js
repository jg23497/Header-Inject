import ChromeRuntime from "../../src/chrome/chrome-runtime.js"

describe("ChromeRuntime", () => {

    function mockRuntime() {
        window.chrome = {
            runtime: {
                sendMessage: () => { },
                onMessage: {
                    addListener: () => { }
                }
            },
            webRequest: {
                onBeforeSendHeaders: {
                    removeListener: () => { },
                    addListener: () => { }
                }
            },
            contextMenus: {
                removeAll: () => { },
                create: () => { }
            }
        }
    }

    function getChromeRuntime() {
        var chromeRuntime = new ChromeRuntime();
        return { chromeRuntime };
    }

    beforeEach(() => {
        mockRuntime();
    });

    describe("sendMessage", () => {
        it("should pass message to runtime.sendMessage", () => {
            // Arrange
            spyOn(chrome.runtime, "sendMessage");
            let { chromeRuntime } = getChromeRuntime();
            // Act
            chromeRuntime.sendMessage("foo");
            // Assert
            expect(chrome.runtime.sendMessage).toHaveBeenCalledWith("foo");
        })
    });

    describe("onMessage", () => {

        it("should setup onMessage event listener", () => {

            // Arrange
            var callbackWrapperFunction;
            var callback = jasmine.createSpy("callback");
            spyOn(chrome.runtime.onMessage, "addListener").and.callFake(function (func) {
                callbackWrapperFunction = func;
            });

            let { chromeRuntime } = getChromeRuntime();

            // Act
            chromeRuntime.onMessage(callback);
            callbackWrapperFunction("message");

            // Assert
            expect(callback).toHaveBeenCalledWith("message");
            expect(chrome.runtime.onMessage.addListener).toHaveBeenCalledWith(callbackWrapperFunction);

        })

    });

    describe("removeBeforeSendHeadersCallback", () => {

        it("should call pass callback to onBeforeSendHeaders.removeListener", () => {
            // Arrange
            var callback = jasmine.createSpy("callback");
            spyOn(chrome.webRequest.onBeforeSendHeaders, "removeListener");
            let { chromeRuntime } = getChromeRuntime();
            // Act
            chromeRuntime.removeBeforeSendHeadersCallback(callback);
            // Assert
            expect(chrome.webRequest.onBeforeSendHeaders.removeListener).toHaveBeenCalledWith(callback);
        });

    });

    describe("addBeforeSendHeadersCallback", () => {

        it("should configure the onBeforeSendHeaders callback", () => {
            // Arrange
            var callback = function () { };
            spyOn(chrome.webRequest.onBeforeSendHeaders, "addListener");
            let { chromeRuntime } = getChromeRuntime();
            // Act
            chromeRuntime.addBeforeSendHeadersCallback(callback);
            // Assert
            expect(chrome.webRequest.onBeforeSendHeaders.addListener).toHaveBeenCalledWith(callback, { urls: ["<all_urls>"] }, ["requestHeaders", "blocking"]);
        });

    });

    describe("clearContextMenu", () => {

        it("should call contextMenus.removeAll", () => {
            // Arrange
            spyOn(chrome.contextMenus, "removeAll");
            let { chromeRuntime } = getChromeRuntime();
            // Act
            chromeRuntime.clearContextMenu();
            // Assert
            expect(chrome.contextMenus.removeAll).toHaveBeenCalledWith();
        });

    });

    describe("addContextMenuItem", () => {

        it("should pass callback to contextMenus.create", () => {
            // Arrange
            var callback = function() { };
            spyOn(chrome.contextMenus, "create");
            let { chromeRuntime } = getChromeRuntime();
            // Act
            chromeRuntime.addContextMenuItem("foo", callback);
            // Assert
            expect(chrome.contextMenus.create).toHaveBeenCalledWith({title: "foo", contexts: ["browser_action"], onclick: callback});
        });

    });

});