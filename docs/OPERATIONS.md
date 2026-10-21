# Operations

How the live site stays reliable: where requests go, how failures surface, and how to recover.

## Where a request goes

```
visitor ─► /api/website-inquiry ─► validate (zod) ─► screen (honeypot, timing, links)
                                      │
                                      ├─► email to LEADS_TO_EMAIL (Resend, Idempotency-Key)
                                      ├─► JSON to LEADS_WEBHOOK_URL (signed, Idempotency-Key)
                                      │
                                      └─ at least one accepted? ─► "received" + acknowledgment email
                                                   │
                                                   └─ none ─► 503 "could not be delivered", answers kept on the device
```

- **No silent success.** The visitor is told a request arrived only when a channel a person reads accepted it.
- **Unconfigured production fails loudly.** On a Vercel production deployment with no channel, the API returns 503 and logs `[leads] … no delivery channel configured in production`. Locally and in CI the lead is printed to the console instead.
- **Duplicates.** The form sends one `submissionId` per request. The server remembers it for 30 minutes per instance, and the same id is sent to Resend and the webhook as `Idempotency-Key`, which covers retries landing on another instance.
- **Spam.** A filled honeypot is answered with success and delivered nowhere. A request sent within four seconds of opening the form, or with more than three links, is delivered with a flag in the subject line, never dropped.
- **The chef request** (`/api/inquire`) on the demo validates and discards. On a customer site it uses the same delivery path.

### Redundancy

Configure **both** channels for anything that matters: email for reading, the webhook into a CRM or sheet as the system of record and backup. A webhook receiver can verify `X-Lead-Signature: sha256=<hmac>` with `LEADS_WEBHOOK_SECRET`.

## Rate limiting

`lib/rate-limit.ts` limits each address to 5 website requests (6 chef requests) per 10 minutes, per server instance. Serverless instances do not share memory, so add a platform rule for a hard limit:

Vercel → `eric-jokl` → **Firewall → Rules → Add rule**: *If* Request Path starts with `/api/` *then* **Rate Limit**, fixed window, 20 requests per 60 seconds per IP, action *Deny* (429).

## Monitoring

| What | Where |
|---|---|
| Real-user Web Vitals (LCP, INP, CLS at p75) | Vercel → Speed Insights |
| Traffic, sources, conversions (`sales_form_submit`, `cta:*`, `inquiry_submit`) | Vercel → Analytics → Events |
| Delivery failures | Vercel → Logs, filter `[leads]` |
| Render errors | `page_error` analytics event; Vercel → Logs |
| Uptime | An external monitor (Better Stack, UptimeRobot) on `/` and `/your-site/start`, alerting by email or phone. Recommended; not configured from this repository. |

A useful log drain or alert: notify when any log line contains `[leads]` and `failed` or `no delivery channel`.

## Staging and releases

- Every branch and pull request gets a **preview deployment** on Vercel: review there, never on production.
- `main` is production. CI must be green (guard, media guide, type-check, lint, build, dependency audit, 151 end-to-end checks) before merging.
- Rollback: Vercel → Deployments → choose the last good deployment → **Promote to Production**. Deployments are immutable, so a rollback is exact.
- Reproducible builds: `npm ci` from the committed lockfile on Node 22.

## Backups

- **Code and content** live in git; every version of the site is recoverable.
- **Photography** lives in `public/media/` in git. Keep the originals elsewhere too (the shoot's own archive).
- **Leads** live in the inbox and, if configured, the CRM/sheet. The site itself stores no personal data, so there is no database to back up.

## Secrets

Keys (`RESEND_API_KEY`, `LEADS_WEBHOOK_SECRET`, `INVITE_SECRET`) live only in Vercel environment variables, never in the repository or in client code. Only `NEXT_PUBLIC_*` values reach the browser, and none of them is secret. Give collaborators the least access they need on the Vercel team.
