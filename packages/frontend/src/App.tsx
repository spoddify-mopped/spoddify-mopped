import './App.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React, { ReactElement } from 'react';

import Home from './views/Home/Home';
import Player from './views/Player/Player';
import PlaylistView from './views/PlaylistView/PlaylistView';
import { Search } from './views/Search/Search';

export default function App(): ReactElement {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="/search" element={<Search />} />
          <Route path="/playlists" element={<PlaylistView />} />
        </Route>
        <Route path="/player" element={<Player />} />
      </Routes>
    </BrowserRouter>
  );
}
