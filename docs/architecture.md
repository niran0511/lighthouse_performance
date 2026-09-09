# Architecture

## Application flow

```text
React client
  -> Axios API client with JWT interceptor
  -> Express routes
  -> request validation and authentication middleware
  -> controllers
  -> Lighthouse / recommendation services
  -> Mongoose models
  -> MongoDB
```

The frontend owns presentation, browser-side input feedback, and authenticated navigation. Express owns trust boundaries and request responses. Controllers orchestrate use cases while services contain Lighthouse execution and recommendation mapping. Models provide persistence and ownership boundaries.

## Scan lifecycle

1. The API validates the submitted URL and blocks unsafe destinations.
2. A `PENDING` scan is saved for the authenticated user.
3. The scan becomes `RUNNING`; the Lighthouse service launches Chrome on the server.
4. Metrics and audit summaries are normalized defensively.
5. The recommendation service maps poor findings to high/medium/low actionable work.
6. The result is stored as `COMPLETED`, or saved as `FAILED` with a safe error message.

## Playwright automation

Browser tests are isolated in `tests/e2e`. They read Horizon credentials from environment variables, use accessible role/label/placeholder locators, and retain screenshots/traces on failure. No credential is committed to source control.

