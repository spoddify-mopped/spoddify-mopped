import './App.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React, { ReactElement } from 'react';

import Player from './components/Player';

export default function App(): ReactElement {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Player />} />
      </Routes>
    </BrowserRouter>
  );
}
