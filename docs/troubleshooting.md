# Troubleshooting

## See the request

```sh
terra environments list --show-headers
```

This traces the request and response to stderr. Headers are redacted and bodies
show only their byte count, so the output is safe to paste into an issue. The
response body still goes to stdout, unmixed with the trace.

## Check what would be sent

```sh
terra environments update --name Acme --dry-run
```

Nothing is sent. This is the fastest way to see which environment was resolved
and what body was built.

## Read the error

Errors print the API's own remediation text, which usually names the fix. A
missing scope, for example, tells you which scope to request.

The exit code narrows it down further: it says whether the CLI or the API
rejected the command. See [Exit codes](#exit-codes) below.

## See the raw response

```sh
terra api /environments
terra api list --uncovered
```

`terra api` reaches any endpoint by path, without the generated command's
validation or formatting in the way, which separates "the CLI built the wrong
request" from "the API answered this". `terra api --help` has the rest.

## Common cases

**"no environment selected"**. The command needs a dev-id. Pass `--env`, set
`TERRA_ENV`, or run `terra environments use <dev-id>`.

**"the endpoint does not exist on this deployment"**. A bare 404 with no problem
body usually means the request never reached the admin API: either the path is
wrong or the surface is not enabled on that host. Check `terra config --list`
for the base URL in use.

**A credential will not print.** That is deliberate. Add `--reveal`.

**A destructive command refuses.** There is no terminal to confirm against. Add
`--yes`.

**"not logged in"**. Run `terra login`, or set `TERRA_ADMIN_TOKEN`. Check with
`terra whoami`.

**The token was written to a file rather than the keyring.** No OS keyring was
available. The file is mode 0600. `terra config --list` shows which backend is
in use.

## Check for a stale install

```sh
terra version
```

## Exit codes

| Code | Meaning                                                      |
| ---- | ------------------------------------------------------------ |
| 0    | Success                                                      |
| 1    | The API returned an error                                    |
| 2    | Not authenticated, or the token was rejected                 |
| 3    | Input failed validation before the request was sent          |
| 4    | Usage error: an unknown command, a bad flag, wrong arguments |
| 5    | The product is not on the account                            |
| 6    | Internal error                                               |
| 7    | Canceled: you declined a confirmation prompt                 |

These are a contract. Branch on them rather than matching on message text.

### Why they are separate

The split that matters most is 3 against 1. Exit 3 means the CLI rejected the
input and sent nothing, so retrying without changing anything cannot help. Exit
1 means the API rejected it, so the problem may be state rather than the
command.

Exit 2 is separate from 1 because it has a single fix: authenticate again.

Exit 5 is reserved for a missing entitlement: the account has not bought the
product a command belongs to, so the fix is a purchase rather than a different
token or a retry.

The admin API does not yet distinguish that from a permission failure, so an
unsubscribed product currently returns 1. The code is fixed now so a script
written against it keeps working once the API grows the case.

Exit 6 means the CLI itself failed. Seeing it for something you typed is a bug
in the CLI, not in your command.

Exit 7 means you were asked to confirm and said no. It is separate from 0
because `terra tokens delete tok_1 && echo deleted` should not print "deleted"
after a decline, and separate from 6 because declining is the guardrail working,
not the CLI breaking.

### In a script

```sh
terra environments retrieve --env dev-prod >/dev/null 2>&1
case $? in
  0) ;;
  2) echo "log in first" ;;
  3) echo "bad input" ;;
  7) echo "canceled" ;;
  *) echo "something else went wrong" ;;
esac
```

Branch on `$?` directly. Inside `if ! cmd; then`, `$?` is the status of the
negation, so it is always 0 and every case falls through to the last one.
