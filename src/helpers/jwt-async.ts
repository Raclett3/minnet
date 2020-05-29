import { randomBytes } from 'crypto';
import { sign, verify } from 'jsonwebtoken';

import { readFile, writeFile } from './async-fs';

const loadSecret = (() => {
  let secret: string | null = null;
  return async (): Promise<string> => {
    if (!secret) {
      try {
        secret = await readFile(process.cwd() + '/jwt-secret');
      } catch {
        secret = randomBytes(64).toString('hex');
        await writeFile(process.cwd() + '/jwt-secret', secret);
      }
    }

    return secret;
  };
})();

export async function signJWT(content: string) {
  const secret = await loadSecret();

  return await new Promise<string>((resolve, reject) => {
    sign(content, secret, (err, token) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(token);
    });
  });
}

export async function verifyJWT(token: string) {
  const secret = await loadSecret();

  return await new Promise<string>((resolve, reject) => {
    verify(token, secret, (err, decoded) => {
      if (err) {
        reject(err);
        return;
      }
      if (typeof decoded !== 'string') {
        reject(new Error());
        return;
      }
      resolve(decoded);
    });
  });
}
