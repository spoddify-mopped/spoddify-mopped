import './Home.css';

import { Outlet, useLocation, useNavigate } from 'react-router';
import React, { ReactElement, useEffect, useState } from 'react';

import ApiClient from '../../clients/api';
import { AppState } from '../../redux/reducers';
import Aside from '../../components/Aside/Aside';
import PlayerBar from '../../components/PlayerBar/PlayerBar';
import { useSelector } from 'react-redux';

const asideItems = [
  {
    image: <></>,
    name: 'Search',
    path: '/search',
  },
  {
    image: <></>,
    name: 'Playlists',
    path: '/playlists',
  },
];

const Home = (): ReactElement => {
  const player = useSelector((state: AppState) => state.player);

  const [activePage, setActivePage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === '/') {
      navigate(asideItems[0].path, { replace: true });
    }

    const item = asideItems.find(
      (item) => item.path.toLowerCase() === location.pathname.toLowerCase()
    );

    if (item) {
      setActivePage(item.name);
    }
  }, [location, navigate]);

  return (
    <div className="home">
      <div className="top">
        <Aside
          items={asideItems.map((item) => ({
            image: item.image,
            name: item.name,
          }))}
          active={activePage}
          onItemClick={(item) => {
            const route = asideItems.find((i) => i.name === item);
            if (route) {
              navigate(route.path, { replace: true });
            }
          }}
        />
        <Outlet />
      </div>
      <PlayerBar
        onNext={async () => {
          await ApiClient.next();
        }}
        onPlayPause={async () => {
          await ApiClient.playPause();
        }}
        onPrevious={async () => {
          await ApiClient.previous();
        }}
        playerInformation={{
          albumName: player.album,
          artistName: player.artist,
          coverImgUri: player.coverUrl,
          duration: player.duration,
          isPlaying: player.isPlaying,
          progress: player.progress,
          trackName: player.track,
        }}
      />
    </div>
  );
};

export default Home;
