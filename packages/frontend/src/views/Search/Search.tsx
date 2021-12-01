import './Search.css';

import React, { ReactElement, useState } from 'react';

import ApiClient from '../../clients/api';
import SearchCoverView from '../../components/SearchCoverView/SearchCoverView';
import { SearchResponse } from '../../clients/api.types';
import SearchTrackView from '../../components/SearchTrackView/SearchTrackView';

export const Search = (): ReactElement => {
  const [result, setResult] = useState<SearchResponse | undefined>(undefined);

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
            <span>show more</span>
          </div>
          <SearchCoverView items={result.artists} />
        </div>
        <div className="category">
          <div className="categoryHeader">
            <h3>Albums</h3>
            <span>show more</span>
          </div>
          <SearchCoverView items={result.albums} />
        </div>
        <div className="category">
          <div className="categoryHeader">
            <h3>Tracks</h3>
            <span>show more</span>
          </div>
          <SearchTrackView tracks={result.tracks} />
        </div>
      </div>
    );
  };

  return (
    <div>
      <input onChange={handleSearchInputChange} />
      {renderResult()}
    </div>
  );
};
