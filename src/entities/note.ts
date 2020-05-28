import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { Account } from './account';

@Entity()
export class Note {
  @PrimaryColumn('varchar', { length: 16 })
  public id: string;

  @Index()
  @Column('timestamp with time zone')
  public createdAt: Date;

  @ManyToOne(() => Note)
  @JoinColumn()
  public inReplyTo: Promise<Note | null> | Note | null;

  @Column('varchar', { length: 8192 })
  public content: string;

  @ManyToOne(() => Account, { eager: true })
  @JoinColumn()
  public postedBy: Account;

  @Index({ unique: true })
  @Column('varchar', { length: 512, nullable: true })
  public uri: string | null;

  constructor(
    id: string,
    createdAt: Date,
    inReplyTo: Note | null,
    content: string,
    postedBy: Account,
    uri: string | null,
  ) {
    this.id = id;
    this.createdAt = createdAt;
    this.inReplyTo = inReplyTo;
    this.content = content;
    this.postedBy = postedBy;
    this.uri = uri;
  }
}
