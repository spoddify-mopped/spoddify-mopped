import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import Track from './track';

@Entity()
export default class Playlist extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  createdAt: number;

  @Column()
  updatedAt: number;

  @ManyToMany(() => Track)
  @JoinTable()
  tracks: Track[];
}
