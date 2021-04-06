import * as Constants from "./constants.js";

"use strict";

export default class Configuration {

    constructor(storage) {
        this.storage = storage;
    }

    getHttpHeaderOverrides(callback) {
        this.storage.get(Constants.Storage.Keys.HeaderOverrides,
            (stored) => {
                var storedValue = stored[Constants.Storage.Keys.HeaderOverrides];
                callback(storedValue);
            });
    }

    putHttpHeaderOverrides(value, callback) {
        this.storage.store(Constants.Storage.Keys.HeaderOverrides, value, callback);
    }

    onChangeHeaders(callback) {
        this.storage.onChange(Constants.Storage.Keys.HeaderOverrides, callback);
    }

    setEnabled(isEnabled) {

        if (typeof isEnabled !== "boolean") {
            throw "isEnabled must be a boolean";
        }

        this.storage.store(Constants.Storage.Keys.IsEnabled, isEnabled);
    }

    getEnabled(callback) {
        this.storage.get(Constants.Storage.Keys.IsEnabled, (stored) => {
            var storedValue = stored[Constants.Storage.Keys.IsEnabled];
            callback(storedValue)
        });
    }

    onChangeEnabled(callback) {
        this.storage.onChange(Constants.Storage.Keys.IsEnabled, callback);
    }

    getOnChange(targetKey, keysToReturn, callback) {
        this.storage.getOnChange(targetKey, keysToReturn, callback);
    }

    onChangeAny(callback) {
        
        var targets = [
            Constants.Storage.Keys.IsEnabled,
            Constants.Storage.Keys.HeaderOverrides
        ];

        this.storage.onChangeAny(targets, callback);
    }
}