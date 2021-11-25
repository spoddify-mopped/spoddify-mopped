import './App.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Player from './components/Player';
import React from 'react';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Player />} />
      </Routes>
    </BrowserRouter>
  );
}
