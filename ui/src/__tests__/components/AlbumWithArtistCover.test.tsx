import AlbumWithArtistCover from '../../components/AlbumWithArtistCover/AlbumWithArtistCover';
import React from 'react';
import renderer from 'react-test-renderer';

it('AlbumWithArtistCover renders required properties and no artists', () => {
  const tree = renderer
    .create(
      <AlbumWithArtistCover
        item={{
          artists: [],
          id: 'some id',
          name: 'some name',
        }}
        onAlbumClick={() => ''}
        onArtistClick={() => ''}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('AlbumWithArtistCover renders required properties and image', () => {
  const tree = renderer
    .create(
      <AlbumWithArtistCover
        item={{
          artists: [],
          id: 'some id',
          imageUrl: 'some image url',
          name: 'some name',
        }}
        onAlbumClick={() => ''}
        onArtistClick={() => ''}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('AlbumWithArtistCover renders required properties and one artist', () => {
  const tree = renderer
    .create(
      <AlbumWithArtistCover
        item={{
          artists: [
            {
              id: 'some artist id',
              name: 'some artist name',
            },
          ],
          id: 'some id',
          name: 'some name',
        }}
        onAlbumClick={() => ''}
        onArtistClick={() => ''}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('AlbumWithArtistCover renders required properties and multiple artists', () => {
  const tree = renderer
    .create(
      <AlbumWithArtistCover
        item={{
          artists: [
            {
              id: 'some artist id',
              name: 'some artist name',
            },
            {
              id: 'another artist id',
              name: 'another artist name',
            },
          ],
          id: 'some id',
          name: 'some name',
        }}
        onAlbumClick={() => ''}
        onArtistClick={() => ''}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
