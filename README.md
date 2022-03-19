<p align="center">
  <img src="https://user-images.githubusercontent.com/36125892/155200580-ac94b87c-8992-40ff-b506-9cdcd244aae7.png" alt="Spoddify Mopped" height="300px" />
</p>
<span align="center">

[![npm Version](https://badgen.net/npm/v/spoddify-mopped)](https://www.npmjs.com/package/spoddify-mopped)
[![Test](https://github.com/spoddify-mopped/spoddify-mopped/actions/workflows/test.yml/badge.svg)](https://github.com/spoddify-mopped/spoddify-mopped/actions/workflows/test.yml)
[![Build](https://github.com/spoddify-mopped/spoddify-mopped/actions/workflows/build.yml/badge.svg)](https://github.com/spoddify-mopped/spoddify-mopped/actions/workflows/build.yml)

</span>

Spoddify Mopped is a Spotify player for office use, with a voting system to select music and automatic song sorting.
It is intended to run on a Raspberry Pi and some esp32 boards for remote controlling and voting.
But it can be run on any other machine as well.

- Play playlists based on votes
- Discover new music and insert songs to automatically sorted playlists
- Browse artist, albums and playlist
- View the current playing song
- Modern user interface
- Secure Spotify login

## Installation Instructions

For detailed instructions on how to setup Node.js and SpoddifyMopped follow these guides:

- [Setup manually](https://github.com/davidborzek/spoddify-mopped/wiki/Manual-Installation)

## Plugins

Spoddify Mopped can be extended using plugins. Plugins are Node.js modules prefixed by `spoddify-mopped-`.
They have direct access to the Spoddify Mopped API (e.g. controlling playback, listening to player events, ...).

### Plugin Installation

You can easily install plugins like, by installing the Node.js module globally:

```bash
npm i -g spoddify-mopped-gpio
```

## Screenshots

![Player](https://user-images.githubusercontent.com/36125892/159121237-03c6723d-be22-44a8-8e1b-f34bc9abff46.png)
![Search](https://user-images.githubusercontent.com/36125892/159121281-33175177-a8a0-442e-943d-90f9542c5e0d.png)
![Album](https://user-images.githubusercontent.com/36125892/159121333-00fbc16d-be00-4fad-88f9-406ea65e37ad.png)
![Artist](https://user-images.githubusercontent.com/36125892/159121335-377d436a-efa7-4644-83fc-e029c1bff591.png)
![Playlist](https://user-images.githubusercontent.com/36125892/159121337-0b66f6f9-c977-4c5e-be24-afd21c3d1a88.png)


## Contributing

Contributing and pull requests are very welcome.

More information about contributing to this project can be found [here](CONTRIBUTING.md)
