import { BaseEntity, Entity, OneToMany, PrimaryColumn } from 'typeorm';

import { TracksToPlaylists } from './tracks_to_playlists';

@Entity()
export default class Track extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @OneToMany(
    () => TracksToPlaylists,
    (tracksToPlaylists) => tracksToPlaylists.track
  )
  tracksToPlaylists: TracksToPlaylists[];
}
