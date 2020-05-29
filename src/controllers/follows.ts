import { getRepository } from 'typeorm';

import { Account } from '../entities/account';
import { Follow } from '../entities/follow';
import { generateId } from '../helpers/generate-id';

export async function followerInboxes(followeeId: string) {
  const repository = getRepository(Follow);
  const followers = await repository.find({ followee: { id: followeeId }, accepted: true });
  return followers.reduce<Set<string>>(
    (acc, follow) => (follow.follower.inbox ? acc.add(follow.follower.inbox) : acc),
    new Set(),
  );
}

export async function followAccount(follower: Account, followee: Account, accepted: boolean): Promise<boolean> {
  const repository = getRepository(Follow);
  const relation = new Follow(generateId(), follower, followee, accepted);
  try {
    repository.save(relation);
    return true;
  } catch {
    return false;
  }
}

export async function acceptFollow(follower: Account, followee: Account): Promise<boolean> {
  const repository = getRepository(Follow);
  const relation = await repository.findOne({
    follower: follower,
    followee: followee,
  });
  if (!relation) {
    return false;
  }
  relation.accepted = true;
  repository.save(relation);
  return true;
}

export async function unfollowAccount(follower: Account, followee: Account): Promise<boolean> {
  const repository = getRepository(Follow);
  try {
    repository.delete({
      follower: follower,
      followee: followee,
    });
    return true;
  } catch {
    return false;
  }
}
