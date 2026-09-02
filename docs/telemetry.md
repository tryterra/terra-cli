# Telemetry

Released builds report usage data, so we can see which parts of the CLI matter
and which are getting in the way.

## Turning it off

```sh
export TERRA_CLI_TELEMETRY_OPTOUT=1
```

`DO_NOT_TRACK=1` works too, and is honored across tools that follow
[the convention](https://donottrack.sh). Either one is checked before anything
is collected, so nothing is sent and nothing is queued.

## What is collected

Which commands are run and how they turned out, along with the CLI version, your
operating system and architecture, how the CLI was installed, and whether a
coding agent is driving it.

## What is not collected

**Flag values and positional arguments are never collected.** Only the names of
the flags you passed. That rule is the reason a dev-id, a user id, or a token
cannot end up in an event.

Also never collected: your token, request bodies, response bodies, file paths,
environment variables, and the contents of your config file.

`internal/telemetry` is the authoritative source where this page and the
implementation differ.
