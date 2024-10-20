"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AES = void 0;
const inner_1 = require("../lib/inner");
const generate_1 = require("./generate");
class AES {
    debug = false;
    inner;
    constructor(key, debug = false) {
        if (!key) {
            if (debug)
                console.debug("Debug: Changing key");
            key = (0, generate_1.default)();
            if (debug)
                console.debug(`Debug: Changed key to => ${key}`);
        }
        if (typeof key !== "string")
            throw new Error("key must be a string");
        this.inner = new inner_1.default(key);
        this.debug = !!debug;
    }
    encrypt(text) {
        if (this.debug)
            console.debug(`encrypting ${text}`);
        const iv = crypto.randomUUID().slice(0, 32);
        return this.inner.encrypt(text, iv) + ':(IVHERE):' + iv;
    }
    decrypt(encrypted) {
        if (this.debug)
            console.debug(`decrypting ${encrypted}`);
        const [cipher, iv] = encrypted.split(':(IVHERE):');
        return this.inner.decrypt(cipher, iv);
    }
}
exports.AES = AES;
exports.default = AES;
