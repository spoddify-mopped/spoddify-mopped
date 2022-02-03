import './Search.css';

import {
  ArtistTopTracksResponse,
  SearchResponse,
} from '../../clients/api.types';
import React, { ReactElement, useState } from 'react';

import ApiClient from '../../clients/api';
import { Modal } from '../../components/Modal/Modal';
import SearchCoverView from '../../components/SearchCoverView/SearchCoverView';
import SearchTrackView from '../../components/SearchTrackView/SearchTrackView';

export const Search = (): ReactElement => {
  const [result, setResult] = useState<SearchResponse | undefined>(undefined);

  const [showArtistInfo, setShowArtistInfo] = useState<boolean>(false);
  const [artistTopTracks, setArtistTopTracks] = useState<
    ArtistTopTracksResponse | undefined
  >(undefined);

  const [showAlbumTracks, setShowAlbumTracks] = useState<boolean>(false);
  const [albumTracks, setAlbumTracks] = useState<
    ArtistTopTracksResponse | undefined
  >(undefined);

  const [albumId, setAlbumId] = useState<string | undefined>(undefined);

  const handleSearchInputChange = async (
    evt: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!evt.target.value) {
      setResult(undefined);
      return;
    }
    setResult(
      await ApiClient.search(evt.target.value, {
        limit: 5,
        type: ['artist', 'track', 'album'],
      })
    );
  };

  const renderResult = () => {
    if (!result) {
      return <></>;
    }

    return (
      <div>
        <div className="category">
          <div className="categoryHeader">
            <h3>Artists</h3>
          </div>
          <Modal
            visible={showArtistInfo}
            onClose={() => setShowArtistInfo(false)}
          >
            <h3>Artist top track's</h3>
            {artistTopTracks ? (
              <SearchTrackView
                tracks={artistTopTracks.tracks}
                onAddTrackClick={async (track) => {
                  await ApiClient.addTrack(track.id);
                }}
              />
            ) : undefined}
          </Modal>
          <SearchCoverView
            onCoverClick={async (id) => {
              const artistTopTracks = await ApiClient.getArtistTopTracks(id);
              setArtistTopTracks(artistTopTracks);
              setShowArtistInfo(true);
            }}
            items={result.artists}
          />
        </div>
        <div className="category">
          <div className="categoryHeader">
            <h3>Albums</h3>
          </div>
          <Modal
            visible={showAlbumTracks}
            onClose={() => setShowAlbumTracks(false)}
          >
            <div className="albumModalHeader">
              <h3>Album track's</h3>
              <span
                onClick={async () => {
                  albumId && (await ApiClient.addAlbum(albumId));
                }}
              >
                Add album
              </span>
            </div>
            {albumTracks ? (
              <SearchTrackView
                tracks={albumTracks.tracks}
                onAddTrackClick={async (track) => {
                  await ApiClient.addTrack(track.id);
                }}
              />
            ) : undefined}
          </Modal>
          <SearchCoverView
            onCoverClick={async (id) => {
              const artistTopTracks = await ApiClient.getAlbumTracks(id);
              setAlbumId(id);
              setAlbumTracks(artistTopTracks);
              setShowAlbumTracks(true);
            }}
            items={result.albums}
          />
        </div>
        <div className="category">
          <div className="categoryHeader">
            <h3>Tracks</h3>
          </div>
          <SearchTrackView
            tracks={result.tracks}
            onAddTrackClick={async (track) => {
              await ApiClient.addTrack(track.id);
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="searchView">
      <div className="searchInputContainer">
        <input
          className="searchInput"
          placeholder="Search"
          onChange={handleSearchInputChange}
        />
      </div>
      {renderResult()}
    </div>
  );
};
