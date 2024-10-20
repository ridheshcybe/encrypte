import ctr from "../lib/inner";
import generate from "./generate";

export class AES {
  debug: boolean = false;
  inner: ctr;
  constructor(key?: string, debug = false) {
    if (!key) {
      if (debug) console.debug("Debug: Changing key");
      key = generate();
      if (debug) console.debug(`Debug: Changed key to => ${key}`);
    }
    if (typeof key !== "string") throw new Error("key must be a string");

    this.inner = new ctr(key);
    this.debug = !!debug;
  }

  encrypt(text: string) {
    if (this.debug) console.debug(`encrypting ${text}`);
    const iv = generate();

    return this.inner.encrypt(text, iv) + ':(IVHERE):' + iv;
  }

  decrypt(encrypted: string) {
    if (this.debug) console.debug(`decrypting ${encrypted}`);
    const [cipher,iv] = encrypted.split(':(IVHERE):');
    return this.inner.decrypt(cipher,iv);
  }
}

export default AES;
