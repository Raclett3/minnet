import axios from 'axios';
import { createHash } from 'crypto';
import RSA from 'node-rsa';
import { URL } from 'url';

import { readFile } from '../helpers/async-fs';

export async function deliver(keyId: string, target: string, document: {}): Promise<boolean> {
  const url = new URL(target);
  const date = new Date();
  const rsa = new RSA(Buffer.from(await readFile(process.cwd() + '/private.pem')));

  const dateUTC = date.toUTCString();
  const digest = createHash('sha256')
    .update(JSON.stringify(document))
    .digest('base64');
  const signedString = `date: ${dateUTC}\ndigest: SHA-256=${digest}`;
  const signature = rsa.sign(signedString).toString('base64');

  try {
    const res = await axios.post(`${url.protocol}//${url.host}/inbox`, document, {
      headers: {
        Host: url.host,
        Date: dateUTC,
        Digest: `SHA-256=${digest}`,
        Signature: `keyId="${keyId}",headers="date digest",signature="${signature}",algorithm="rsa-sha256"`,
      },
    });
    console.log(res);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}
