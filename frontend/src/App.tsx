import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Player from "./components/Player"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <Player />
        } />
      </Routes>
    </BrowserRouter >
  );
}