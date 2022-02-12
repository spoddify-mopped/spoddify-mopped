import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { TracksToPlaylists } from './tracks_to_playlists';

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

  @OneToMany(
    () => TracksToPlaylists,
    (tracksToPlaylists) => tracksToPlaylists.playlist
  )
  tracksToPlaylists: TracksToPlaylists[];
}
