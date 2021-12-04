import './App.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React, { ReactElement } from 'react';

import Player from './views/Player/Player';
import { Search } from './views/Search/Search';

export default function App(): ReactElement {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Player />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </BrowserRouter>
  );
}
