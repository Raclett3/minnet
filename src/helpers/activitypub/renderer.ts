import { configCache } from '../../config';
import { generateId } from '../generate-id';

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

export function renderNote(id: string, date: Date, attributedTo: string, content: string, inReplyTo?: string) {
  if (!configCache) {
    throw Error('Configがロードされていません。');
  }

  return {
    id: `https://${configCache.host}/notes/${id}`,
    type: 'Note',
    published: date.toISOString(),
    attributedTo: attributedTo,
    inReplyTo: inReplyTo,
    content: content,
    to: 'https://www.w3.org/ns/activitystreams#Public',
  };
}

export function renderCreate(actor: string, object: {}) {
  if (!configCache) {
    throw Error('Configがロードされていません。');
  }

  return {
    id: `https://${configCache.host}/create/${generateId()}`,
    type: 'Create',
    actor: actor,

    object: object,
  };
}
