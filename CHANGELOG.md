# Changelog

Every released version of the Terra CLI, newest first. Each entry is that
version's release note. The releases themselves, with the archives, checksums
and signatures, are on the
[releases page](https://github.com/tryterra/terra-cli/releases).

## v0.3.0

#### Changed

- `terra agent setup` installs Terra's published agent skills, rather than the
  single guidance file it used to write. The catalog lives in
  tryterra/agent-skills and is fetched when the command runs, so a skill added
  there arrives on the next run without upgrading the CLI. It includes
  terra-cli, the skill for driving this CLI. Nothing is bundled in the binary,
  so setup now needs the network.

- Each skill is written where that agent reads it, which are the same
  directories `npx skills add tryterra/agent-skills` uses. Setup also looks at
  the agents installed on this machine, not only the ones this project already
  shows signs of.

- `terra agent setup` takes three new flags: `--skills` to install skills by
  name, `--global` to install for this user rather than into this project, and
  `--force` to write even where the skills are already current.

- The files an older CLI wrote (`.claude/skills/terra/SKILL.md`,
  `.codex/terra.md`, `.cursor/rules/terra.mdc`) are renamed to `.bak` on the
  first run, since nothing refreshes them any more.

## v0.2.0

#### Added

- Homebrew, on macOS:

      brew install tryterra/tap/terra

  Completions for bash, zsh and fish come with it, so there is nothing to set up
  by hand. npm still works everywhere, Windows included.

- macOS builds are signed and notarized by Apple. That is what lets the Homebrew
  install run, and it fixes the archives below too: macOS used to refuse one
  downloaded in a browser with "terra is damaged and cannot be opened".

#### Fixed

- The three commands that act on a single planned workout were missing the user
  they apply to. Getting, rescheduling and deleting a planned workout each need
  `--user-id`, `terra data-api` did not offer it, and the requests could not
  succeed. They take it now.

- `terra api --help` said query parameters were checked before a request is
  sent. Only the path and the method are.

## v0.1.0

### Breaking

- `terra reference --format tree` is gone. Use `terra reference` for the
  document, or `terra reference <group>` to scope it. The old spelling is a
  usage error naming what replaced it.
- `terra api` refuses a path the API description does not have, naming the
  endpoint it probably meant, and a method an endpoint does not take. Pass
  `--no-verify` to send a request unchecked.

### Added

- `terra data-api <path>` reaches the Terra data API: wearable data, and the
  flow that links a user to a provider. It acts on one environment, taken from
  `--env`, `TERRA_ENV` or the configured default, and authenticates with that
  environment's API key rather than your admin token. The key is fetched for
  you, which needs the `keys:read` scope, or set `TERRA_API_KEY` to supply it.
- `terra api list --data-api` lists the data API's endpoints.
- `terra api list <path>` narrows to one endpoint. With `--format json` that is
  its parameters, its body fields and its response fields.
- `terra -h` names `--format json`, `--json` and `--jq`, so a script or an agent
  finds the machine-readable path without walking help a level at a time.
- `TERRA_DATA_BASE_URL` points the data API somewhere other than the address
  derived from `TERRA_BASE_URL`.

### Changed

- `--env`, `TERRA_ENV` and `terra environments use` take an environment's name
  as well as its dev-id, matched without regard to case. An exact dev-id always
  wins, and a name two environments share is refused naming both.
  `terra environments use` stores the dev-id, so renaming an environment later
  cannot repoint the default. The account's list is cached under the config
  directory.
- `terra whoami` leads with the person who minted the token. The token's own
  label moves onto the `Token` line. `--format json` gains a `user` object, and
  `name` still means the token's label.

## v0.0.1

Initial public release for Terra CLI
