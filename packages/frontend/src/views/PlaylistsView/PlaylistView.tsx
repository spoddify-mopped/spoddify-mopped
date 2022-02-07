import './PlaylistView.css';

import React, { useEffect, useState } from 'react';

import ApiClient from '../../clients/api';
import Error from '../../components/Error/Error';
import { ReactComponent as Play } from '../../resources/play-solid.svg';
import { Playlist } from '../../clients/api.types';
import { useNavigate } from 'react-router-dom';

export default function PlaylistView(): React.ReactElement {
  const navigate = useNavigate();

  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    ApiClient.getPlaylists()
      .then(setPlaylists)
      .catch(() => setIsError(true));
  }, []);

  const renderPlaylists = () => {
    return playlists.map((playlist) => (
      <div className="singlePlaylist" key={playlist.id}>
        <p
          className="playlistName"
          onClick={() => navigate(`/playlist/${playlist.id}`)}
        >
          {playlist.name}
        </p>
        <button
          className="button"
          onClick={() => ApiClient.playPlaylist(playlist.id)}
        >
          <Play />
        </button>
      </div>
    ));
  };

  if (isError) {
    return <Error />;
  }

  return (
    <div className="playlist">
      <h1 className="playlistHeadline">Wähle ein Genre aus</h1>
      <div className="playlistContainer">{renderPlaylists()}</div>
    </div>
  );
}
