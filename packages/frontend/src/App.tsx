import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React, { ReactElement } from 'react';

import Home from './views/Home/Home';
import Player from './views/Player/Player';
import PlaylistDetailView from './views/PlaylistDetailView/PlaylistDetailView';
import PlaylistsView from './views/PlaylistsView/PlaylistView';
import { Search } from './views/Search/Search';

export default function App(): ReactElement {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="/search" element={<Search />} />
          <Route path="/playlists" element={<PlaylistsView />} />
          <Route path="/playlist/:id" element={<PlaylistDetailView />} />
        </Route>
        <Route path="/player" element={<Player />} />
      </Routes>
    </BrowserRouter>
  );
}
