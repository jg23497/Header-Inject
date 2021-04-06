"use strict";

export default class Validation {

    isHttpHeaderValid = (httpHeader) => {

        if (httpHeader == null){
            throw "httpHeader cannot be null";
        }

        var areHeaderValuesPresent = Boolean(httpHeader.name && httpHeader.value);
        var enabledValueIsBoolean = typeof httpHeader.enabled === "boolean";
        return areHeaderValuesPresent && enabledValueIsBoolean
    }

    isHttpHeaderNameValid = (httpHeaderName) => {
        if (httpHeaderName) {
            var regularExpression = /^[^\?\]\[\/=\(\)\<\>@,;:\\\"\{\}\t\x00-\x1F\x7F]+$/;
            return regularExpression.test(httpHeaderName);
        }
        return false;
    }

    isHttpHeaderValueValid = (httpHeaderValue) => {
        return Boolean(httpHeaderValue);
    }
    
}