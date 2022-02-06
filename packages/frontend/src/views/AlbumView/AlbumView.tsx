import { AlbumWithTracks, Artist } from '../../clients/api.types';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import ApiClient from '../../clients/api';
import SearchTrackView from '../../components/SearchTrackView/SearchTrackView';
import styles from './AlbumView.module.scss';

const AlbumView = (): React.ReactElement => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [album, setAlbum] = useState<AlbumWithTracks | undefined>(undefined);
  const [artist, setArtist] = useState<Artist | undefined>(undefined);

  useEffect(() => {
    (async () => {
      if (id) {
        const album = await ApiClient.getAlbum(id);
        setAlbum(album);

        const artist = await ApiClient.getArtist(album.artists[0].id);
        setArtist(artist);
      }
    })();
  }, [id]);

  if (!album || !artist) {
    return <></>;
  }

  return (
    <div>
      <div
        className={styles.header}
        style={{
          backgroundImage: `url(${artist.imageUrl})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          boxShadow: 'inset 0 0 0 2000px rgba(0, 0, 0, 0.9)',
        }}
      >
        <img className={styles.albumImage} src={album.imageUrl} alt="Cover" />
        <div className={styles.meta}>
          <span className={styles.title}>{album.name}</span>
          <div className={styles.artist}>
            <img
              className={styles.artistImage}
              src={artist.imageUrl}
              alt="Cover"
            />
            <span
              className={styles.artistName}
              onClick={() => {
                navigate(`/artist/${artist.id}`);
              }}
            >
              {artist.name}
            </span>
          </div>
        </div>
      </div>
      <div className={styles.innerContainer}>
        <SearchTrackView
          tracks={album.tracks}
          onAddTrackClick={async (track) => {
            await ApiClient.addTrack(track.id);
          }}
        />
      </div>
    </div>
  );
};

export default AlbumView;
