import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export default class SpotifyAuth extends BaseEntity {
  @PrimaryColumn()
  tokenType: string;

  @Column()
  tokenValue: string;
}
