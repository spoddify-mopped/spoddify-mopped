import { Outlet, matchPath, useLocation, useNavigate } from 'react-router';
import { PlaylistIcon, SearchIcon, SettingsIcon } from '../../assets';
import React, { ReactElement, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ApiClient from '../../clients/api';
import { AppState } from '../../redux/reducers';
import Aside from '../../components/Aside/Aside';
import PlayerBar from '../../components/PlayerBar/PlayerBar';
import { playerActions } from '../../redux/player/actions';
import styles from './Home.module.scss';

const asideItems = [
  {
    image: <PlaylistIcon />,
    matcher: '/playlists',
    name: 'Playlists',
    path: '/playlists',
  },
  {
    image: <SearchIcon />,
    matcher: '/search/*',
    name: 'Search',
    path: '/search',
  },
  {
    image: <SettingsIcon />,
    matcher: '/settings',
    name: 'Settings',
    path: '/settings',
  },
];

const Home = (): ReactElement => {
  const dispatch = useDispatch();
  const player = useSelector((state: AppState) => state.player);

  const [activePage, setActivePage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(playerActions.getPlayer());
  }, [dispatch]);

  useEffect(() => {
    if (location.pathname === '/') {
      navigate(asideItems[0].path, { replace: true });
    }

    const item = asideItems.find(
      (item) => !!matchPath(item.matcher, location.pathname)
    );

    setActivePage(item ? item.name : '');
  }, [location, navigate]);

  return (
    <div className={styles.home}>
      <div className={styles.top}>
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
        <div className={styles.content}>
          <Outlet />
        </div>
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
          albumId: player.item?.album.id,
          artists: player.item?.artists,
          coverImgUri: player.item?.imageUrl,
          duration: player.item?.duration,
          isPlaying: player.isPlaying,
          progress: player.progress,
          trackName: player.item?.name,
          volume: player.volume,
        }}
      />
    </div>
  );
};

export default Home;
