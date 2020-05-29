import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { Account } from './account';

@Entity()
@Index(['follower', 'followee'], { unique: true })
export class Follow {
  @PrimaryColumn('varchar', { length: 16 })
  public id: string;

  @ManyToOne(() => Account, { eager: true })
  @JoinColumn()
  public follower: Account;

  @ManyToOne(() => Account, { eager: true })
  @JoinColumn()
  public followee: Account;

  @Column('boolean')
  public accepted: boolean;

  constructor(id: string, follower: Account, followee: Account, accepted: boolean) {
    this.id = id;
    this.follower = follower;
    this.followee = followee;
    this.accepted = accepted;
  }
}
