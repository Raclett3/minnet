import axios from 'axios';
import { createHash } from 'crypto';
import RSA from 'node-rsa';
import { URL } from 'url';

import { configCache } from '../config';
import { renderURI } from '../helpers/render-uri';

export async function deliver(
  keyOwnerName: string,
  privateKey: Buffer,
  target: string,
  document: {},
): Promise<boolean> {
  if (!configCache) {
    return false;
  }

  const url = new URL(target);
  const date = new Date();
  const rsa = new RSA(privateKey);

  const dateUTC = date.toUTCString();
  const digest = createHash('sha256')
    .update(JSON.stringify(document))
    .digest('base64');
  const signedString = `date: ${dateUTC}\ndigest: SHA-256=${digest}`;
  const signature = rsa.sign(signedString).toString('base64');

  try {
    const uri = renderURI('keypair', keyOwnerName);
    const res = await axios.post(target, document, {
      headers: {
        Host: url.host,
        Date: dateUTC,
        Digest: `SHA-256=${digest}`,
        Signature: `keyId="${uri}",headers="date digest",signature="${signature}",algorithm="rsa-sha256"`,
      },
    });
    console.log(res);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}
