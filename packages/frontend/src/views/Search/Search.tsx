import './Search.css';

import {
  ArtistTopTracksResponse,
  SearchResponse,
} from '../../clients/api.types';
import React, { ReactElement, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import ApiClient from '../../clients/api';
import { Modal } from '../../components/Modal/Modal';
import SearchCoverView from '../../components/SearchCoverView/SearchCoverView';
import { ReactComponent as SearchIcon } from '../../resources/search.svg';
import SearchTrackView from '../../components/SearchTrackView/SearchTrackView';

export const Search = (): ReactElement => {
  const navigate = useNavigate();
  const { query } = useParams();

  const [result, setResult] = useState<SearchResponse | undefined>(undefined);

  const [showAlbumTracks, setShowAlbumTracks] = useState<boolean>(false);
  const [albumTracks, setAlbumTracks] = useState<
    ArtistTopTracksResponse | undefined
  >(undefined);

  const [albumId, setAlbumId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (query) {
      ApiClient.search(query, {
        limit: 5,
        type: ['artist', 'track', 'album'],
      }).then(setResult);
    } else {
      setResult(undefined);
    }
  }, [query]);

  const handleSearchInputChange = async (
    evt: React.ChangeEvent<HTMLInputElement>
  ) => {
    navigate(`/search/${evt.target.value}`, { replace: true });
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
          <SearchCoverView
            onCoverClick={async (id) => {
              navigate(`/artist/${id}`);
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
        <div className="searchInputWrapper">
          <SearchIcon className="searchIcon" />
          <input
            className="searchInput"
            placeholder="Search"
            value={query}
            onChange={handleSearchInputChange}
          />
        </div>
      </div>
      {renderResult()}
    </div>
  );
};
