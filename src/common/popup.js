"use strict";

import Configuration from "./configuration.js"
import Storage from "./storage.js"
import Options from "./options.js"
import Validation from "./validation.js";
import TableView from "./table-view.js";
import Table from "./table.js";
import OptionsView from "./options-view.js";
import ChromeStorage from "../chrome/chrome-storage.js";
import Runtime from "./runtime.js";
import ChromeRuntime from "../chrome/chrome-runtime.js";

var isPopup = location.hash == "#popup";

var background = chrome.extension.getBackgroundPage();
var injector = background.getInjector();

var chromeStorage = new ChromeStorage();
var storage = new Storage(chromeStorage);

var configuration = new Configuration(storage);
var validation = new Validation();
var optionsView = new OptionsView();
var tableView = new TableView(validation, optionsView);
var table = new Table(tableView, validation);

var chromeRuntime = new ChromeRuntime();
var runtime = new Runtime(chromeRuntime);
var options = new Options(injector, configuration, table, optionsView, runtime, isPopup);

options.render();
options.bindEventListeners();