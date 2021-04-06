import Storage from "../../src/common/storage.js"

describe("Storage", function () {

    var callback;
    var storageImplementationMock;

    beforeEach(function () {
        callback = function () { };
        storageImplementationMock = jasmine.createSpyObj("storageImplementation", [
            "store",
            "get",
            "onChange",
            "getOnChange",
            "onChangeAny"
        ]);
    });

    describe("store", function () {

        it("should call storage implementation's store function", function () {
            // Arrange
            var storage = new Storage(storageImplementationMock);
            // Act
            storage.store("foo", "bar", callback);
            // Assert
            expect(storageImplementationMock.store).toHaveBeenCalledWith("foo", "bar", callback);
        });

    });

    describe("get", function () {

        it("should call storage implementation's get function", function () {
            // Arrange
            var storage = new Storage(storageImplementationMock);
            // Act
            storage.get("foo", callback);
            // Assert
            expect(storageImplementationMock.get).toHaveBeenCalledWith("foo", callback);
        });

    });

    describe("onChange", function () {

        it("should call storage implementation's onChange function", function () {
            // Arrange
            var storage = new Storage(storageImplementationMock);
            // Act
            storage.onChange("foo", callback);
            // Assert
            expect(storageImplementationMock.onChange).toHaveBeenCalledWith("foo", callback);
        });

    });

    describe("getOnChange", function () {

        it("should call storage implementation's getOnChange function", function () {
            // Arrange
            var storage = new Storage(storageImplementationMock);
            // Act
            storage.getOnChange("foo", "bar", callback);
            // Assert
            expect(storageImplementationMock.getOnChange).toHaveBeenCalledWith("foo", "bar", callback);
        });

    });

    describe("onChangeAny", function () {

        it("should call storage implementation's onChangeAny function", function () {
            // Arrange
            var storage = new Storage(storageImplementationMock);
            // Act
            storage.onChangeAny(["Foo", "Bar"], callback);
            // Assert
            expect(storageImplementationMock.onChangeAny).toHaveBeenCalledWith(["Foo", "Bar"], callback);
        });

    });

});