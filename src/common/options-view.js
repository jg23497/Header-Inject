"use strict";

export default class OptionsView {

    _buttons = {
        add: {
            element: () => {
                return document.getElementById("add-header");
            }
        },
        save: {
            element: () => {
                return document.getElementById("save-headers");
            },
            setStatus: (isEnabled) => {
                if (isEnabled) {
                    this._buttons.save.element().removeAttribute("disabled");
                } else {
                    this._buttons.save.element().setAttribute("disabled", "");
                }
            }
        }
    };

    _messaging = {
        noheadersDefined: {
            element: () => {
                return document.getElementById("no-headers-defined-message");
            },
            show: () => {
                this._messaging
                    .noheadersDefined
                    .element()
                    .classList
                    .remove("is-hidden");
            },
            hide: () => {
                this._messaging
                    .noheadersDefined
                    .element()
                    .classList
                    .add("is-hidden");
            }
        },
        status: {
            activeClass: "is-success",
            inactiveClass: "is-danger",
            element: () => {
                return document.getElementById("status-indicator");
            },
            setStatus: (isEnabled) => {
                if (isEnabled) {
                    this._messaging.status.element().innerText = "Enabled";
                    this._messaging.status.element().classList.remove(this._messaging.status.inactiveClass);
                    this._messaging.status.element().classList.add(this._messaging.status.activeClass);
                } else {
                    this._messaging.status.element().innerText = "Disabled";
                    this._messaging.status.element().classList.remove(this._messaging.status.activeClass);
                    this._messaging.status.element().classList.add(this._messaging.status.inactiveClass);
                }
            }
        }
    };

    getSaveButtonElement = () => {
        return this._buttons.save.element();
    };

    getAddButtonElement = () => {
        return this._buttons.add.element();
    };

    getStatusButtonElement = () => {
        return this._messaging.status.element();
    }

    setStatus = (isEnabled) => {
        this._messaging.status.setStatus(isEnabled);
    };

    setSaveButtonStatus = (isEnabled) => {
        this._buttons.save.setStatus(isEnabled);
    };

    setNoHeadersDefinedMessageVisibility = (isVisible) => {
        var message = this._messaging.noheadersDefined;
        isVisible
            ? message.show()
            : message.hide();
    };
}