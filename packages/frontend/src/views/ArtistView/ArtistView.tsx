import {
  Artist,
  ArtistTopTracksResponse,
  ArtistsAlbumsResponse,
} from '../../clients/api.types';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import ApiClient from '../../clients/api';
import ArtistsAlbumsPreview from '../../components/ArtistsAlbumsPreview/ArtistsAlbumsPreview';
import CoverReplacement from '../../resources/cover_replacement.png';
import SearchTrackView from '../../components/SearchTrackView/SearchTrackView';
import styles from './ArtistView.module.scss';

const ALBUM_PREVIEW_LIMIT = 9;

const ArtistView = (): React.ReactElement => {
  const params = useParams();
  const navigate = useNavigate();

  const [artistInfo, setArtistInfo] = useState<Artist | undefined>(undefined);

  const [artistTopTracks, setArtistTopTracks] = useState<
    ArtistTopTracksResponse | undefined
  >(undefined);

  const [albums, setAlbums] = useState<ArtistsAlbumsResponse | undefined>(
    undefined
  );

  React.useEffect(() => {
    const id = params['id'];

    if (id) {
      ApiClient.getArtist(id).then(setArtistInfo);
      ApiClient.getArtistTopTracks(id).then(setArtistTopTracks);
      ApiClient.getArtistsAlbums(id, ALBUM_PREVIEW_LIMIT).then(setAlbums);
    }
  }, [params]);

  if (!artistTopTracks || !artistInfo || !albums) {
    return <></>;
  }

  return (
    <div className={styles.artistView}>
      <div
        className={styles.header}
        style={{
          backgroundImage: `url(${artistInfo.imageUrl})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          boxShadow: 'inset 0 0 0 2000px rgba(0, 0, 0, 0.9)',
        }}
      >
        <span className={styles.artistName}>{artistInfo.name}</span>
        <img
          className={styles.cover}
          src={artistInfo.imageUrl || CoverReplacement}
          alt="Cover"
        />
      </div>
      <div className={styles.innerContainer}>
        <h2>Top tracks</h2>
        <SearchTrackView
          tracks={artistTopTracks.tracks}
          onAddTrackClick={async (track) => {
            await ApiClient.addTrack(track.id);
          }}
        />
        <h2>Albums</h2>
        <ArtistsAlbumsPreview
          items={albums.albums}
          onItemClick={(id: string) => {
            navigate(`/album/${id}`);
          }}
        />
      </div>
    </div>
  );
};

export default ArtistView;
