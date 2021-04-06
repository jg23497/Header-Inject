"use strict";

export default class Runtime {

    constructor(runtimeImplementation) {
        this._runtimeImplementation = runtimeImplementation;
    }

    sendMessage(message) {
        this._runtimeImplementation.sendMessage(message);
    }

    async onMessage(callback) {
        this._runtimeImplementation.onMessage(callback);
    }

    removeBeforeSendHeadersCallback(callback) {
        this._runtimeImplementation.removeBeforeSendHeadersCallback(callback);
    }

    addBeforeSendHeadersCallback(callback) {
        this._runtimeImplementation.addBeforeSendHeadersCallback(callback);
    }

    clearContextMenu() {
        this._runtimeImplementation.clearContextMenu();
    }

    addContextMenuItem(title, onClickCallback) {
        this._runtimeImplementation.addContextMenuItem(title, onClickCallback);
    }
}