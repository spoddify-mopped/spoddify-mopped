# spotifyd

Copy the `spotifyd.conf` file to a new file called `spotifyd.private.conf` in the same directory and insert your spotify premium credentials.
You might want to change the audio backend depending on you audio configuration.

Run spotifyd:

```bash
spotifyd --no-daemon --config-path $PWD/spotify.private.conf
```

There is a `hooks.sh` script which will be executed by spotifyd on events like playback started, end, changed, etc.