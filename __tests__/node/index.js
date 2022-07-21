const mod = require("../../app/index").default;

const app = new mod('hi');

it('encrypt', () => {
    expect(app.encrypt('hi')).not.toBe('hi');
})

it('decrypt', ()=>{
    expect(app.decrypt(app.encrypt('hi'))).toBe('hi');
})