"use strict";

export default class Table {

    constructor(tableView, validation) {
        this._tableView = tableView;
        this._validation = validation;
    }

    setVisible = (isVisible) => {
        isVisible
            ? this._tableView.show()
            : this._tableView.hide();
    }

    getValues = () => {

        var headers = this._tableView.getValues();

        if (headers) {
            headers = headers.filter(header => this._validation.isHttpHeaderValid(header));
        } else {
            headers = [];
        }

        return headers;
    }

    toggleSaveButtonState = () => {
        this._tableView.toggleSaveButtonState();
    }

    addNewHeader(httpHeader) {
        this._tableView.addRow(httpHeader);
    }

    render = (httpHeaders) => {
        httpHeaders.forEach(httpHeader => {
            this.addNewHeader(httpHeader);
        });
    }

    clear() {
        this._tableView.clear();
    }

}