import { FindConditions, getConnection } from 'typeorm';

import { Account } from '../entities/account';
import { Note } from '../entities/note';
import { generateId } from '../helpers/generate-id';
import { resolveNote } from '../remote/resolver';
import { ControllerError } from './error';

type Option = {
  createdAt?: Date;
  inReplyToUri?: string;
  uri?: string;
  content: string;
};

export async function createNote(accountCondition: FindConditions<Account>, option: Option): Promise<Note> {
  return await getConnection().transaction<Note>(async transaction => {
    const postedBy = await transaction.findOne(Account, accountCondition);
    if (!postedBy) {
      throw new ControllerError('The account does not exist');
    }

    let inReplyTo: Note | null = null;
    if (option.inReplyToUri) {
      const note = await resolveNote(option.inReplyToUri);
      if (!note) {
        throw new ControllerError("The note you're replying to does not exist");
      }
      inReplyTo = note;
    }

    const date = option.createdAt || new Date();
    const note = new Note(generateId(), date, inReplyTo, option.content, postedBy, option.uri || null);
    await transaction.insert(Note, note);

    for (const key of Object.keys(timelineSubscribers)) {
      timelineSubscribers[key].callback(note);
    }

    return note;
  });
}

const timelineSubscribers: {
  [key: string]: TimelineSubscriber;
} = {};

export class TimelineSubscriber {
  private id: string = generateId();

  constructor(public callback: (event: Note) => unknown) {
    timelineSubscribers[this.id] = this;
  }

  remove() {
    delete timelineSubscribers[this.id];
  }
}
