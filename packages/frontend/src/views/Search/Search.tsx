import './Search.css';

import React, { ReactElement, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import ApiClient from '../../clients/api';
import SearchCoverView from '../../components/SearchCoverView/SearchCoverView';
import { ReactComponent as SearchIcon } from '../../resources/search.svg';
import { SearchResponse } from '../../clients/api.types';
import SearchTrackView from '../../components/SearchTrackView/SearchTrackView';

export const Search = (): ReactElement => {
  const navigate = useNavigate();
  const { query } = useParams();

  const [result, setResult] = useState<SearchResponse | undefined>(undefined);

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
    navigate(`/search/${encodeURIComponent(evt.target.value)}`, {
      replace: true,
    });
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
          <SearchCoverView
            onCoverClick={async (id) => {
              navigate(`/album/${id}`);
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
