import './PlaylistView.css';

import React, { useEffect, useState } from 'react';

import { ReactComponent as Play } from '../../resources/play-solid.svg';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

interface Playlist {
  id?: number;
  name?: string;
}

export default function PlaylistView() {
  const [playlists, setPlaylists] = useState<Playlist[]>([
    {
      id: undefined,
      name: undefined,
    },
  ]);

  function refresh() {
    axios
      .get(`${API_URL}/playlist`)
      .then((response) => {
        setPlaylists(response.data);
        console.log(response.data);
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
    axios.get(`${API_URL}/playlist/${id}/play`);
  }

  const playlistRows = [];
  for (const playlist of playlists) {
    playlistRows.push(
      <div className="singlePlaylist">
        <p>{playlist.name}</p>
        <button className="button" onClick={() => play(playlist.id)}>
          <Play />
        </button>
      </div>
    );
  }

  return (
    <div className="playlist">
      <h1>Wähle ein Genre aus</h1>
      <div className="playlistContainer">{playlistRows}</div>
    </div>
  );
}
