"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
var env_1 = require("./env");
var Logger = /** @class */ (function () {
    function Logger() {
        this.isDevelopment = env_1.env.NODE_ENV === "development";
    }
    Logger.prototype.formatMessage = function (level, message, context) {
        var timestamp = new Date().toISOString();
        var contextStr = context ? " ".concat(JSON.stringify(context)) : "";
        return "[".concat(timestamp, "] [").concat(level.toUpperCase(), "] ").concat(message).concat(contextStr);
    };
    Logger.prototype.log = function (level, message, context) {
        var formattedMessage = this.formatMessage(level, message, context);
        switch (level) {
            case "debug":
                if (this.isDevelopment) {
                    console.debug(formattedMessage);
                }
                break;
            case "info":
                if (this.isDevelopment) {
                    console.info(formattedMessage);
                }
                break;
            case "warn":
                console.warn(formattedMessage);
                break;
            case "error":
                console.error(formattedMessage);
                break;
        }
    };
    Logger.prototype.debug = function (message, context) {
        this.log("debug", message, context);
    };
    Logger.prototype.info = function (message, context) {
        this.log("info", message, context);
    };
    Logger.prototype.warn = function (message, context) {
        this.log("warn", message, context);
    };
    Logger.prototype.error = function (message, error, context) {
        var errorContext = __assign(__assign({}, context), (error instanceof Error
            ? {
                error: {
                    name: error.name,
                    message: error.message,
                    stack: error.stack,
                },
            }
            : { error: error }));
        this.log("error", message, errorContext);
    };
    return Logger;
}());
exports.logger = new Logger();
