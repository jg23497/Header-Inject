"use strict";

import Storage from "../common/storage.js"
import Configuration from "../common/configuration.js"
import Injector from "../common/injector.js"
import ChromeStorage from "./chrome-storage.js";
import Runtime from "../common/runtime.js";
import ChromeRuntime from "./chrome-runtime.js";

var chromeRuntime = new ChromeRuntime();
var runtime = new Runtime(chromeRuntime);

var chromeStorage = new ChromeStorage();
var storage = new Storage(chromeStorage);

var configuration = new Configuration(storage);
var injector = new Injector(configuration, runtime);

function getInjector() {
    return injector;
}

injector.run();
window.getInjector = getInjector;