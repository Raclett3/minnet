import { getRepository } from 'typeorm';

import { Follow } from '../entities/follow';

export async function followerInboxes(followeeId: string) {
  const repository = getRepository(Follow);
  const followers = await repository.find({ followee: { id: followeeId } });
  return followers.reduce<string[]>((acc, follow) => {
    const inbox = follow.follower.inbox;
    if (inbox && !acc.includes(inbox)) {
      acc.push(inbox);
    }
    return acc;
  }, []);
}
