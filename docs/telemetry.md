# Telemetry

Released builds report which commands are used, so we can tell which parts of
the CLI matter and which are getting in the way.

## Turning it off

```sh
export TERRA_CLI_TELEMETRY_OPTOUT=1
```

`DO_NOT_TRACK=1` works too, and is honored across tools that follow
[the convention](https://donottrack.sh). Either one is checked before
anything is collected, so nothing is sent and nothing is queued.

## What is sent

One event per invocation, when the command starts:

| Field                         | Example                                |
| ----------------------------- | -------------------------------------- |
| `command_path`                | `terra environments list`              |
| `command_flags`               | `env,format` (names, not values)       |
| `generated_command`           | `true`                                 |
| `cli_version`, `os`, `arch`   | `1.2.0`, `darwin`, `arm64`             |
| `customer_id`                 | `cus_9f3k2m`, the customer you work in |
| `ai_agent`                    | `claude_code`, when one drives the CLI |
| `install_method`              | `npm`, `homebrew`, `apt`, `unknown`    |
| `invocation_id`, `machine_id` | random UUIDs                           |

`machine_id` is generated on first use and stored in your config file. It
identifies an installation, not a person.

## What is not sent

**Flag values and positional arguments are never collected.** Only the names of
the flags you passed. That rule is the reason a dev-id, a user id, or a token
cannot end up in an event.

`internal/telemetry` is the authoritative source where this page and the
implementation differ.

Also never sent: your token, request bodies, response bodies, file paths,
environment variables, and the contents of your config file.

## Where it goes

`https://e.tryterra.co`, Terra's own ingest endpoint, which forwards to PostHog.
That is the only host the CLI contacts for telemetry, which is worth knowing if
you audit outbound traffic or maintain an egress allowlist.

A build with no write key linked in sends nothing at all, which is every build
except an official release, so an unofficial build is silent.

Sending never blocks a command and never fails one: if the network is down or
the endpoint is slow, the event is dropped and the command carries on.
