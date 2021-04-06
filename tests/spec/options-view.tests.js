import OptionsView from "../../src/common/options-view.js"

describe("OptionsView", () => {

    describe("getAddButtonElement", () => {

        afterEach(function(){
            document.getElementById.and.callThrough();
        });

        it("should return the save button's element", () => {
            // Arrange
            var optionsView = new OptionsView();
            var buttonElement = document.createElement("add-header");
            document.getElementById = jasmine.createSpy("getElementByIdSpy")
                .withArgs("add-header").and.returnValue(buttonElement)

            // Act
            var result = optionsView.getAddButtonElement();

            // Asssert
            expect(result).toEqual(buttonElement);
        });

    });

    describe("getStatusButtonElement", () => {

        afterEach(function(){
            document.getElementById.and.callThrough();
        });

        it("should return the status button's element", () => {
            // Arrange
            var optionsView = new OptionsView();
            var buttonElement = document.createElement("status-indicator");
            document.getElementById = jasmine.createSpy("getElementByIdSpy")
                .withArgs("status-indicator").and.returnValue(buttonElement)

            // Act
            var result = optionsView.getStatusButtonElement();

            // Asssert
            expect(result).toEqual(buttonElement);
        });

    });

    describe("getSaveButtonElement", () => {

        afterEach(function(){
            document.getElementById.and.callThrough();
        });

        it("should return the add button's element", () => {
            // Arrange
            var optionsView = new OptionsView();
            var buttonElement = document.createElement("save-headers");
            document.getElementById = jasmine.createSpy("getElementByIdSpy")
                .withArgs("save-headers").and.returnValue(buttonElement)

            // Act
            var result = optionsView.getSaveButtonElement();

            // Asssert
            expect(result).toEqual(buttonElement);
        });

    });

    describe("setSaveButtonStatus", () => {

        var optionsView;
        var saveHeadersButton;

        beforeEach(function(){
            optionsView = new OptionsView();
            saveHeadersButton = document.createElement("save-headers");
            document.getElementById = jasmine.createSpy("getElementByIdSpy")
                .withArgs("save-headers").and.returnValue(saveHeadersButton)
        });
        
        afterEach(function(){
            document.getElementById.and.callThrough();
        });

        it("should remove the disabled attribute from the save button when passed true", () => {
            // Arrange and Act
            optionsView.setSaveButtonStatus(true);
            // Asssert
            expect(saveHeadersButton.getAttribute("disabled")).toBe(null);
        });

        it("should add the disabled attribute to the save button when passed true", () => {
            // Arrange and Act
            optionsView.setSaveButtonStatus(false);
            // Asssert
            expect(saveHeadersButton.getAttribute("disabled")).toBe("");
        });

    });

    describe("setStatus", () => {

        var optionsView;
        var statusElement;

        beforeEach(function(){
            optionsView = new OptionsView();
            statusElement = document.createElement("status-indicator");
            document.getElementById = jasmine.createSpy("getElementByIdSpy")
                .withArgs("status-indicator").and.returnValue(statusElement)
        });
        
        afterEach(function(){
            document.getElementById.and.callThrough();
        });

        it("should render the 'Enabled' button when isEnabled is equal to true", () => {
            // Arrange and Act
            optionsView.setStatus(true);
            // Asssert
            expect(statusElement.innerText).toEqual("Enabled");
            expect(statusElement.classList).toContain("is-success");
            expect(statusElement.classList).not.toContain("is-danger");
        });

        it("should render the 'Enabled' button when isEnabled is equal to false", () => {
            // Arrange and Act
            optionsView.setStatus(false);
            // Asssert
            expect(statusElement.innerText).toEqual("Disabled");
            expect(statusElement.classList).not.toContain("is-success");
            expect(statusElement.classList).toContain("is-danger");
        });

    });

    describe("setNoHeadersDefinedMessageVisibility", () => {

        var optionsView;
        var element;

        beforeEach(function(){
            optionsView = new OptionsView();
            element = document.createElement("no-headers-defined-message");
            document.getElementById = jasmine.createSpy("getElementByIdSpy")
                .withArgs("no-headers-defined-message").and.returnValue(element)
        });

        afterEach(function(){
            document.getElementById.and.callThrough();
        });

        it("should hide the message when isVisible is equal to false", () => {
            // Arrange and Act
            optionsView.setNoHeadersDefinedMessageVisibility(false);
            // Asssert
            expect(element.classList).toContain("is-hidden");
        });

        it("should show the message when isVisible is equal to true", () => {
            // Arrange and Act
            optionsView.setNoHeadersDefinedMessageVisibility(true);
            // Asssert
            expect(element.classList).not.toContain("is-hidden");
        });

    });

});