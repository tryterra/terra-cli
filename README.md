# Terra CLI

[![Homebrew]](https://github.com/tryterra/homebrew-tap) [![npm]](https://www.npmjs.com/package/@tryterra/cli) ![](https://img.shields.io/badge/Node.js-18%2B-brightgreen?style=flat-square)

[Homebrew]: https://img.shields.io/badge/Homebrew-tryterra%2Ftap-orange?style=flat-square
[npm]: https://img.shields.io/npm/v/@tryterra/cli.svg?style=flat-square

Set up and debug your Terra integration from the terminal. Create environments
and credentials, turn providers on and off, see which users have connected, and
replay the webhook events your integration received. `terra data-api` reaches
the data API too, for the wearable data itself and the user-linking flow.

Your coding agent can drive it too, so you can ask for the result instead of
looking up the command. See [Let your agent drive it](#let-your-agent-drive-it).

The documentation is at [docs.tryterra.co/developer-tools/terra-cli][docs].

## Get started

1. Install the CLI:

   **Homebrew (macOS):**

   ```sh
   brew install tryterra/tap/terra
   ```

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
   terra environments use Production
   terra users list
   ```

4. Ask a question when you are not sure:

   ```sh
   terra ask "how do I generate an auth widget"
   ```

   Answered from the documentation, with links to the pages it came from.

5. Find any other command:

   ```sh
   terra reference
   ```

   Every command and flag as one page. Name a group to narrow it:
   `terra reference billing`.

## Let your agent drive it

Terra configuration usually means clicking around the dashboard, which your
agent cannot do. Give it the CLI instead. Paste this into Claude Code, Cursor,
Codex or whatever you use:

```text
Set up the Terra API CLI for this project. Install it with
"brew install tryterra/tap/terra" on macOS, or "npm install -g @tryterra/cli"
otherwise. Then run "terra agent setup" to install Terra's agent skills, read
the terra-cli skill it writes, and follow its getting-started section to tell
me what my account is configured to do.
```

That installs the skills into whichever agent is asking, so your agent then
knows the commands, the exit codes, and the traps worth avoiding. In a later
session, once it has picked the skills up, this is enough:

```text
Get started with Terra API.
```

It will check that the CLI is authenticated, find your environments, report
which wearable providers are on and where webhooks are going, and name the gap
that matters. Then ask for whatever you need:

```text
Which wearable providers are enabled in my dev environment, and where are its
webhooks going?
```

```text
A sleep webhook never arrived for user 8f2a1c. Find out what Terra actually
delivered, and resend it.
```

```text
Set up a staging environment with Garmin and Fitbit turned on, and point its
webhooks at my tunnel.
```

Asking questions is safe: reading changes nothing, credentials stay hidden
unless someone passes `--reveal`, and anything destructive refuses to run
unattended rather than guessing that you meant it.

## Before you change anything

Every command takes `--dry-run`, which prints the request that would be sent and
touches nothing. It needs no credential, so it is safe against production.

```sh
terra environments update --name Acme --dry-run
```

Commands whose response contains a credential will not print it without
`--reveal`. Destructive ones confirm first, naming the account and environment
they will act on, and need `--yes` where there is no terminal to ask.

## Documentation

[The CLI section of Terra's documentation][docs] covers the whole tool:

- [Installation] for Homebrew, npm, staying up to date, and shell completion
- [Authentication] for logging in interactively, in CI, or with no browser
- [Configuration] for environments, profiles, and every variable
- [Output and scripting] for formats, field selection, pagination, exit codes
- [Guardrails] for the dry run, secret gating, and confirmations
- [Raw API requests] for reaching an endpoint that has no command of its own
- [Coding agents] for driving the CLI from an agent
- [Ask the docs] for asking a question from the terminal
- [Command reference] for every command group and the flags they all share

[docs]: https://docs.tryterra.co/developer-tools/terra-cli
[Installation]: https://docs.tryterra.co/developer-tools/terra-cli/installation
[Authentication]: https://docs.tryterra.co/developer-tools/terra-cli/authentication
[Configuration]: https://docs.tryterra.co/developer-tools/terra-cli/configuration
[Output and scripting]: https://docs.tryterra.co/developer-tools/terra-cli/output-and-scripting
[Guardrails]: https://docs.tryterra.co/developer-tools/terra-cli/guardrails
[Raw API requests]: https://docs.tryterra.co/developer-tools/terra-cli/raw-requests
[Coding agents]: https://docs.tryterra.co/developer-tools/terra-cli/coding-agents
[Ask the docs]: https://docs.tryterra.co/developer-tools/terra-cli/ask
[Command reference]: https://docs.tryterra.co/developer-tools/terra-cli/command-reference

## What changed

Every released version, newest first, is in
[the changelog](https://github.com/tryterra/terra-cli/blob/main/CHANGELOG.md).
`terra version` says which one you are on.

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
