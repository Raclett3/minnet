import { configCache } from '../config';

export function renderURI(kind: string, id: string) {
  if (!configCache) {
    throw Error('Configがロードされていません。');
  }

  return `https://${configCache.host}/${kind}/${id.toLowerCase()}`;
}
