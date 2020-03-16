import { Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

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

  constructor(id: string, follower: Account, followee: Account) {
    this.id = id;
    this.follower = follower;
    this.followee = followee;
  }
}
