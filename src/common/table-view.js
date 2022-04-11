"use strict";

export default class TableView {

    constructor(validation, optionsView) {
        this._validation = validation;
        this._optionsView = optionsView;
    }

    _classes = {
        hidden: "is-hidden",
        danger: "is-danger",
        strikethrough: "strikethrough"
    }

    _elements = {
        table: {
            element: () => {
                return document.getElementById("http-headers");
            },
            bodyElement: () => {
                return document.getElementById("http-headers-table-body");
            },
            show: () => {
                this._elements
                    .table
                    .element()
                    .classList
                    .remove(this._classes.hidden);
            },
            hide: () => {
                this._elements
                    .table
                    .element()
                    .classList
                    .add(this._classes.hidden);
            },
            clear: () => {
                this._elements
                    .table
                    .bodyElement()
                    .innerHTML = "";
            }
        }
    }

    _getHttpHeader = (row) => {

        var labelElement = row.children[0].querySelector("input");
        var headerNameElement = row.children[1].querySelector("input");
        var headerValueElement = row.children[2].querySelector("input");
        var isHeaderNameValid = !(!headerNameElement.checkValidity() || !this._validation.isHttpHeaderNameValid(headerNameElement.value));
        var isHeaderValueValid = !(!headerValueElement.checkValidity() || !this._validation.isHttpHeaderValueValid(headerValueElement.value));

        return {
            label: labelElement.value,
            name: headerNameElement.value,
            valid: isHeaderNameValid && isHeaderValueValid,
            value: headerValueElement.value,
            enabled: row.children[3]
                .querySelector("input")
                .checked
        };
    }

    _isRowToBeSaved = (row) => {
        var isTableHeader = row.querySelector("th");
        var isDeleted = row.classList.contains(this._classes.strikethrough);
        return !isTableHeader && !isDeleted;
    }

    _addLabelCell = (newRow, labelText) => {
        var cell = newRow.insertCell(0);
        var div = this._createTextField("Label (optional)", labelText);
        var inputElement = div.querySelector("input");
        inputElement.addEventListener("input", this._toggleSaveButtonState);
        cell.appendChild(div);
    };

    _addNameCell = (newRow, headerName) => {
        var cell = newRow.insertCell(1);
        var div = this._createTextField("Name", headerName);
        var inputElement = div.querySelector("input");
        inputElement.addEventListener("input", this._validateHeaderName);
        inputElement.addEventListener("input", this._toggleSaveButtonState);
        cell.appendChild(div);
    }

    _addValueCell = (newRow, headerValue) => {
        var cell = newRow.insertCell(2);
        var div = this._createTextField("Value", headerValue);
        var inputElement = div.querySelector("input");
        inputElement.addEventListener("input", this._validateHeaderValue);
        div.addEventListener("input", this._toggleSaveButtonState);
        cell.appendChild(div);
    }

    _createTextField = (placeholder, value) => {
        var div = document.createElement("div");
        div.className = "field";

        var control = document.createElement("div");
        control.className = "control";
        div.appendChild(control);

        var input = document.createElement("input");
        input.className = "input";
        input.type = "text";
        input.setAttribute("placeholder", placeholder);
        input.value = value;

        control.appendChild(input);
        return div;
    }

    _addEnableCell = (newRow, isEnabled) => {
        var cell = newRow.insertCell(3);
        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = isEnabled;
        checkbox.addEventListener("change", this._toggleSaveButtonState);
        cell.appendChild(checkbox);
    }

    _addControlsCell = (newRow) => {
        var cell = newRow.insertCell(4);
        var div = document.createElement("div");
        div.className = "buttons";

        var deleteButton = document.createElement("button");
        deleteButton.className = "delete-button button is-danger is-light is-small";
        deleteButton.innerText = "Delete";
        deleteButton.addEventListener("click", this._deleteClickHandler);
        deleteButton.addEventListener("click", this._toggleSaveButtonState);
        div.appendChild(deleteButton);

        var undoButton = document.createElement("button");
        undoButton.className = "undo button is-hidden is-small";
        undoButton.innerText = "Undo";
        undoButton.addEventListener("click", this._undoClickHandler);
        undoButton.addEventListener("click", this._toggleSaveButtonState);

        div.appendChild(undoButton);
        cell.classList.add("controls-cell");

        cell.appendChild(div);
    }

    _getTableRow = (controlElement) => {
        var tableCell = controlElement.parentElement;
        var tableRow = tableCell.parentElement.parentElement;
        return tableRow;
    }

    _toggleSaveButtonState = () => {

        var values = this.getValues();
        var oneOrMoreInvalid = values == null;
        
        if (oneOrMoreInvalid) {
            this._optionsView.setSaveButtonStatus(false);
        } else {
            this._optionsView.setSaveButtonStatus(true);
        }
    }

    _validateHeaderName = (event) => {
        if (!this._validation.isHttpHeaderNameValid(event.target.value)) {
            event.target.classList.add(this._classes.danger);
            event.target.setCustomValidity("Enter a valid HTTP header name");
            event.target.reportValidity();
        } else {
            event.target.classList.remove(this._classes.danger);
            event.target.setCustomValidity("");
        }
    }

    _validateHeaderValue = (event) => {
        if (!this._validation.isHttpHeaderValueValid(event.target.value)) {
            event.target.classList.add(this._classes.danger);
            event.target.setCustomValidity("Enter a value");
            event.target.reportValidity();
        } else {
            event.target.classList.remove(this._classes.danger);
            event.target.setCustomValidity("");
        }
    }

    _undoClickHandler = (event) => {
        event.currentTarget.classList.add(this._classes.hidden);
        var tableRow = this._getTableRow(event.currentTarget);
        tableRow.classList.remove(this._classes.strikethrough);

        tableRow.children[4]
            .querySelector("button.delete-button")
            .classList
            .remove(this._classes.hidden);
    }

    _deleteClickHandler = (event) => {
        event.currentTarget.classList.add(this._classes.hidden);
        var tableRow = this._getTableRow(event.currentTarget);
        var table = tableRow.parentElement;
        var header = this._getHttpHeader(tableRow);

        if (!this._validation.isHttpHeaderValid(header)) {
            table.removeChild(tableRow);
        } else {
            tableRow.classList.add(this._classes.strikethrough);
            tableRow.children[4]
                .querySelector("button.undo")
                .classList
                .remove(this._classes.hidden);
        }
    }

    show = () => {
        this._elements
            .table
            .show();
    }

    hide = () => {
        this._elements
            .table
            .hide();
    }

    clear = () => {
        this._elements
            .table
            .clear();
    }

    addRow = (httpHeader) => {
        var row = this._elements
            .table
            .bodyElement()
            .insertRow();

        this._addLabelCell(row, httpHeader.label ?? "");
        this._addNameCell(row, httpHeader.name);
        this._addValueCell(row, httpHeader.value);
        this._addEnableCell(row, httpHeader.enabled);
        this._addControlsCell(row);
    }

    getValues = () => {
        var headers = [];
        var table = this._elements.table.element();
        for (let row of table.rows) {
            if (this._isRowToBeSaved(row)) {
                var header = this._getHttpHeader(row);
                if (!header.valid) {
                    return null;
                }
                headers.push(header);
            }
        }
        return headers;
    }

    toggleSaveButtonState = () => {
        this._toggleSaveButtonState();
    }
}