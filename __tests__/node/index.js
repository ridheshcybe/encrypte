const mod = require("../../app/index.js").default;

const app = new mod('hi');

it('encrypt', () => {
    expect(app.encrypt('hi')).not.toBe('hi');
})

it('decrypt', () => {
    const encrypted = app.encrypt('hi');
    const decrypted = app.decrypt(encrypted);
    expect(decrypted).toBe('hi');
})