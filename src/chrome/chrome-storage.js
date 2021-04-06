"use strict";

export default class ChromeStorage {

    async store(key, value, callback) {
        chrome.storage.sync.set({ [key]: value }, callback);
    }

    async get(key, callback) {
        chrome.storage.sync.get([key], callback);
    }

    onChange(targetKey, callback) {
        chrome.storage.onChanged.addListener(function (changes) {
            if (changes[targetKey]) {
                var storageChange = changes[targetKey];
                callback(storageChange.newValue);
            }
        });
    }

    getOnChange(targetKey, keysToReturn, callback) {
        chrome.storage.onChanged.addListener((changes) => {
            if (changes[targetKey]) {
                chrome.storage.sync.get(keysToReturn, callback);
            }
        });
    }

    onChangeAny(targetKeys, callback) {
        chrome.storage.onChanged.addListener(function (changes) {
            for (var key in changes) {
                if (targetKeys.includes(key)) {
                    callback();
                    return;
                }
            }
        });
    }
}