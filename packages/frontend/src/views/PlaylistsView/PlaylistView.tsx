import './PlaylistView.css';

import React, { useEffect, useState } from 'react';

import { ReactComponent as Play } from '../../resources/play-solid.svg';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

interface Playlist {
  id?: number;
  name?: string;
}

export default function PlaylistView(): React.ReactElement {
  const navigate = useNavigate();

  const [playlists, setPlaylists] = useState<Playlist[]>([
    {
      id: undefined,
      name: undefined,
    },
  ]);

  function refresh() {
    axios
      .get(`${API_URL}/api/playlist`)
      .then((response) => {
        setPlaylists(response.data);
      })
      .catch((error) => {
        console.log(`EIN FEHLER: ${error}`);
      });
  }

  useEffect(() => {
    refresh();
  }, []);

  function play(id?: number) {
    if (!id) return;
    axios.get(`${API_URL}/api/playlist/${id}/play`);
  }

  const playlistRows = [];
  for (const playlist of playlists) {
    playlistRows.push(
      <div className="singlePlaylist" key={playlist.id}>
        <p
          className="playlistName"
          onClick={() => navigate(`/playlist/${playlist.id}`)}
        >
          {playlist.name}
        </p>
        <button className="button" onClick={() => play(playlist.id)}>
          <Play />
        </button>
      </div>
    );
  }

  return (
    <div className="playlist">
      <h1 className="playlistHeadline">Wähle ein Genre aus</h1>
      <div className="playlistContainer">{playlistRows}</div>
    </div>
  );
}
