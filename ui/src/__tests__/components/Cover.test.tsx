import Cover from '../../components/Cover/Cover';
import { CoverReplacement } from '../../assets';
import React from 'react';
import renderer from 'react-test-renderer';

it('Cover renders correctly with required item properties', () => {
  const tree = renderer
    .create(
      <Cover
        item={{
          id: 'some id',
          name: 'some name',
        }}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('Cover renders correctly with custom class name', () => {
  const tree = renderer
    .create(
      <Cover
        item={{
          id: 'some id',
          name: 'some name',
        }}
        className="some class"
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('Cover renders correctly with image', () => {
  const tree = renderer
    .create(
      <Cover
        item={{
          id: 'some id',
          image: 'some image url',
          name: 'some name',
        }}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('Cover renders correctly with image and onClick', () => {
  const tree = renderer
    .create(
      <Cover
        item={{
          id: 'some id',
          image: CoverReplacement,
          name: 'some name',
          onClick: () => console.log('Test'),
        }}
      />
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('Cover renders correctly with subtitle', () => {
  const tree = renderer
    .create(
      <Cover
        item={{
          id: 'some id',
          image: CoverReplacement,
          name: 'some name',
          onClick: () => console.log('Test'),
          subtitle: <span>'some subttle'</span>,
        }}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('Cover renders correctly with clickable subtitle', () => {
  const tree = renderer
    .create(
      <Cover
        item={{
          clickableSubtitle: true,
          id: 'some id',
          image: CoverReplacement,
          name: 'some name',
          onClick: () => console.log('Test'),
          subtitle: <span>'some subttle'</span>,
        }}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
