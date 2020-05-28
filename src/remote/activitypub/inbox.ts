import { ParsedSignature, verifySignature } from 'http-signature';

import { resolveAccount } from '../resolver';
import create from './activity/create';
import follow from './activity/follow';
import undo from './activity/undo';
import { Activity } from './types';

async function verifyActivitySignature(activity: Activity, signature: ParsedSignature): Promise<boolean> {
  const actor = activity.actor;
  if (typeof actor !== 'string') {
    return false;
  }

  try {
    const account = await resolveAccount(actor);
    if (typeof account.publicKey !== 'string') {
      return false;
    }

    return verifySignature(signature, account.publicKey);
  } catch {
    return false;
  }
}

export async function inbox(activity: Activity, signature: ParsedSignature) {
  if (!verifyActivitySignature(activity, signature)) {
    return;
  }

  (await create(activity)) || (await follow(activity)) || (await undo(activity));
}
