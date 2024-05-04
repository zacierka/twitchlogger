# Twitch Tracker

Small project to play with containers and compose. Logs users messages to database and notifies a discord webhook on interval if any chatters appear.

## Docker build for RPI

```docker buildx create --use```

```docker buildx build --platform linux/amd64,linux/arm -t switchrl/twitchlogger:1.0.1 --push .```