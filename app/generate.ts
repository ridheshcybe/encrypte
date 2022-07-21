import { randomBytes as rando } from "crypto";

export function generate() {
  let randomIndex: number;
  let randomBytes: Buffer;

  const getNextRandomValue = () => {
    (void 0 === randomIndex || randomIndex >= randomBytes.length) &&
      ((randomIndex = 0), (randomBytes = rando(256)));
    var n = randomBytes[randomIndex];
    return (randomIndex += 1), n;
  };

  let pool =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()+_-=}{[]|:;"/?.><,`~';

  var password = "";

  for (var i = 0; i < 20; i++) {
    password +=
      pool[
        (() => {
          var rand = getNextRandomValue();
          while (rand >= 256 - (256 % pool.length)) {
            rand = getNextRandomValue();
          }
          return rand % pool.length;
        })()
      ];
  }

  return password;
}

export default generate;
