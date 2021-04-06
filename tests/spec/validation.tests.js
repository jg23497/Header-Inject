import Validation from "../../src/common/validation.js"

describe("Validation", () => {

    function getValidation(){
        var validation = new Validation();
        return { validation };
    }

    describe("isHttpHeaderValid", () => {

        it("should return true when HTTP header has non-empty name and value property value", () => {
            // Arrange
            let { validation } = getValidation();
            var candidate = {
                name: "name",
                value: "value",
                enabled: true
            };

            // Act
            var result = validation.isHttpHeaderValid(candidate);

            // Assert
            expect(result).toEqual(true);
        });

        it("should return false when HTTP header has an empty name value", () => {
            // Arrange
            let { validation } = getValidation();
            var candidate = {
                name: "",
                value: "value",
                enabled: true
            };

            // Act
            var result = validation.isHttpHeaderValid(candidate);

            // Assert
            expect(result).toEqual(false);
        });

        it("should return false when HTTP header has an empty value property value", () => {
            // Arrange
            let { validation } = getValidation();
            var candidate = {
                name: "name",
                value: "",
                enabled: true
            };

            // Act
            var result = validation.isHttpHeaderValid(candidate);

            // Assert
            expect(result).toEqual(false);
        });

        it("should return false when HTTP header has a non-Boolean enabled value", () => {
            // Arrange
            let { validation } = getValidation();
            var candidate = {
                name: "name",
                value: "value",
                enabled: 5
            };

            // Act
            var result = validation.isHttpHeaderValid(candidate);

            // Assert
            expect(result).toEqual(false);
        });

        it("should return false when HTTP header values are missing", () => {
            // Arrange
            let { validation } = getValidation();
            var candidate = {};

            // Act
            var result = validation.isHttpHeaderValid(candidate);

            // Assert
            expect(result).toEqual(false);
        });

        it("should throw error when HTTP header value argument is omitted", () => {
            // Arrange
            let { validation } = getValidation();

            // Act and Assert
            expect(() => {
                validation.isHttpHeaderValid();
            }).toThrow("httpHeader cannot be null");
        });

    });

    describe("isHttpHeaderValueValid", () => {

        const invalidCases = [
            "",
            null,
            undefined
        ];

        const validCases = [
            "Foo"
        ];

        invalidCases.forEach(test => {
            it(`should return false for invalid value: ${test}`, () => {
                // Arrange
                let { validation } = getValidation();
                // Act
                var result = validation.isHttpHeaderValueValid(test);
                // Assert
                expect(result).toBe(false);
            });
        });

        validCases.forEach(test => {
            it(`should return true for valid value: ${test}`, () => {
                // Arrange
                let { validation } = getValidation();
                // Act
                var result = validation.isHttpHeaderValueValid(test);
                // Assert
                expect(result).toBe(true);
            });
        });
    })

    describe("isHttpHeaderNameValid", () => {

        const invalidCases = [
            "Foo)",
            "Foo(",
            "Foo<",
            "Foo>",
            "Foo@",
            "Foo,",
            "Foo;",
            "Foo:",
            "Foo\\",
            "Foo\"",
            "Foo/",
            "Foo[",
            "Foo]",
            "Foo?",
            "Foo=",
            "Foo{",
            "Foo}",
            "Foo	",
            null,
            undefined
        ];

        const validCases = [
            "Accept",
            "Cache-Control",
            "HTTP2-Settings",
            "DNT",
            "foobar",
            "Accept`",
            "Accept!"
        ];

        invalidCases.forEach(test => {

            it(`should return false for invalid value: ${test}`, () => {
                // Arrange
                let { validation } = getValidation();
                // Act
                var result = validation.isHttpHeaderNameValid(test);
                // Assert
                expect(result).toBe(false);
            });
        });

        validCases.forEach(test => {

            it(`should return true for valid value: ${test}`, () => {
                // Arrange
                let { validation } = getValidation();
                // Act
                var result = validation.isHttpHeaderNameValid(test);
                // Assert
                expect(result).toBe(true);
            });
        });

    });
});