"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
function generate() {
    const password = [''];
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()+_-=}{[]|:;"/?.><,`~'.split("");
    for (let i = 0; i < 20; i++)
        password.push(chars[crypto.getRandomValues(new Uint8Array(10))[0] % chars.length]);
    return password.join("");
}
exports.generate = generate;
exports.default = generate;
