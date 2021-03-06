import React, { ReactElement, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import ApiClient from '../../clients/api';
import Error from '../../components/Error/Error';
import FullLoadingView from '../FullLoadingView/FullLoadingView';
import SearchCoverView from '../../components/SearchCoverView/SearchCoverView';
import SearchInput from '../../components/SearchInput/SearchInput';
import { SearchResponse } from '../../clients/api.types';
import TracksView from '../../components/TracksView/TracksView';
import styles from './Search.module.scss';

export const Search = (): ReactElement => {
  const navigate = useNavigate();
  const query = useParams().query || '';

  const [result, setResult] = useState<SearchResponse | undefined>(undefined);

  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (query) {
      setIsLoading(true);
      ApiClient.search(query, {
        limit: 5,
        type: ['artist', 'track', 'album'],
      })
        .then(setResult)
        .catch(() => setIsError(true))
        .finally(() => setIsLoading(false));
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
    if (isLoading) {
      return <FullLoadingView />;
    }

    if (isError) {
      return <Error />;
    }

    if (!result) {
      return (
        <div className={styles.noContent}>
          <span>Get started and search for titles, artists or albums.</span>
        </div>
      );
    }

    return (
      <div>
        <div className={styles.category}>
          <div className={styles.categoryHeader}>
            <h3>Tracks</h3>
          </div>
          <TracksView
            tracks={result.tracks}
            onArtistClick={(id) => navigate(`/artist/${id}`)}
            onClick={async (id) => {
              await ApiClient.addTrack(id);
            }}
            showArtists
            maxWidth="69rem"
          />
        </div>
        <div className={styles.category}>
          <div className={styles.categoryHeader}>
            <h3>Artists</h3>
          </div>
          <SearchCoverView
            onCoverClick={async (id) => {
              navigate(`/artist/${id}`);
            }}
            items={result.artists}
          />
        </div>
        <div className={styles.category}>
          <div className={styles.categoryHeader}>
            <h3>Albums</h3>
          </div>
          <SearchCoverView
            onCoverClick={async (id) => {
              navigate(`/album/${id}`);
            }}
            onSubTitleClick={async (id) => {
              navigate(`/artist/${id}`);
            }}
            items={result.albums}
          />
        </div>
      </div>
    );
  };

  return (
    <div className={styles.searchView}>
      <div className={styles.searchInputContainer}>
        <SearchInput
          value={query}
          onChange={handleSearchInputChange}
          onDeleteInputClick={() => navigate('/search')}
        />
      </div>
      {renderResult()}
    </div>
  );
};
