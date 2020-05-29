import { getConnection } from 'typeorm';
import { URL } from 'url';

import { configCache } from '../../../config';
import { unfollowAccount } from '../../../controllers/follows';
import { Account } from '../../../entities/account';
import { User } from '../../../entities/user';
import { resolveLocalUsernameFromURI } from '../../../helpers/resolve-uri';
import { Activity } from '../types';

export default async function undo(activity: Activity): Promise<boolean> {
  if (!configCache) {
    return false;
  }

  const activityType = activity.type;
  const object = activity.object;

  if (activityType !== 'Undo' || typeof object !== 'object') {
    return false;
  }

  return await undoFollow(object);
}

async function undoFollow(activity: Activity): Promise<boolean> {
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

  await unfollowAccount(follower, followee.account);

  return true;
}
