<!-- CLEO:START -->

@.cleo/templates/AGENT-INJECTION.md

<!-- CLEO:END -->

# VINO12 - Project Configuration

**See:** `~/.claude/CLAUDE.md` for global configuration
**Plane Project:** VINO (identifier), UUID: c8eac7b1-5a7c-429f-9fee-9b21ef62013c

---

## Quick Reference

Dit project gebruikt de globale configuratie van `~/.claude/CLAUDE.md`.

### Plane Integration

| Setting            | Value                                |
| ------------------ | ------------------------------------ |
| Project Identifier | VINO                                 |
| Project UUID       | c8eac7b1-5a7c-429f-9fee-9b21ef62013c |
| Sync Library       | `~/.cleo/lib/plane-sync.sh`          |

### Tech Stack

| Component  | Keuze                               |
| ---------- | ----------------------------------- |
| Framework  | Next.js 14 (App Router)             |
| Database   | Supabase (PostgreSQL 17)            |
| Payment    | Mollie (iDEAL native)               |
| Email      | Resend + react-email                |
| Cache      | @rooseveltops/cache-layer + Upstash |
| UI         | Shadcn/ui + Tailwind CSS            |
| State      | Zustand                             |
| Monitoring | Sentry + OpenTelemetry              |
| Hosting    | Vercel                              |

### Route Structure

- `(shop)/` - Publieke winkel (NL: `/wijnen`, `/winkelwagen`, `/afrekenen`)
- `admin/` - Admin dashboard
- `api/` - API routes (EN: `/api/products`, `/api/checkout`, `/api/webhooks/mollie`)

### Compliance

- **Leeftijdsverificatie**: 18+ gate, server cookie, middleware check
- **GDPR**: Cookie consent, data export/deletion endpoints
- **PCI DSS**: Mollie hosted payment page (SAQ-A compliant)

### Daily Workflow

```bash
# Pull issues from Plane
source ~/.cleo/lib/plane-sync.sh
plane-sync pull --project VINO

# Start CLEO session
cleo session start --scope epic:T001 --auto-focus

# Complete task
cleo complete T###

# Push to Plane (via MCP)
# State updates happen automatically via plane-mcp-workflow.md
```

---

**Voor volledige configuratie, zie:**

- Global config: `~/.claude/CLAUDE.md`
- Plane workflow: `~/.claude/rules/plane-mcp-workflow.md`
- MCP reference: `~/.claude/docs/MCP-REFERENCE.md`
