import { FindConditions, getConnection } from 'typeorm';

import { Account } from '../entities/account';
import { Note } from '../entities/note';
import { generateId } from '../helpers/generate-id';
import { ControllerError } from './error';

export async function createNote(accountCondition: FindConditions<Account>, content: string, inReplyToId?: string) {
  return await getConnection().transaction<Note>(async transaction => {
    const postedBy = await transaction.findOne(Account, accountCondition);
    if (!postedBy) {
      throw new ControllerError('The account does not exist');
    }

    let inReplyTo: Note | null = null;
    if (inReplyToId) {
      const note = await transaction.findOne(Note, { id: inReplyToId });
      if (!note) {
        throw new ControllerError("The note you're replying to does not exist");
      }
      inReplyTo = note;
    }

    const note = new Note(generateId(), new Date(), inReplyTo, content, postedBy, null);
    await transaction.insert(Note, note);
    return note;
  });
}
