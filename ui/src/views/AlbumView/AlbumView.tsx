import { AlbumWithTracks, Artist } from '../../clients/api.types';
import React, { useEffect, useState } from 'react';
import Table, {
  TableData,
  TableHead,
  TableRow,
} from '../../components/Table/Table';
import { useNavigate, useParams } from 'react-router';

import { AddIcon } from '../../assets';
import ApiClient from '../../clients/api';
import ArtistsTitle from '../../components/ArtistsTitle/ArtistsTitle';
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
        <AddIcon
          className={styles.addAlbumButton}
          title="Add album"
          onClick={async () => {
            await ApiClient.addAlbum(album.id);
          }}
        />
        <Table>
          <TableHead className={styles.index}>#</TableHead>
          <TableHead>TITLE</TableHead>
          {album.tracks.map((track, index) => (
            <TableRow key={`table_row_${track.name}_${index}`}>
              <TableData className={styles.index} dataLabel="#">
                {++index}
              </TableData>
              <TableData dataLabel="TITLE">
                <div className={styles.trackTitle}>
                  <span>{track.name}</span>
                  <ArtistsTitle
                    className={styles.artist}
                    artists={track.artists}
                    onArtistClick={(id) => navigate(`/artist/${id}`)}
                  />
                </div>
              </TableData>
              <span
                className={styles.addTrackButton}
                onClick={async () => {
                  await ApiClient.addTrack(track.id);
                }}
              >
                +
              </span>
            </TableRow>
          ))}
        </Table>
      </div>
    </div>
  );
};

export default AlbumView;
