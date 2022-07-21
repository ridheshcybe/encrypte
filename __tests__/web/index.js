const mod = require('../../web/index').AES;

const app = new mod('hi');

it('encrypt', () => {
    expect(app.encrypt('hi')).not.toBe('hi');
})

it('decrypt', ()=>{
    expect(app.decrypt(app.encrypt('hi'))).toBe('hi');
})