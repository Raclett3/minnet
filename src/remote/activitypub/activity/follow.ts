import { getConnection } from 'typeorm';
import { URL } from 'url';

import { configCache } from '../../../config';
import { followAccount } from '../../../controllers/follows';
import { Account } from '../../../entities/account';
import { User } from '../../../entities/user';
import { appendContext, renderAccept } from '../../../helpers/activitypub/renderer';
import { renderURI } from '../../../helpers/render-uri';
import { resolveLocalUsernameFromURI } from '../../../helpers/resolve-uri';
import { deliver } from '../../deliver';
import { Activity } from '../types';

export default async function follow(activity: Activity): Promise<boolean> {
  if (!configCache) {
    return false;
  }

  const activityType = activity.type;
  const object = activity.object;
  const actor = activity.actor;

  if (activityType !== 'Follow' || typeof object !== 'string' || new URL(object).host !== configCache.host) {
    return false;
  }

  const actorUri = typeof actor === 'string' ? actor : actor && actor.id;
  const followeeName = resolveLocalUsernameFromURI(object);

  if (typeof actorUri !== 'string' || !followeeName) {
    return false;
  }

  const entityManager = getConnection().createEntityManager();
  const follower = await entityManager.findOne(Account, { uri: actorUri });
  const followee = await entityManager.findOne(User, { username: followeeName });

  if (!follower || !followee) {
    return false;
  }

  const uri = renderURI('users', followee.username);
  const accept = appendContext(renderAccept(uri, activity));
  await deliver(followee.account.name, Buffer.from(followee.privateKey), follower.inbox || '', accept);
  await followAccount(follower, followee.account, true);

  return true;
}
