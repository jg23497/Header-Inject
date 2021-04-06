import * as Constants from "../../src/common/constants.js"
import Options from "../../src/common/options.js"

describe("Options", () => {

    var runtimeMock;
    var configurationMock;
    var injectorMock;
    var optionsViewMock;
    var tableMock;

    const emptyValuesTestCases = [
        {
            value: undefined
        },
        {
            value: null
        }
    ];

    const setStatusTestCases = [
        true,
        false
    ];

    beforeEach(() => {
        // Arrange
        runtimeMock = jasmine.createSpyObj("runtime", [
            "onMessage",
            "sendMessage"
        ]);

        configurationMock = jasmine.createSpyObj("configuration", [
            "putHttpHeaderOverrides",
            "onChangeAny",
            "getEnabled",
            "getHttpHeaderOverrides"
        ]);

        injectorMock = jasmine.createSpyObj("injector", [
            "handleStatusChange"
        ]);

        optionsViewMock = jasmine.createSpyObj("optionsView", [
            "setSaveButtonStatus",
            "setStatus",
            "setNoHeadersDefinedMessageVisibility",
            "getAddButtonElement",
            "getSaveButtonElement",
            "getStatusButtonElement"
        ]);

        tableMock = jasmine.createSpyObj("table", [
            "clear",
            "getValues",
            "setVisible",
            "addNewHeader",
            "toggleSaveButtonState",
            "render"
        ]);

        tableMock.getValues.and.returnValue(["a", "b"]);
    });

    describe("bindEventListeners", () => {

        var addHeaderButton;
        var saveHeadersButton;
        var noHeadersDefinedMessageElement;
        var httpHeadersTableBody;
        var statusIndicatorElement;

        var saveCallback;
        var handleMessageCallback;
        var getEnabledCallback;
        var onChangeAnyNotifyChildCallback;

        var options;

        function setup(isPopup) {
            // Arrange
            saveHeadersButton = document.createElement("save-headers");
            addHeaderButton = document.createElement("add-header");
            httpHeadersTableBody = document.createElement("http-headers-table-body");
            noHeadersDefinedMessageElement = document.createElement("no-headers-defined-message");
            statusIndicatorElement = document.createElement("status-indicator-element");

            optionsViewMock.getAddButtonElement.and.returnValue(addHeaderButton);
            optionsViewMock.getSaveButtonElement.and.returnValue(saveHeadersButton);
            optionsViewMock.getStatusButtonElement.and.returnValue(statusIndicatorElement);

            options = new Options(injectorMock, configurationMock, tableMock, optionsViewMock, runtimeMock, isPopup);

            configurationMock.putHttpHeaderOverrides.and.callFake(function (_, func) {
                saveCallback = func;
            });

            document.getElementById = jasmine.createSpy("getElementByIdSpy")
                .withArgs("add-header").and.returnValue(addHeaderButton)
                .withArgs("save-headers").and.returnValue(saveHeadersButton)
                .withArgs("http-headers-table-body").and.returnValue(httpHeadersTableBody)
                .withArgs("no-headers-defined-message").and.returnValue(noHeadersDefinedMessageElement)
                .withArgs("status-indicator").and.returnValue(statusIndicatorElement);
            
            runtimeMock.onMessage.and.callFake(function (func) {
                handleMessageCallback = func;
            });

            configurationMock.onChangeAny.and.callFake(function (func) {
                onChangeAnyNotifyChildCallback = func;
            });

            configurationMock.getEnabled.and.callFake(function (func) {
                getEnabledCallback = func;
            });

            options.bindEventListeners();
        }

        beforeEach(() => {
            setup(false);
        });

        afterEach(function () {
            document.getElementById.and.callThrough();
        });

        it("should toggle injection to false when 'enabled' status button clicked", () => {
            // Arrange
            statusIndicatorElement.click();
            // Act
            getEnabledCallback(true);
            // Assert
            expect(injectorMock.handleStatusChange).toHaveBeenCalledWith(true, false);
            expect(optionsViewMock.setStatus).toHaveBeenCalledWith(false);
        });

        it("should toggle injection to true when 'disabled' status button clicked", () => {
            // Arrange
            statusIndicatorElement.click();
            // Act
            getEnabledCallback(false);
            // Assert
            expect(injectorMock.handleStatusChange).toHaveBeenCalledWith(false, false);
            expect(optionsViewMock.setStatus).toHaveBeenCalledWith(true);
        });

        it("should setup message event handler binding", () => {
            // Arrange, Act and Assert
            expect(runtimeMock.onMessage).toHaveBeenCalledWith(handleMessageCallback);
        });
        
        it("should setup event handler to redraw when redraw command is received and isPopup context is false", () => {
            // Arrange
            spyOn(options, "render");
            var message = { command: Constants.Messaging.Commands.Redraw };
            // Act
            handleMessageCallback(message);
            // Assert
            expect(tableMock.clear).toHaveBeenCalled();
            expect(optionsViewMock.setSaveButtonStatus).toHaveBeenCalledWith(false);
            expect(options.render).toHaveBeenCalled();
        });

        it("should setup event handler to take no action when a command other than redraw is received and isPopup context is false", () => {
            // Arrange
            spyOn(options, "render");
            var message = { command: "foo" };
            // Act
            handleMessageCallback(message);
            // Assert
            expect(tableMock.clear).not.toHaveBeenCalled();
            expect(optionsViewMock.setSaveButtonStatus).not.toHaveBeenCalledWith();
            expect(options.render).not.toHaveBeenCalled();
        });

        it("should setup event handler to send redraw command to child when isPopup context is false", () => {
            // Arrange
            setup(true);
            // Act
            onChangeAnyNotifyChildCallback();
            // Assert
            expect(runtimeMock.sendMessage).toHaveBeenCalledWith({ command: Constants.Messaging.Commands.Redraw })
        });

        it("should persist header table values to configuration when save headers button clicked", () => {
            // Arrange and Act
            saveHeadersButton.click();

            // Assert
            expect(tableMock.getValues).toHaveBeenCalled();
            expect(configurationMock.putHttpHeaderOverrides).toHaveBeenCalledWith(["a", "b"], jasmine.any(Function));
        });

        it("should clear table when save callback called", function () {
            // Arrange
            // The render function is tested elsewhere
            spyOn(options, "render");
            saveHeadersButton.click();

            // Act
            saveCallback(["a", "b"]);

            // Assert
            expect(tableMock.clear).toHaveBeenCalled();
            expect(options.render).toHaveBeenCalled();
        });

        it("should show table and add empty table row when add header button clicked", () => {
            // Arrange and Act
            addHeaderButton.click();

            // Assert
            expect(optionsViewMock.setNoHeadersDefinedMessageVisibility).toHaveBeenCalledWith(false);
            expect(tableMock.setVisible).toHaveBeenCalledWith(true);
            expect(tableMock.addNewHeader).toHaveBeenCalledWith({
                name: "",
                value: "",
                enabled: true
            });
        });

    });

    describe("save", () => {

        var options;
        var saveCallback;
        var getCallback;
        var getEnabledCallback;

        beforeEach(() => {
            // Arrange
            options = new Options(injectorMock, configurationMock, tableMock, optionsViewMock, runtimeMock, false);

            configurationMock.putHttpHeaderOverrides.and.callFake(function (_, func) {
                saveCallback = func;
            });

            configurationMock.getHttpHeaderOverrides.and.callFake(function (func) {
                getCallback = func;
            });

            configurationMock.getEnabled.and.callFake(function (func) {
                getEnabledCallback = func;
            });

            // Act
            options.save();
        });

        emptyValuesTestCases.forEach((test) => {
            it(`should should not redraw table when header values are equal to '${test.value}'`, () => {
                // Arrange
                spyOn(options, "render");
                tableMock.getValues.and.returnValue(undefined);
                // Act
                options.save();
                // Assert
                expect(tableMock.clear).not.toHaveBeenCalled();
                expect(optionsViewMock.setSaveButtonStatus).not.toHaveBeenCalledWith(false);
                expect(options.render).not.toHaveBeenCalled();
            });
        });

        it("should pass header values to the configuration service's put function", () => {
            // Assert
            expect(tableMock.getValues).toHaveBeenCalled();
            expect(configurationMock.putHttpHeaderOverrides).toHaveBeenCalledWith(["a", "b"], jasmine.any(Function));
        });

        it("callback function passed to putHttpHeaderOverrides should clear table", () => {
            // Arrange and Act
            saveCallback(["a", "b"]);

            // Assert
            expect(tableMock.clear).toHaveBeenCalled();
            expect(configurationMock.getHttpHeaderOverrides).toHaveBeenCalled();
        });

        emptyValuesTestCases.forEach(test => {

            afterEach(function () {
                document.getElementById.and?.callThrough();
            });

            it(`callback function should render no headers defined message when headers array is equal to '${test.value}'`, () => {
                // Arrange
                var noHeadersDefinedMessageElement = document.createElement("no-headers-defined-message");
                noHeadersDefinedMessageElement.classList.add("is-hidden");
                document.getElementById = jasmine.createSpy("getElementByIdSpy").and.returnValue(noHeadersDefinedMessageElement);
                saveCallback();

                // Act
                getCallback(test.value);

                // Assert
                expect(tableMock.setVisible).toHaveBeenCalledWith(false);
                expect(optionsViewMock.setNoHeadersDefinedMessageVisibility).toHaveBeenCalledWith(true);
            });
        });

        it("callback function should render headers table", () => {
            // Arrange
            var noHeadersDefinedMessageElement = document.createElement("no-headers-defined-message");
            noHeadersDefinedMessageElement.classList.add("is-hidden");
            document.getElementById = jasmine.createSpy("getElementByIdSpy").and.returnValue(noHeadersDefinedMessageElement);
            saveCallback();

            // Act
            getCallback(["a", "b"]);

            // Assert
            expect(tableMock.render).toHaveBeenCalledWith(["a", "b"]);
            expect(tableMock.setVisible).not.toHaveBeenCalledWith(false);
            expect(noHeadersDefinedMessageElement.classList).toContain("is-hidden");
        });

        setStatusTestCases.forEach(statusValue => {

            afterEach(function () {
                document.getElementById.and?.callThrough();
            });

            it(`callback function should render status button in '${statusValue}' state when status is '${statusValue}'`, () => {
                // Arrange
                var noHeadersDefinedMessageElement = document.createElement("no-headers-defined-message");
                noHeadersDefinedMessageElement.classList.add("is-hidden");
                document.getElementById = jasmine.createSpy("getElementByIdSpy").and.returnValue(noHeadersDefinedMessageElement);
                saveCallback();

                // Act
                getEnabledCallback(statusValue);

                // Assert
                expect(optionsViewMock.setStatus).toHaveBeenCalledWith(statusValue);
            });

        });

    });

});