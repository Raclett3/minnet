import { URL } from 'url';

import { configCache } from '../config';

export function resolveLocalUsernameFromURI(uri: string): string | null {
  if (!configCache) {
    throw Error('Configがロードされていません。');
  }

  const url = new URL(uri);
  if (url.host !== configCache.host) {
    return null;
  }

  return url.pathname.split('/').slice(-1)[0] || null;
}
