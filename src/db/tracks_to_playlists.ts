import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import Playlist from './playlist';
import Track from './track';

@Entity()
export class TracksToPlaylists extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  createdAt: number;

  @Column()
  likes: number;

  @ManyToOne(() => Track, (track) => track.id)
  track: Track;

  @ManyToOne(() => Playlist, (playlist) => playlist.id)
  playlist: Playlist;
}
