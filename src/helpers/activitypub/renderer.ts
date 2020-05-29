import { configCache } from '../../config';
import { generateId } from '../generate-id';
import { renderURI } from '../render-uri';

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
    id: renderURI('users', username),
    type: 'Person',
    preferredUsername: username,
    name: name,
    inbox: `https://${configCache.host}/inbox`,

    publicKey: {
      id: renderURI('keypair', username),
      owner: renderURI('users', username),
      publicKeyPem: publicKeyPem,
    },
  };
}

export function renderNote(id: string, date: Date, attributedTo: string, content: string, inReplyTo?: string) {
  if (!configCache) {
    throw Error('Configがロードされていません。');
  }

  return {
    id: renderURI('notes', id),
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
    id: renderURI('create', generateId()),
    type: 'Create',
    actor: actor,

    object: object,
  };
}

export function renderAccept(actor: string, object: {}) {
  return {
    type: 'Accept',
    actor: actor,

    object: object,
  };
}

export function renderFollow(actor: string, object: string) {
  return {
    type: 'Follow',
    actor: actor,
    object: object,
  };
}
