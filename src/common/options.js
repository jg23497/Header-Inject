import * as Constants from "./constants.js";

"use strict";

export default class Options {

    constructor(injector, configuration, table, optionsView, runtime, isPopup) {
        this._injector = injector;
        this._config = configuration;
        this._table = table;
        this._optionsView = optionsView;
        this._runtime = runtime;
        this.isPopup = isPopup;
    }

    _redraw = () => {
        this._table.clear();
        this._optionsView.setSaveButtonStatus(false);
        this.render();
    };

    _handleMessage = (message) => {
        if (message.command == Constants.Messaging.Commands.Redraw) {
            this._redraw();
        }
    }

    _toggleStatus = () => {
        this._config.getEnabled((isEnabled) => {
            this._injector.handleStatusChange(isEnabled, false);
            this._optionsView.setStatus(!isEnabled);
        });
    };

    addHeader = () => {

        this._optionsView.setNoHeadersDefinedMessageVisibility(false);

        this._table
            .setVisible(true);

        this._table
            .addNewHeader({
                name: "",
                value: "",
                enabled: true
            });

        this._table.toggleSaveButtonState();
    };

    renderTable = (headers) => {
        if (this.hasOverrides(headers)) {
            this._table.render(headers);
            this._table.setVisible(true);
            this._optionsView.setNoHeadersDefinedMessageVisibility(false);
        } else {
            this._optionsView.setNoHeadersDefinedMessageVisibility(true);
            this._table.setVisible(false);
        }
    }

    renderEnabled = (isEnabled) => {
        this._optionsView.setStatus(isEnabled);
    };

    save = () => {
        var headers = this._table.getValues();
        if (headers) {
            this._config.putHttpHeaderOverrides(headers, () => {
                this._redraw();
            });
        }
    }

    hasOverrides = (overrides) => {
        return overrides != undefined && overrides.length > 0;
    }

    bindEventListeners = () => {

        this._optionsView.getAddButtonElement()
            .addEventListener("click", this.addHeader);

        this._optionsView.getSaveButtonElement()
            .addEventListener("click", this.save);

        this._optionsView.getStatusButtonElement()
            .addEventListener("click", this._toggleStatus);

        if (this.isPopup) {
            this._config.onChangeAny(() => {
                this._runtime.sendMessage({ command: Constants.Messaging.Commands.Redraw });
            });
        } else {
            this._runtime.onMessage(this._handleMessage);
        }
    }

    render = () => {
        this._config.getHttpHeaderOverrides((headers) => {
            this.renderTable(headers);
        });

        this._config.getEnabled((isEnabled) => {
            this.renderEnabled(isEnabled);
        });
    }
}