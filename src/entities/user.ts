import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

import { Account } from './account';

@Entity()
export class User {
  @PrimaryColumn('varchar', { length: 64 })
  public username: Account['username'];

  @Column('varchar', { length: 256 })
  public encryptedPassword: string;

  @OneToOne(() => Account, { eager: true })
  @JoinColumn()
  public account: Account;

  @Column('varchar', { length: 2048 })
  public privateKey: string;

  @Column('varchar', { length: 2048 })
  public publicKey: string;

  constructor(username: string, encryptedPassword: string, account: Account, privateKey: string, publicKey: string) {
    this.username = username;
    this.encryptedPassword = encryptedPassword;
    this.account = account;
    this.privateKey = privateKey;
    this.publicKey = publicKey;
  }
}
