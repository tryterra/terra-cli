# Terra CLI

![](https://img.shields.io/badge/Node.js-18%2B-brightgreen?style=flat-square) [![npm]](https://www.npmjs.com/package/@tryterra/cli)

[npm]: https://img.shields.io/npm/v/@tryterra/cli.svg?style=flat-square

Set up and debug your Terra integration from the terminal. Create environments
and credentials, turn providers on and off, see which users have connected, and
replay the webhook events your integration received.

Coding agents can drive it too. `terra agent setup` installs the guidance into
Claude Code, Cursor and Codex, and `terra reference --format json` hands an
agent every command in a single call.

## Get started

1. Install the CLI:

   **npm (all platforms):**

   ```sh
   npm install -g @tryterra/cli
   ```

2. Log in:

   ```sh
   terra login
   ```

   This opens your browser and prints a pairing code to approve in the
   dashboard.

3. Pick an environment and read something:

   ```sh
   terra environments list
   terra environments use dev-prod
   terra users list
   ```

4. Find any other command:

   ```sh
   terra reference
   ```

   Every command and flag as one page. Name a group to narrow it:
   `terra reference billing`.

## Before you change anything

Every command takes `--dry-run`, which prints the request that would be sent and
touches nothing. It needs no credential, so it is safe against production.

```sh
terra environments update --name Acme --dry-run
```

Commands whose response contains a credential will not print it without
`--reveal`. Destructive ones confirm first, naming the account and environment
they will act on, and need `--yes` where there is no terminal to ask.

## Reporting bugs

**Found a security issue? Do not open a public issue.** See the
[security policy](https://github.com/tryterra/terra-cli/security/policy), which
routes it privately.

For everything else, use
[GitHub issues](https://github.com/tryterra/terra-cli/issues). Including
`terra version` and the failing command with `--show-headers` helps: that traces
the request with credentials redacted and bodies reduced to a byte count, so the
output is safe to paste. Exit codes are a contract, documented in
[docs/troubleshooting.md](docs/troubleshooting.md).

For anything specific to your account, billing, or covered by your contract, use
your usual Terra support channel instead. That tracker is public.

The CLI is built from a private repository, so a pull request here has nothing
to change and cannot be merged. Open an issue instead.

## Data collection, usage, and retention

Released builds report which commands are run, never flag values or arguments,
so we can tell which parts of the CLI matter and which are getting in the way.
[docs/telemetry.md](docs/telemetry.md) lists every field that is sent and every
one that is not. To turn it off:

```sh
export TERRA_CLI_TELEMETRY_OPTOUT=1
```

`DO_NOT_TRACK=1` works too, and is honored across tools that follow
[the convention](https://donottrack.sh).

For full details, see Terra's
[Terms of Service](https://tryterra.co/terms-of-service) and
[Privacy Policy](https://tryterra.co/privacy).
