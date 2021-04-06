import Runtime from "../../src/common/runtime.js"

describe("Runtime", () => {

    var runtimeImplementationMock;
    var runtime;

    beforeEach(() => {
        runtimeImplementationMock = jasmine.createSpyObj("runtimeImplementation", [
            "sendMessage",
            "onMessage",
            "removeBeforeSendHeadersCallback",
            "addBeforeSendHeadersCallback",
            "clearContextMenu",
            "addContextMenuItem"
        ]);
        runtime = new Runtime(runtimeImplementationMock);
    });

    describe("sendMessage", () => {
        it("should call implementation's sendMessage function", () => {
            // Arrange and Act
            runtime.sendMessage("foo");
            // Assert
            expect(runtimeImplementationMock.sendMessage).toHaveBeenCalledWith("foo");
            expect(runtimeImplementationMock.sendMessage.calls.count()).toBe(1);
        })
    });

    describe("onMessage", () => {
        it("should call implementation's onMessage function", () => {
            // Arrange
            var func = () => {};
            // Act
            runtime.onMessage(func);
            // Assert
            expect(runtimeImplementationMock.onMessage).toHaveBeenCalledWith(func);
            expect(runtimeImplementationMock.onMessage.calls.count()).toBe(1);
        })
    });

    describe("removeBeforeSendHeadersCallback", () => {
        it("should call implementation's removeBeforeSendHeadersCallback function", () => {
            // Arrange
            var func = () => {};
            // Act
            runtime.removeBeforeSendHeadersCallback(func);
            // Assert
            expect(runtimeImplementationMock.removeBeforeSendHeadersCallback).toHaveBeenCalledWith(func);
            expect(runtimeImplementationMock.removeBeforeSendHeadersCallback.calls.count()).toBe(1);
        })
    });

    describe("addBeforeSendHeadersCallback", () => {
        it("should call implementation's addBeforeSendHeadersCallback function", () => {
            // Arrange
            var func = () => {};
            // Act
            runtime.addBeforeSendHeadersCallback(func);
            // Assert
            expect(runtimeImplementationMock.addBeforeSendHeadersCallback).toHaveBeenCalledWith(func);
            expect(runtimeImplementationMock.addBeforeSendHeadersCallback.calls.count()).toBe(1);
        })
    });

    describe("clearContextMenu", () => {
        it("should call implementation's clearContextMenu function", () => {
            // Arrange and Act
            runtime.clearContextMenu();
            // Assert
            expect(runtimeImplementationMock.clearContextMenu.calls.count()).toBe(1);
        })
    });

    describe("addContextMenuItem", () => {
        it("should call implementation's addContextMenuItem function", () => {
            // Arrange
            var func = () => {};
            // Act
            runtime.addContextMenuItem("foo", func);
            // Assert
            expect(runtimeImplementationMock.addContextMenuItem).toHaveBeenCalledWith("foo", func);
            expect(runtimeImplementationMock.addContextMenuItem.calls.count()).toBe(1);
        })
    });

});