import Configuration from "../../src/common/configuration.js"

describe("Configuration", () => {

    var storageMock;

    const testCases = [
        {
            value: true
        },
        {
            value: false
        }
    ];

    beforeEach(() => {
        storageMock = jasmine.createSpyObj("storage", [
            "get",
            "store",
            "onChange",
            "getOnChange",
            "onChangeAny"
        ])
    });

    describe("setEnabled", () => {

        it("should throw error when argument to isEnabled parameter is undefined", () => {

            // Arrange
            var config = new Configuration();

            // Act and Assert
            expect(() => {
                config.setEnabled();
            }).toThrow("isEnabled must be a boolean");

        });

        it("should throw error when argument to isEnabled parameter is null", () => {

            // Arrange
            var config = new Configuration();

            // Act and Assert
            expect(() => {
                config.setEnabled(null);
            }).toThrow("isEnabled must be a boolean");

        });

        it("should throw error when argument to isEnabled parameter is not a boolean value", () => {

            // Arrange
            var config = new Configuration();

            // Act and Assert
            expect(() => {
                config.setEnabled("true");
            }).toThrow("isEnabled must be a boolean");

        });

        testCases.forEach(test => {

            it(`should pass enabled setting key and '${test.value}' value to storage service`, () => {

                // Arrange
                var config = new Configuration(storageMock);

                // Act
                config.setEnabled(true);

                // Assert
                expect(storageMock.store).toHaveBeenCalledWith("IsEnabled", true);

            });
        });

    });

    describe("getHttpHeaderOverrides", () => {

        var callbackWrapper;
        var callback;

        beforeEach(() => {

            // Arrange
            callback = jasmine.createSpy(callback);

            storageMock.get.and.callFake(function (_, func) {
                callbackWrapper = func;
            });

            var config = new Configuration(storageMock);

            // Act
            config.getHttpHeaderOverrides(callback);

        });

        it("should call storage service's get function", () => {
            // Assert
            expect(storageMock.get).toHaveBeenCalledWith("HttpHeaders", jasmine.any(Function));
        });

        it("should pass header values to callback", () => {

            // Arrange
            var headers = {
                HttpHeaders: "values"
            };

            // Act
            callbackWrapper(headers);

            // Assert
            expect(callback).toHaveBeenCalledWith("values");

        });
    });

    describe("putHttpHeaderOverrides", () => {

        it("should call storage service's store function, passing required arguments", () => {

            // Arrange
            var config = new Configuration(storageMock);
            var callback = jasmine.createSpy("callback");

            // Act
            config.putHttpHeaderOverrides("value", callback);

            // Assert
            expect(storageMock.store).toHaveBeenCalledWith("HttpHeaders", "value", callback);

        });
    });

    describe("onChangeHeaders", () => {

        it("should call storage service's onChange function, passing required arguments", () => {

            // Arrange
            var config = new Configuration(storageMock);
            var callback = jasmine.createSpy("callback");

            // Act
            config.onChangeHeaders(callback);

            // Assert
            expect(storageMock.onChange).toHaveBeenCalledWith("HttpHeaders", callback);

        });
    });

    describe("getEnabled", () => {

        var callbackWrapper;
        var callback;

        beforeEach(() => {

            // Arrange
            callback = jasmine.createSpy(callback);

            storageMock.get.and.callFake(function (_, func) {
                callbackWrapper = func;
            });

            var config = new Configuration(storageMock);

            // Act
            config.getEnabled(callback);

        });

        it("should call storage service's get function", () => {
            // Assert
            expect(storageMock.get).toHaveBeenCalledWith("IsEnabled", jasmine.any(Function));
        });

        it("should pass header values to callback", () => {

            // Arrange
            var headers = {
                IsEnabled: true
            };

            // Act
            callbackWrapper(headers);

            // Assert
            expect(callback).toHaveBeenCalledWith(true);

        });
    });

    describe("onChangeEnabled", () => {

        it("should call storage service's onChange function, passing required arguments", () => {

            // Arrange
            var config = new Configuration(storageMock);
            var callback = jasmine.createSpy("callback");

            // Act
            config.onChangeEnabled(callback);

            // Assert
            expect(storageMock.onChange).toHaveBeenCalledWith("IsEnabled", callback);

        });
    });

    describe("getOnChange", () => {

        it("should call storage service's getOnChange function, passing required arguments", () => {

            // Arrange
            var config = new Configuration(storageMock);
            var callback = jasmine.createSpy("callback");

            // Act
            config.getOnChange("foo", "bar", callback);

            // Assert
            expect(storageMock.getOnChange).toHaveBeenCalledWith("foo", "bar", callback);

        });
    });

    describe("onChangeAny", () => {

        it("should call storage service's onChangeAny function, passing required arguments", () => {

            // Arrange
            var config = new Configuration(storageMock);
            var callback = jasmine.createSpy("callback");

            // Act
            config.onChangeAny(callback);

            // Assert
            expect(storageMock.onChangeAny).toHaveBeenCalledWith(["IsEnabled", "HttpHeaders"], callback);

        });
    });

});