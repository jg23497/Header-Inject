import Table from "../../src/common/table.js"

describe("Table", () => {

    var validationMock;
    var tableViewMock;
    var table;

    var getTable;
    var httpHeaders;

    const nullOrUndefinedTestCases = [
        {
            value: undefined
        },
        {
            value: null
        }
    ];

    beforeEach(() => {

        getTable = () => {

            validationMock = jasmine.createSpyObj("validation", [
                "isHttpHeaderValid"
            ]);

            tableViewMock = jasmine.createSpyObj("tableViewMock", [
                "clear",
                "addRow",
                "toggleSaveButtonState",
                "show",
                "hide",
                "getValues"
            ]);

            table = new Table(tableViewMock, validationMock);

            return {
                validationMock,
                tableViewMock,
                table
            };
        }

        httpHeaders = [
            { label: "", name: "a", value: "b", enabled: true },
            { label: "my-label", name: "b", value: "c", enabled: true },
            { label: "another-label", name: "c", value: "d", enabled: false }
        ];

    });

    describe("getValues", () => {

        it("should retrieve HTTP header values from the table view", () => {
            // Arrange
            let { validationMock, tableViewMock, table } = getTable();
            tableViewMock.getValues.and.returnValue(httpHeaders);
            validationMock.isHttpHeaderValid.and.returnValue(true);

            // Act
            var values = table.getValues();

            // Assert
            expect(tableViewMock.getValues).toHaveBeenCalled();
            expect(values).toEqual(httpHeaders);
        });

        it("should return empty array when table view returns the same", () => {
            // Arrange
            let { validationMock, tableViewMock, table } = getTable();
            tableViewMock.getValues.and.returnValue([]);
            validationMock.isHttpHeaderValid.and.returnValue(true);

            // Act
            var values = table.getValues();

            // Assert
            expect(tableViewMock.getValues).toHaveBeenCalled();
            expect(values).toEqual([]);
            expect(validationMock.isHttpHeaderValid.calls.count()).toEqual(0);
        });

        nullOrUndefinedTestCases.forEach(testCase => {
            it("should return empty array when table view returns null or undefined", () => {
                // Arrange
                let { validationMock, tableViewMock, table } = getTable();
                tableViewMock.getValues.and.returnValue(testCase.value);
                validationMock.isHttpHeaderValid;

                // Act
                var values = table.getValues();

                // Assert
                expect(tableViewMock.getValues).toHaveBeenCalled();
                expect(values).toEqual([]);
                expect(validationMock.isHttpHeaderValid.calls.count()).toEqual(0);
            });
        });

        it("should return filtered HTTP header values from the table view", () => {
            // Arrange
            let { validationMock, tableViewMock, table } = getTable();
            tableViewMock.getValues.and.returnValue(httpHeaders);
            validationMock.isHttpHeaderValid
                .withArgs({ label: "", name: "a", value: "b", enabled: true }).and.returnValue(false)
                .withArgs({ label: "my-label", name: "b", value: "c", enabled: true }).and.returnValue(true)
                .withArgs({ label: "another-label", name: "c", value: "d", enabled: false }).and.returnValue(true);

            // Act
            var values = table.getValues();

            // Assert
            httpHeaders.shift();
            expect(values.length).toEqual(2);
            expect(values).toEqual(httpHeaders);
            expect(validationMock.isHttpHeaderValid.calls.count()).toEqual(3);
        });

    });

    describe("clear", () => {

        it("should call table view's clear function", () => {
            // Arrange
            let { _, tableViewMock, table } = getTable();

            // Act
            table.clear();

            // Assert
            expect(tableViewMock.clear).toHaveBeenCalled();
        });

    });

    describe("addNewHeader", () => {

        it("should call table view's add row function", () => {
            // Arrange
            let { _, tableViewMock, table } = getTable();

            // Act
            table.addNewHeader({ label: "", name: "a", value: "b", enabled: true });

            // Assert
            expect(tableViewMock.addRow).toHaveBeenCalledWith({ label: "", name: "a", value: "b", enabled: true });
        });

    });

    describe("setVisible", () => {

        it("should call table view's show function when isVisible is true", () => {
            // Arrange
            let { _, tableViewMock, table } = getTable();

            // Act
            table.setVisible(true);

            // Assert
            expect(tableViewMock.show).toHaveBeenCalled();
        });

        it("should call table view's show function when isVisible is false", () => {
            // Arrange
            let { _, tableViewMock, table } = getTable();

            // Act
            table.setVisible(false);

            // Assert
            expect(tableViewMock.hide).toHaveBeenCalled();
        });

    });

    describe("render", () => {

        it("should call table view's add function for each override", () => {
            // Arrange
            let { _, tableViewMock, table } = getTable();

            // Act
            table.render(httpHeaders);

            // Assert
            expect(tableViewMock.addRow.calls.count()).toEqual(3);
            expect(tableViewMock.addRow.calls.argsFor(0)).toEqual([httpHeaders[0]])
            expect(tableViewMock.addRow.calls.argsFor(1)).toEqual([httpHeaders[1]])
            expect(tableViewMock.addRow.calls.argsFor(2)).toEqual([httpHeaders[2]])
        });

    });

    describe("toggleSaveButtonState", () => {

        it("should call table view's toggleSaveButtonState function", () => {
            // Arrange
            let { _, tableViewMock, table } = getTable();

            // Act
            table.toggleSaveButtonState();

            // Assert
            expect(tableViewMock.toggleSaveButtonState).toHaveBeenCalled();
        });

    });

});