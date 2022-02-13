import { Artist, FullPlaylist, PlaylistTracks } from '../../clients/api.types';
import React, { useEffect, useState } from 'react';
import Table, {
  TableData,
  TableHead,
  TableRow,
} from '../../components/Table/Table';
import { useNavigate, useParams } from 'react-router-dom';

import ApiClient from '../../clients/api';
import CoverReplacement from '../../resources/cover_replacement.png';
import ImageUtils from '../../utils/image';
import SearchInput from '../../components/SearchInput/SearchInput';
import styles from './PlaylistDetailView.module.scss';

const PlaylistDetailView = (): React.ReactElement => {
  const navigate = useNavigate();
  const params = useParams();

  const [playlist, setPlaylist] = useState<FullPlaylist | undefined>(undefined);

  const [image, setImage] = useState<string | undefined>(undefined);

  const [search, setSearch] = useState('');

  const [tracks, setTracks] = useState<PlaylistTracks>([]);

  useEffect(() => {
    const id = params['id'];

    if (id) {
      ApiClient.getPlaylist(Number.parseInt(id)).then((playlist) => {
        setPlaylist(playlist);
        setTracks(playlist.tracks);
      });
    }
  }, [params]);

  useEffect(() => {
    if (!playlist) {
      return;
    }

    const images = playlist.tracks
      .filter(
        (value, index, self) =>
          index ===
          self.findIndex((t) => t.track.imageUrl === value.track.imageUrl)
      )
      .map((pt) => pt.track.imageUrl || '');

    while (images.length < 4) {
      images.push(...images);
    }

    ImageUtils.collage(images, 600).then(setImage);
  }, [playlist]);

  const renderArtistSubtitle = (artists: Artist[]) => {
    return artists.map((artist, index) => (
      <>
        <span
          className={styles.artist}
          onClick={() => navigate(`/artist/${artist.id}`)}
        >
          {artist.name}
        </span>
        {index !== artists.length - 1 ? ', ' : ''}
      </>
    ));
  };

  if (!playlist) {
    return <></>;
  }

  return (
    <div>
      <div
        className={styles.header}
        style={{
          backgroundImage: `url(${image})`,
          backgroundPosition: 'center',
          boxShadow: 'inset 0 0 0 2000px rgba(0, 0, 0, 0.9)',
        }}
      >
        <img src={image || CoverReplacement} alt="Cover" />
        <div className={styles.meta}>
          <span className={styles.title}>{playlist.name}</span>
        </div>
      </div>
      <div className={styles.innerContainer}>
        <div className={styles.searchInput}>
          <SearchInput
            value={search}
            onChange={(evt) => {
              setSearch(evt.target.value);
              setTracks(
                playlist.tracks.filter(
                  ({ track }) =>
                    track.name
                      .toLowerCase()
                      .includes(evt.target.value.toLowerCase()) ||
                    track.album.name
                      .toLowerCase()
                      .includes(evt.target.value.toLowerCase()) ||
                    track.artists.filter((artist) =>
                      artist.name
                        .toLowerCase()
                        .includes(evt.target.value.toLowerCase())
                    ).length > 0
                )
              );
            }}
            onDeleteInputClick={() => {
              setSearch('');
              setTracks(playlist.tracks);
            }}
          />
        </div>
        <Table>
          <TableHead className={styles.index}>#</TableHead>
          <TableHead>TITLE</TableHead>
          <TableHead className={styles.album}>ALBUM</TableHead>
          <TableHead className={styles.addedAt}>ADDED AT</TableHead>
          {tracks.map(({ track, addedAt }, index) => (
            <TableRow>
              <TableData className={styles.index} dataLabel="#">
                {++index}
              </TableData>
              <TableData dataLabel="TITLE">
                <img className={styles.cover} src={track.imageUrl} alt="" />
                <div className={styles.trackTitle}>
                  <span>{track.name}</span>
                  <span>{renderArtistSubtitle(track.artists)}</span>
                </div>
              </TableData>
              <TableData className={styles.album} data-label="ALBUM">
                <span
                  className={styles.album}
                  onClick={() => navigate(`/album/${track.album.id}`)}
                >
                  {track.album.name}
                </span>
              </TableData>
              <TableData className={styles.addedAt} data-label="ADDED AT">
                {new Date(addedAt * 1000).toLocaleDateString()}
              </TableData>
            </TableRow>
          ))}
        </Table>
      </div>
    </div>
  );
};

export default PlaylistDetailView;
