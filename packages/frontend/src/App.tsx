import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React, { ReactElement } from 'react';

import ArtistView from './views/ArtistView/ArtistView';
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
          <Route path="/artist/:id" element={<ArtistView />} />
        </Route>
        <Route path="/player" element={<Player />} />
      </Routes>
    </BrowserRouter>
  );
}
