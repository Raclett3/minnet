import { getRepository } from 'typeorm';

import { Follow } from '../entities/follow';

export async function followerInboxes(followeeId: string) {
  const repository = getRepository(Follow);
  const followers = await repository.find({ followee: { id: followeeId } });
  return followers.reduce<Set<string>>(
    (acc, follow) => (follow.follower.inbox ? acc.add(follow.follower.inbox) : acc),
    new Set(),
  );
}
