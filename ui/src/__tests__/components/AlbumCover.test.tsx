import AlbumCover from '../../components/AlbumCover/AlbumCover';
import React from 'react';
import renderer from 'react-test-renderer';

it('AlbumCover renders correctly with release date', () => {
  const tree = renderer
    .create(
      <AlbumCover
        item={{
          artists: [
            {
              id: 'some artist id',
              name: 'some artist name',
            },
          ],
          id: 'some id',
          name: 'some name',
          releaseDate: '2014-01-01',
        }}
        onClick={() => ''}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('AlbumCover renders correctly with release date and image', () => {
  const tree = renderer
    .create(
      <AlbumCover
        item={{
          artists: [
            {
              id: 'some artist id',
              name: 'some artist name',
            },
          ],
          id: 'some id',
          imageUrl: 'some image url',
          name: 'some name',
          releaseDate: '2014-01-01',
        }}
        onClick={() => ''}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
