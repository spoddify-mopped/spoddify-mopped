import './Home.css';

import { Outlet, useLocation, useNavigate } from 'react-router';
import React, { ReactElement, useEffect, useState } from 'react';

import Aside from '../../components/Aside/Aside';
import PlayerBar from '../../components/PlayerBar/PlayerBar';

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
        onNext={() => {
          console.log('onNext');
        }}
        onPlayPause={() => {
          console.log('onPlayPause');
        }}
        onPrevious={() => {
          console.log('onPrevious');
        }}
        playerInformation={{
          albumName: 'Album',
          artistName: 'Artist',
          coverImgUri:
            'https://i.scdn.co/image/ab67616d0000485183e260c313dc1ff1f17909cf',
          duration: 300000,
          isPlaying: true,
          progress: 0,
          trackName: 'Track',
        }}
      />
    </div>
  );
};

export default Home;
