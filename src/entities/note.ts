import { Column, Entity, Index, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';

import { Account } from './account';

@Entity()
export class Note {
  @PrimaryColumn('varchar', { length: 16 })
  public id: string;

  @Index()
  @Column('timestamp with time zone')
  public createdAt: Date;

  @OneToOne(() => Note, { eager: true })
  @JoinColumn()
  public inReplyTo: Note | null;

  @Column('varchar', { length: 8192 })
  public content: string;

  @ManyToOne(() => Account, { eager: true })
  @JoinColumn()
  public postedBy: Account;

  constructor(id: string, createdAt: Date, inReplyTo: Note | null, content: string, postedBy: Account) {
    this.id = id;
    this.createdAt = createdAt;
    this.inReplyTo = inReplyTo;
    this.content = content;
    this.postedBy = postedBy;
  }
}
