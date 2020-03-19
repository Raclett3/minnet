import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

// Some columns get null for local users

@Entity()
@Index(['username', 'host'], { unique: true })
export class Account {
  @PrimaryColumn('varchar', { length: 16 })
  public id: string;

  @Index()
  @Column('varchar', { length: 128 })
  public username: string;

  @Column('varchar', { length: 128, nullable: true })
  public host: string | null;

  @Column('varchar', { length: 128 })
  public name: string;

  @Index({ unique: true })
  @Column('varchar', { length: 512, nullable: true })
  public uri: string | null;

  @Column('varchar', { length: 512, nullable: true })
  public inbox: string | null;

  @Column('varchar', { length: 2048, nullable: true })
  public publicKey: string | null;

  constructor(
    id: string,
    username: string,
    host: string | null,
    name: string,
    uri: string | null,
    inbox: string | null,
    publicKey: string | null,
  ) {
    this.id = id;
    this.username = username;
    this.host = host;
    this.name = name;
    this.uri = uri;
    this.inbox = inbox;
    this.publicKey = publicKey;
  }
}
