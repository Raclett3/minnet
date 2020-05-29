import { URL } from 'url';

import { Activity } from '../remote/activitypub/types';

export const validateUsername = (username: string) => /^[a-zA-Z0-9]{1,32}$/.test(username);
export const validateRemoteUsername = (username: string) => /^[a-zA-Z0-9_-]+/.test(username);
export const validatePassword = (password: string) => /^[\x20-\x7e]{8,64}$/.test(password);

export function validateNote(activity: Activity, host: string | null = null): boolean {
  const expectedTypes = ['Article', 'Audio', 'Document', 'Image', 'Note', 'Page', 'Question', 'Video'];

  return (
    typeof activity.type === 'string' &&
    expectedTypes.includes(activity.type) &&
    typeof activity.id === 'string' &&
    (host === null || new URL(activity.id).host === host) &&
    typeof activity.attributedTo === 'string' &&
    typeof activity.content === 'string'
  );
}
