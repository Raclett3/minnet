import { configCache } from '../../config';

export function appendContext(object: {}) {
  return {
    '@context': ['https://www.w3.org/ns/activitystreams', 'https://w3id.org/security/v1'],
    ...object,
  };
}

export function renderLocalPerson(username: string, name: string, publicKeyPem: string) {
  if (!configCache) {
    throw Error('Configがロードされていません。');
  }

  return {
    id: `https://${configCache.host}/users/${username}`,
    type: 'Person',
    preferredUsername: username,
    name: name,
    inbox: `https://${configCache.host}/inbox`,

    publicKey: {
      id: `https://${configCache.host}/users/${username}#main-key`,
      owner: `https://${configCache.host}/users/${username}`,
      publicKeyPem: publicKeyPem,
    },
  };
}
