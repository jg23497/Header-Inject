import TableView from "../../src/common/table-view.js"

describe("TableView", () => {

    var validationMock;
    var optionsViewMock;

    var tableView;
    var tableElement;
    var tableBodyElement;

    beforeEach(() => {
        validationMock = jasmine.createSpyObj("validation", ["isHttpHeaderValid", "isHttpHeaderNameValid", "isHttpHeaderValueValid"]);
        optionsViewMock = jasmine.createSpyObj("optionsView", ["setSaveButtonStatus"]);

        validationMock.isHttpHeaderValid.and.returnValue(true);
        validationMock.isHttpHeaderNameValid.and.returnValue(true);
        validationMock.isHttpHeaderValueValid.and.returnValue(true);

        tableView = new TableView(validationMock, optionsViewMock);

        tableElement = document.createElement("table");
        tableBodyElement = document.createElement("tbody");
        tableElement.appendChild(tableBodyElement);
    });

    describe("show", () => {

        afterEach(() => {
            document.getElementById.and.callThrough();
        });

        it("should unhide the table", () => {

            // Arrange
            tableElement.classList.add("is-hidden");
            document.getElementById = jasmine.createSpy("getElementByIdSpy")
                .withArgs("http-headers").and.returnValue(tableElement)

            // Assume
            expect(tableElement.classList).toContain("is-hidden");

            // Act
            tableView.show();

            // Assert
            expect(tableElement.classList).not.toContain("is-hidden");
        });

    });

    describe("hide", () => {

        afterEach(() => {
            document.getElementById.and.callThrough();
        });

        it("should hide the table", () => {

            // Arrange
            document.getElementById = jasmine.createSpy("getElementByIdSpy")
                .withArgs("http-headers").and.returnValue(tableElement)

            // Assume
            expect(tableElement.classList).not.toContain("is-hidden");

            // Act
            tableView.hide();

            // Assert
            expect(tableElement.classList).toContain("is-hidden");
        });

    });

    describe("clear", () => {

        afterEach(() => {
            document.getElementById.and.callThrough();
        });

        it("should clear the table body content", () => {

            // Arrange
            tableBodyElement.innerHTML = "<foo></foo>"
            document.getElementById = jasmine.createSpy("getElementByIdSpy")
                .withArgs("http-headers-table-body").and.returnValue(tableBodyElement)

            // Assume
            expect(tableBodyElement.innerHTML).not.toBe("");

            // Act
            tableView.clear();

            // Assert
            expect(tableBodyElement.innerHTML).toBe("");
        });

    });

    describe("toggleSaveButtonState ", () => {

        afterEach(() => {
            document.getElementById.and.callThrough();
        });

        const testCases = [
            { headersValid: true, expectedSaveButtonStatus: true },
            { headersValid: false, expectedSaveButtonStatus: false }
        ];

        testCases.forEach(test => {
            it(`should set save button enabled status to ${test.expectedSaveButtonStatus} when header validity is ${test.headersValid}`, () => {
                // Arrange
                var httpHeaderOverride = { label: "", name: "foo1", value: "bar1", enabled: true, valid: true };

                document.getElementById = jasmine.createSpy("getElementByIdSpy")
                    .withArgs("http-headers").and.returnValue(tableElement)
                    .withArgs("http-headers-table-body").and.returnValue(tableBodyElement);

                tableView.addRow(httpHeaderOverride);
                validationMock.isHttpHeaderNameValid.and.returnValue(test.headersValid);

                // Act
                tableView.toggleSaveButtonState();

                // Assert
                expect(optionsViewMock.setSaveButtonStatus).toHaveBeenCalledWith(test.expectedSaveButtonStatus);
            });
        });

    });

    describe("addRow", () => {

        afterEach(() => {
            document.getElementById.and.callThrough();
        });

        function getNameInputField(isValid) {
            var httpHeaderOverride = { label: "", name: "", value: "", enabled: true };
            document.getElementById = jasmine.createSpy("getElementByIdSpy")
                .withArgs("http-headers-table-body").and.returnValue(tableBodyElement)
                .withArgs("http-headers").and.returnValue(tableElement);
            validationMock.isHttpHeaderNameValid.and.returnValue(isValid);
            tableView.addRow(httpHeaderOverride);
        }

        function getValueInputField(isValid) {
            var httpHeaderOverride = { label: "", name: "", value: "", enabled: true };
            document.getElementById = jasmine.createSpy("getElementByIdSpy")
                .withArgs("http-headers-table-body").and.returnValue(tableBodyElement)
                .withArgs("http-headers").and.returnValue(tableElement);
            validationMock.isHttpHeaderValueValid.and.returnValue(isValid);
            tableView.addRow(httpHeaderOverride);
        }

        it("should add a row to the table", () => {

            // Arrange
            var httpHeaderOverride = { label: "", name: "foo", value: "bar", enabled: true };
            document.getElementById = jasmine.createSpy("getElementByIdSpy")
                .withArgs("http-headers-table-body").and.returnValue(tableBodyElement);

            // Act
            tableView.addRow(httpHeaderOverride);

            // Assert
            var tableRows = tableBodyElement.querySelectorAll("tr");
            var rowCells = tableRows[0].querySelectorAll("td");
            expect(tableRows.length).toBe(1);
            expect(rowCells.length).toBe(5);
            expect(rowCells[0].innerHTML).toEqual('<div class="field"><div class="control"><input class="input" type="text" placeholder="Label (optional)"></div></div>');
            expect(rowCells[1].innerHTML).toEqual('<div class="field"><div class="control"><input class="input" type="text" placeholder="Name"></div></div>');
            expect(rowCells[2].innerHTML).toEqual('<div class="field"><div class="control"><input class="input" type="text" placeholder="Value"></div></div>');
            expect(rowCells[3].innerHTML).toEqual('<input type="checkbox">');
            expect(rowCells[4].innerHTML).toEqual('<div class="buttons"><button class="delete-button button is-danger is-light is-small">Delete</button><button class="undo button is-hidden is-small">Undo</button></div>');
        });

        it("should render validation error message when header name input validation fails", () => {
            // Arrange
            getNameInputField(false);
            var nameInput = tableBodyElement.querySelectorAll("input")[1];

            // Assume
            expect(nameInput.classList).not.toContain("is-danger");
            expect(nameInput.validationMessage).toBe("");
            expect(nameInput.validity.valid).toBe(true);

            // Act
            nameInput.dispatchEvent(new Event("input"));

            // Assert
            expect(nameInput.classList).toContain("is-danger");
            expect(nameInput.validationMessage).toBe("Enter a valid HTTP header name");
            expect(nameInput.validity.valid).toBe(false);
        });

        it("should clear validation error message when header name input validation succeeds", () => {
            // Arrange
            getNameInputField(true);
            var nameInput = tableBodyElement.querySelectorAll("input")[1];
            nameInput.classList.add("is-danger");
            nameInput.setCustomValidity("Enter a valid HTTP header name");

            // Act
            nameInput.dispatchEvent(new Event("input"));

            // Assert
            expect(nameInput.classList).not.toContain("is-danger");
            expect(nameInput.validationMessage).toBe("");
            expect(nameInput.validity.valid).toBe(true);
        });

        it("should render validation error message when header value input validation fails", () => {
            // Arrange
            getValueInputField(false);
            var valueInput = tableBodyElement.querySelectorAll("input")[2];

            // Assume
            expect(valueInput.classList).not.toContain("is-danger");
            expect(valueInput.validationMessage).toBe("");
            expect(valueInput.validity.valid).toBe(true);

            // Act
            valueInput.dispatchEvent(new Event("input"));

            // Assert
            expect(valueInput.classList).toContain("is-danger");
            expect(valueInput.validationMessage).toBe("Enter a value");
            expect(valueInput.validity.valid).toBe(false);
        });

        it("should clear validation error message when header value input validation succeeds", () => {
            // Arrange
            getValueInputField(true);
            var valueInput = tableBodyElement.querySelectorAll("input")[2];
            valueInput.classList.add("is-danger");
            valueInput.setCustomValidity("Enter a value");

            // Act
            valueInput.dispatchEvent(new Event("input"));

            // Assert
            expect(valueInput.classList).not.toContain("is-danger");
            expect(valueInput.validationMessage).toBe("");
            expect(valueInput.validity.valid).toBe(true);
        });

    });

    describe("getValues", () => {

        afterEach(() => {
            document.getElementById.and.callThrough();
        });

        it("should return null when an invalid header is found", () => {

            // Arrange
            var httpHeaderOverride = { label: "", name: "foo1", value: "bar1", enabled: true, valid: true };

            document.getElementById = jasmine.createSpy("getElementByIdSpy")
                .withArgs("http-headers").and.returnValue(tableElement)
                .withArgs("http-headers-table-body").and.returnValue(tableBodyElement);

            tableView.addRow(httpHeaderOverride);
            validationMock.isHttpHeaderNameValid.and.returnValue(false);

            // Act
            var values = tableView.getValues();

            // Assert
            expect(values).toBe(null);
        });

        it("should return empty list when no rows are defined", () => {

            // Arrange
            document.getElementById = jasmine.createSpy("getElementByIdSpy")
                .withArgs("http-headers").and.returnValue(tableElement)
                .withArgs("http-headers-table-body").and.returnValue(tableBodyElement);

            // Act
            var values = tableView.getValues();

            // Assert
            expect(values.length).toBe(0);
        });

        it("should return HTTP header rows when rows are defined", () => {

            // Arrange
            var httpHeaderOverride1 = { label: "", name: "foo1", value: "bar1", enabled: true, valid: true };
            var httpHeaderOverride2 = { label: "my-label", name: "foo2", value: "bar2", enabled: false, valid: true };
            document.getElementById = jasmine.createSpy("getElementByIdSpy")
                .withArgs("http-headers").and.returnValue(tableElement)
                .withArgs("http-headers-table-body").and.returnValue(tableBodyElement);

            tableView.addRow(httpHeaderOverride1);
            tableView.addRow(httpHeaderOverride2);

            // Act
            var values = tableView.getValues();

            // Assert
            expect(values.length).toBe(2);
            expect(values[0]).toEqual(httpHeaderOverride1);
            expect(values[1]).toEqual(httpHeaderOverride2);
        });

        it("should not return rows containing <th> elements", () => {

            // Arrange
            var httpHeaderOverride = { label: "", name: "foo", value: "bar", enabled: true, valid: true };
            document.getElementById = jasmine.createSpy("getElementByIdSpy")
                .withArgs("http-headers").and.returnValue(tableElement)
                .withArgs("http-headers-table-body").and.returnValue(tableBodyElement);

            var row = tableElement.insertRow(0);
            row.insertCell(0).outerHTML = "<th>Foo</th>";
            tableView.addRow(httpHeaderOverride);

            // Act
            var values = tableView.getValues();

            // Assert
            expect(values.length).toBe(1);
            expect(values[0]).toEqual(httpHeaderOverride);
        });

        it("should not return rows with the 'strikethrough' class", () => {

            // Arrange
            var httpHeaderOverride = { label: "", name: "foo", value: "bar", enabled: true };
            document.getElementById = jasmine.createSpy("getElementByIdSpy")
                .withArgs("http-headers").and.returnValue(tableElement)
                .withArgs("http-headers-table-body").and.returnValue(tableBodyElement);

            tableView.addRow(httpHeaderOverride);
            tableElement.querySelector("tr").classList.add("strikethrough");

            // Act
            var values = tableView.getValues();

            // Assert
            expect(values.length).toBe(0);
        });

    });

    describe("delete button click handler", () => {

        var deleteButton;
        var httpHeaderOverride1;
        var httpHeaderOverride2;

        beforeEach(() => {
            httpHeaderOverride1 = { label: "", name: "foo1", value: "bar1", enabled: true };
            httpHeaderOverride2 = { label: "", name: "foo2", value: "bar2", enabled: false };

            document.getElementById = jasmine.createSpy("getElementByIdSpy")
                .withArgs("http-headers").and.returnValue(tableElement)
                .withArgs("http-headers-table-body").and.returnValue(tableBodyElement);

            tableView.addRow(httpHeaderOverride1);
            tableView.addRow(httpHeaderOverride2);

            deleteButton = tableElement.querySelectorAll("button.delete-button")[1];
        });

        afterEach(() => {
            document.getElementById.and.callThrough();
        });

        it("should be hidden when clicked", () => {
            // Assume
            expect(deleteButton.classList).not.toContain("is-hidden");

            // Act
            deleteButton.click();

            // Assert
            expect(deleteButton.classList).toContain("is-hidden");
        });

        it("should remove row immediately if its values are invalid", () => {
            // Arrange
            validationMock.isHttpHeaderValid.and.returnValue(false);

            // Assume
            expect(tableElement.querySelectorAll("tr").length).toBe(2);
            expect(deleteButton.classList).not.toContain("is-hidden");

            // Act
            deleteButton.click();

            // Assert
            expect(tableElement.querySelectorAll("tr").length).toEqual(1);
        });

        it("should apply the staged deletion state to the relevant row", () => {
            // Assume
            expect(tableElement.querySelectorAll("tr.strikethrough").length).toBe(0);
            expect(tableElement.querySelectorAll("button.undo:not(.is-hidden)").length).toBe(0);

            // Act
            deleteButton.click();

            // Assert
            var targetRow = tableElement.querySelectorAll("tr")[1];
            expect(targetRow.classList).toContain("strikethrough");
            expect(tableElement.querySelectorAll("tr.strikethrough").length).toBe(1);
            expect(targetRow.querySelector("button.undo").classList).not.toContain("is-hidden");
        });


    });

    describe("undo button click handler", () => {

        var deleteButton;
        var undoButton;

        beforeEach(() => {
            var httpHeaderOverride1 = { label: "", name: "foo1", value: "bar1", enabled: true };
            var httpHeaderOverride2 = { label: "", name: "foo2", value: "bar2", enabled: false };

            document.getElementById = jasmine.createSpy("getElementByIdSpy")
                .withArgs("http-headers").and.returnValue(tableElement)
                .withArgs("http-headers-table-body").and.returnValue(tableBodyElement);

            tableView.addRow(httpHeaderOverride1);
            tableView.addRow(httpHeaderOverride2);

            deleteButton = tableElement.querySelectorAll("button.delete-button")[1];
            undoButton = tableElement.querySelectorAll("button.undo")[1];
            deleteButton.click();
        });

        afterEach(() => {
            document.getElementById.and.callThrough();
        });

        it("should be hidden when clicked", () => {
            // Assume
            expect(undoButton.classList).not.toContain("is-hidden");

            // Act
            undoButton.click();

            // Assert
            expect(undoButton.classList).toContain("is-hidden");
        });

        it("should remove stikethrough class from relevant table row", () => {
            // Assume
            expect(tableElement.querySelectorAll("tr.strikethrough").length).toBe(1);

            // Act
            undoButton.click();

            // Assert
            var targetRow = tableElement.querySelectorAll("tr")[1];
            expect(targetRow.classList).not.toContain("strikethrough");
            expect(tableElement.querySelectorAll("tr.strikethrough").length).toBe(0);
        });

        it("should un-hide the delete button", () => {
            // Assume
            expect(tableElement.querySelectorAll("button.delete-button:not(.is-hidden)").length).toBe(1);

            // Act
            undoButton.click();

            // Assert
            var targetRow = tableElement.querySelectorAll("tr")[1];
            var targetButton = targetRow.querySelector("button.delete-button");
            expect(targetButton.classList).not.toContain("is-hidden");
            expect(tableElement.querySelectorAll("button.delete-button:not(.is-hidden)").length).toBe(2);
        });

    });

});