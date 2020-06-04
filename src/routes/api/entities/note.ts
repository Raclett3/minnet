import { Note } from '../../../entities/note';
import { APIAccount, toAPIAccount } from './account';

export type APINote = { postedBy: APIAccount; createdAt: string } & Omit<Note, 'postedBy' | 'createdAt'>;

export function toAPINote(note: Note): APINote {
  const { createdAt, postedBy, ...rest } = note;
  const dateString = createdAt.toISOString();

  return {
    createdAt: dateString,
    postedBy: toAPIAccount(postedBy),
    ...rest,
  };
}
