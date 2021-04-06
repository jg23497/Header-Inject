"use strict";

export default class ChromeRuntime {

    sendMessage(message) {
        chrome.runtime.sendMessage(message);
    }

    async onMessage(callback) {
        chrome.runtime.onMessage.addListener((message) => {
            callback(message);
        });
    }

    removeBeforeSendHeadersCallback(callback) {
        chrome.webRequest.onBeforeSendHeaders.removeListener(callback);
    }

    addBeforeSendHeadersCallback(callback) {
        chrome.webRequest.onBeforeSendHeaders.addListener(
            callback,
            {
                urls: ["<all_urls>"]
            },
            [
                "requestHeaders",
                "blocking"
            ]);
    }

    clearContextMenu() {
        chrome.contextMenus.removeAll();
    }

    addContextMenuItem(title, onClickCallback) {
        chrome.contextMenus.create({
            title: title,
            contexts: [
                "browser_action"
            ],
            onclick: onClickCallback
        });
    }

}