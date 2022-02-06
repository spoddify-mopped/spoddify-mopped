import { Artist, ArtistTopTracksResponse } from '../../clients/api.types';
import React, { useState } from 'react';

import ApiClient from '../../clients/api';
import CoverReplacement from '../../resources/cover_replacement.png';
import SearchTrackView from '../../components/SearchTrackView/SearchTrackView';
import styles from './ArtistView.module.scss';
import { useParams } from 'react-router-dom';

const ArtistView = (): React.ReactElement => {
  const params = useParams();

  const [artistInfo, setArtistInfo] = useState<Artist | undefined>(undefined);

  const [artistTopTracks, setArtistTopTracks] = useState<
    ArtistTopTracksResponse | undefined
  >(undefined);

  React.useEffect(() => {
    const id = params['id'];

    if (id) {
      ApiClient.getArtistTopTracks(id).then(setArtistTopTracks);
      ApiClient.getArtist(id).then(setArtistInfo);
    }
  }, [params]);

  if (!artistTopTracks || !artistInfo) {
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
      </div>
    </div>
  );
};

export default ArtistView;
