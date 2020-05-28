import { createNote } from '../../../controllers/notes';
import { validateNote } from '../../../helpers/validators';
import { resolveAccount } from '../../resolver';
import { Activity } from '../types';

export default async function create(activity: Activity): Promise<boolean> {
  const activityType = activity.type;
  const object = activity.object;
  const actor = activity.actor;

  if (activityType !== 'Create' || typeof object !== 'object') {
    return false;
  }

  const actorUri = typeof actor === 'string' ? actor : actor && actor.id;

  if (typeof actorUri === 'object') {
    return true;
  }

  return await createPost(object, actorUri);
}

async function createPost(activity: Activity, actorUri: string | undefined): Promise<boolean> {
  if (!validateNote(activity)) {
    return false;
  }

  const { id: uri, published, attributedTo, content } = activity as { [key: string]: string };

  const date = published ? new Date(published) : new Date();
  const actor = actorUri || attributedTo;

  if (!actor) {
    return false;
  }

  const resolved = await resolveAccount(actor);

  await createNote({ uri: resolved.uri }, { content: content, createdAt: date, uri: uri });

  return true;
}
