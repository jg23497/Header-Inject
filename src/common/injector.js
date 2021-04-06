"use strict";

import * as Constants from "../common/constants.js";

export default class Injector {

    constructor(configuration, runtime) {
        this._config = configuration;
        this._runtime = runtime;
        this._requestHeaderHandleListener = null;
    }

    _injectRequestHeaders = (request, httpHeaderOverrides) => {

        httpHeaderOverrides.forEach(override => {

            if (override.enabled) {

                var header = {
                    name: override.name,
                    value: override.value
                }

                request.requestHeaders = request.requestHeaders
                    .filter(h => h.name.toLowerCase() != header.name.toLowerCase());

                request.requestHeaders.push(header);
            }

        });

        return {
            requestHeaders: request.requestHeaders
        };

    }

    _overrideHeaders = (headers) => {
        if (headers) {
            this._runtime.addBeforeSendHeadersCallback(
                this._requestHeaderHandleListener = (request) => {
                    return this._injectRequestHeaders(request, headers)
                });
        }
    }

    _setEnabledContextMenuItem = (isEnabled) => {

        this._runtime.clearContextMenu();

        var title = isEnabled
            ? "Disable"
            : "Enable";

        this._runtime.addContextMenuItem(
            title,
            () => {
                this.handleStatusChange(isEnabled, true);
            });
    }

    _clearHeaderEventListener = () => {
        if (this._requestHeaderHandleListener) {
            this._runtime.removeBeforeSendHeadersCallback(this._requestHeaderHandleListener);
            this._requestHeaderHandleListener = null;
        }
    }

    _configureHeaderInterception = (isEnabled) => {

        if (isEnabled) {
            this._config.getHttpHeaderOverrides(this._overrideHeaders);
        }

        var targets = [
            Constants.Storage.Keys.HeaderOverrides,
            Constants.Storage.Keys.IsEnabled
        ];

        this._config.getOnChange(Constants.Storage.Keys.HeaderOverrides, targets, (changes) => {

            this._clearHeaderEventListener();
            var httpHeaders = changes.HttpHeaders;
            var isEnabled = changes.IsEnabled;

            if (isEnabled && httpHeaders && httpHeaders.length >= 1) {
                this._setEnabledContextMenuItem(true);
                this._overrideHeaders(httpHeaders);
            }

        });
    }

    _setEventListeners = () => {
        this._clearHeaderEventListener();
        this._config.getEnabled((isEnabled) => {
            this._configureHeaderInterception(isEnabled);
            this._setEnabledContextMenuItem(isEnabled);
        });
    }

    handleStatusChange = (isEnabled, isSourceContextMenu) => {

        var newValue = !isEnabled;
        this._config.setEnabled(newValue);

        if (newValue) {
            this._setEventListeners();
        } else {
            this._clearHeaderEventListener();
        }

        if (isSourceContextMenu) {
            this._runtime.sendMessage({ command: Constants.Messaging.Commands.Redraw });
        }
    }

    run = () => {
        this._setEventListeners();
        this._config.onChangeEnabled((isEnabled) => {
            this._setEnabledContextMenuItem(isEnabled);
        });
    }
}