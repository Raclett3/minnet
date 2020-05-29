import { getRepository } from 'typeorm';
import { URL } from 'url';

import { configCache } from '../../../config';
import { acceptFollow as acceptFollowRequest } from '../../../controllers/follows';
import { User } from '../../../entities/user';
import { resolveLocalUsernameFromURI } from '../../../helpers/resolve-uri';
import { resolveAccount } from '../../resolver';
import { Activity } from '../types';

export default async function accept(activity: Activity): Promise<boolean> {
  const activityType = activity.type;
  const object = activity.object;
  const actor = activity.actor;

  if (activityType !== 'Accept' || typeof object !== 'object') {
    return false;
  }

  const actorUri = typeof actor === 'string' ? actor : actor && actor.id;

  if (typeof actorUri === 'object') {
    return true;
  }

  return await acceptFollow(object, actorUri);
}

async function acceptFollow(activity: Activity, actorUri: string | undefined): Promise<boolean> {
  if (!configCache) {
    return false;
  }

  const activityType = activity.type;
  const object = activity.object;
  const actor = activity.actor;

  if (activityType !== 'Follow' || typeof object !== 'string' || new URL(object).host !== configCache.host) {
    return false;
  }

  const actualActorUri = typeof actor === 'string' ? actor : actor && actor.id;
  const followeeName = resolveLocalUsernameFromURI(object);

  if (typeof actorUri !== 'string' || actualActorUri !== actorUri || !followeeName) {
    return false;
  }

  const follower = await resolveAccount(actorUri);
  const followee = await getRepository(User).findOne({ username: followeeName });

  if (!follower || !followee) {
    return false;
  }

  return await acceptFollowRequest(follower, followee.account);
}
