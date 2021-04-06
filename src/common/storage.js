"use strict";

export default class Storage {

    constructor(storageImplementation){
        this._storageImplementation = storageImplementation;
    }

    async store(key, value, callback) {
        this._storageImplementation.store(key, value, callback);
    }

    async get(key, callback) {
        this._storageImplementation.get(key, callback);
    }

    onChange(targetKey, callback) {
        this._storageImplementation.onChange(targetKey, callback);
    }

    getOnChange(targetKey, keysToReturn, callback) {
        this._storageImplementation.getOnChange(targetKey, keysToReturn, callback);
    }

    onChangeAny(targetKeys, callback) {
        this._storageImplementation.onChangeAny(targetKeys, callback);
    }
}