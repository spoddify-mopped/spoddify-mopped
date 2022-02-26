import ArtistCover from '../../components/ArtistCover/ArtistCover';
import React from 'react';
import renderer from 'react-test-renderer';

it('ArtistCover renders with required properties', () => {
  const tree = renderer
    .create(
      <ArtistCover
        item={{
          id: 'some id',
          name: 'some name',
        }}
        onClick={() => ''}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('ArtistCover renders with image', () => {
  const tree = renderer
    .create(
      <ArtistCover
        item={{
          id: 'some id',
          imageUrl: 'some image url',
          name: 'some name',
        }}
        onClick={() => ''}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
