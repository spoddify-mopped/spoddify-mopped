import './Player.css';

import React, { ReactElement, useEffect, useState } from 'react';

import ApiClient from '../../clients/api';
import { ReactComponent as Next } from '../../resources/step-forward-solid.svg';
import { ReactComponent as Pause } from '../../resources/pause-circle-solid.svg';
import { ReactComponent as Play } from '../../resources/play-circle-solid.svg';
import { ReactComponent as Prev } from '../../resources/step-backward-solid.svg';
import axios from 'axios';
import socketIOClient from 'socket.io-client';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

interface Metadata {
  artist?: string;
  track?: string;
  url?: string;
}

export default function Player(): ReactElement {
  const [playing, setPlaying] = useState(false);
  const [metadata, setMetadata] = useState<Metadata>({
    artist: undefined,
    track: undefined,
    url: undefined,
  });

  useEffect(() => {
    const socket = socketIOClient(API_URL);
    socket.on('player', (response) => {
      setPlaying(response.is_playing);
      const meta: Metadata = {
        artist: response.item.artists
          .map((artist: any) => artist.name)
          .join(', '),
        track: response.item.name,
        url: response.item.album.images[0].url,
      };
      setMetadata(meta);
    });

    refresh();

    return () => {
      socket.close();
    };
  }, []);

  function refresh() {
    axios
      .get(`${API_URL}/api//player`)
      .then((response) => {
        setPlaying(response.data.is_playing);
        const meta: Metadata = {
          artist: response.data.item.artists
            .map((artist: any) => artist.name)
            .join(', '),
          track: response.data.item.name,
          url: response.data.item.album.images[0].url,
        };
        setMetadata(meta);
      })
      .catch((error) => {
        console.log(`EIN FEHLER: ${error}`);
      });
  }

  return (
    <div className="player">
      <div className="metadata">
        <img className="coverart" src={metadata.url} alt="Cover" />
        <p>{metadata.track}</p>
        <p>{metadata.artist}</p>
      </div>
      <div className="control">
        <button
          className="playerButton"
          onClick={() => {
            ApiClient.previous();
          }}
        >
          <Prev />
        </button>
        <button
          className="playerButton pausebutton"
          onClick={() => {
            ApiClient.playPause().then(() => setPlaying(!playing));
          }}
        >
          {playing ? <Pause /> : <Play />}
        </button>
        <button
          className="playerButton"
          onClick={() => {
            ApiClient.next();
          }}
        >
          <Next />
        </button>
      </div>
    </div>
  );
}
