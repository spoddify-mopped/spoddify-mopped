# spotifyd

Run spotifyd:

```bash
spotifyd --no-daemon --config-path $PWD/spotify.conf
```

There is a `hooks.sh` script which will be executed by spotifyd on events like playback started, end, changed, etc.