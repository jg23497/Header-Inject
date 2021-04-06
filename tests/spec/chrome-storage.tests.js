import ChromeStorage from "../../src/chrome/chrome-storage.js"

describe("ChromeStorage", () => {

    function mockStorage() {
        window.chrome = {
            storage: {
                sync: {
                    set: () => { },
                    get: () => { }
                },
                onChanged: {
                    addListener: () => { }
                }
            }
        }
    }

    const testCases = [
        {
            value: "a"
        },
        {
            value: "b"
        }
    ];

    beforeEach(() => {
        mockStorage();
    });

    describe("store", () => {

        var setCallback = () => { }

        it("should pass key-value pair and callback handle to storage API", () => {
            // Arrange
            spyOn(chrome.storage.sync, "set");
            var storageInstance = new ChromeStorage();
            // Act
            storageInstance.store("key", "value", setCallback)
            // Assert
            expect(chrome.storage.sync.set).toHaveBeenCalledWith({ "key": "value" }, setCallback);
        });

        it("should pass key-value pair to storage API", () => {
            // Arrange
            spyOn(chrome.storage.sync, "set");
            var storageInstance = new ChromeStorage();
            // Act
            storageInstance.store("key", "value")
            // Assert
            expect(chrome.storage.sync.set).toHaveBeenCalledWith({ "key": "value" }, undefined);
        });

    });

    describe("get", () => {

        var getCallback = () => { }

        it("should call storage API using specified key", () => {
            // Arrange
            spyOn(chrome.storage.sync, "get");
            var storageInstance = new ChromeStorage();
            // Act
            storageInstance.get("key", getCallback)
            // Assert
            expect(chrome.storage.sync.get).toHaveBeenCalledWith(["key"], getCallback);
        });

    });

    describe("onChange", () => {

        var filteringFunction;
        var onChangeCallback;

        beforeEach(() => {
            onChangeCallback = jasmine.createSpy(onChangeCallback);
            spyOn(chrome.storage.onChanged, "addListener").and.callFake(function (changeHandlingFunction) {
                filteringFunction = changeHandlingFunction;
            });
            var storageInstance = new ChromeStorage();
            storageInstance.onChange("targetKey", onChangeCallback)
        });

        it("should pass matching changes to callback function", () => {
            // Arrange
            var changes = {
                "anotherKey": { newValue: "foo" },
                "targetKey": { newValue: "bar" }
            };
            // Act
            filteringFunction(changes)
            // Assert
            expect(onChangeCallback).toHaveBeenCalledWith("bar");
        });

        it("should set storage API onChanged event listener", () => {
            // Assert
            expect(chrome.storage.onChanged.addListener).toHaveBeenCalledWith(jasmine.any(Function));
        });

        it("should not call callback function when no matching changes occur", () => {
            // Arrange
            var changes = {
                "anotherKey": {
                    newValue: "foo"
                }
            };
            // Act
            filteringFunction(changes)
            // Assert
            expect(onChangeCallback).not.toHaveBeenCalled();
        });

    });

    describe("getOnChange", () => {

        var filteringFunction;
        var getOnChangeCallback;

        beforeEach(() => {

            getOnChangeCallback = jasmine.createSpy("getOnChangeCallback");

            spyOn(chrome.storage.onChanged, "addListener").and.callFake(function (changeHandlingFunction) {
                filteringFunction = changeHandlingFunction;
            });

            var storageInstance = new ChromeStorage();
            storageInstance.getOnChange("targetKey", ["anotherKey", "targetKey"], getOnChangeCallback)

        });

        it("should call chrome.storage.sync.get with return keys when target match is found", () => {
            // Arrange
            var changes = {
                "anotherKey": { newValue: "foo" },
                "targetKey": { newValue: "bar" }
            };

            spyOn(chrome.storage.sync, "get");

            // Act
            filteringFunction(changes);
            
            // Assert
            expect(chrome.storage.sync.get).toHaveBeenCalledWith(["anotherKey", "targetKey"], getOnChangeCallback);
        });

        it("should not call chrome.storage.sync.get with return keys when target match is not found", () => {
            // Arrange
            var changes = {
                "foo": { newValue: "foo" },
                "bar": { newValue: "bar" }
            };

            spyOn(chrome.storage.sync, "get");

            // Act
            filteringFunction(changes);
            
            // Assert
            expect(chrome.storage.sync.get).not.toHaveBeenCalled();
        });

    });

    
    describe("onChangeAny", () => {

        var filteringFunction;
        var onChangeAnyCallback;

        beforeEach(() => {

            onChangeAnyCallback = jasmine.createSpy("onChangeAnyCallback");

            spyOn(chrome.storage.onChanged, "addListener").and.callFake(function (changeHandlingFunction) {
                filteringFunction = changeHandlingFunction;
            });

            var storageInstance = new ChromeStorage();
            storageInstance.onChangeAny(["a", "b"], onChangeAnyCallback)

        });

        testCases.forEach(test => {

            it(`should trigger callback function when any target key match is found ('${test.value}')`, () => {
                // Arrange
                var changes = {};
                changes[test.value] = { newValue: "foo" };

                // Act
                filteringFunction(changes);

                // Assert
                expect(onChangeAnyCallback.calls.count()).toBe(1);
            });
        });

        it("should not trigger callback function when not target key match is found", () => {
            // Arrange
            var changes = {
                "foo": { newValue: "foo" },
                "bar": { newValue: "bar" }
            };

            // Act
            filteringFunction(changes);
            
            // Assert
            expect(onChangeAnyCallback).not.toHaveBeenCalled();
        });

    });
});