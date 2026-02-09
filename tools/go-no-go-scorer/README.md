# VINO12 Go/No-Go Scorer

Interactive CLI tool voor het scoren van de Go/No-Go beslissing voor VINO12 product validatie.

## Features

- ✅ Interactieve CLI met 8 criteria
- ✅ Weighted scoring matrix (totaal 100%)
- ✅ Automatic threshold checking (Problem Validation, WTP, SOM)
- ✅ Risk analysis (hoog/medium/laag)
- ✅ JSON output voor data analysis
- ✅ Beslissingslogica (STRONG GO → STRONG NO-GO)

## Installation

```bash
npm install
```

## Usage

### Interactive Scoring

```bash
npm run score
```

Dit start een interactieve sessie die je door alle 8 criteria leidt.

### Build & Run

```bash
npm run build
npm start
```

## Workflow

1. **Run de scorer:**

   ```bash
   npm run score
   ```

2. **Beantwoord alle criteria:**
   - Score (0-5)
   - Rationale
   - Data sources
   - Confidence level
   - Key findings

3. **Review resultaten:**
   - Totale score (0-5)
   - Go/No-Go beslissing
   - Threshold checks
   - Risk analysis

4. **Vul validation report in:**
   - Gebruik JSON output
   - Vul `templates/validation-report.md` in
   - Review met stakeholders

## Output

### JSON Bestand

De scorer genereert een timestamped JSON bestand:

```
go-no-go-result-2026-02-09T01-23-45-678Z.json
```

### Structuur

```json
{
  "totalScore": 3.75,
  "decision": "GO",
  "passedThresholds": true,
  "thresholdChecks": [...],
  "criterionScores": [...],
  "riskAnalysis": {
    "highRisk": [],
    "mediumRisk": [...],
    "lowRisk": [...]
  },
  "timestamp": "2026-02-09T01:23:45.678Z"
}
```

## Decision Logic

| Totale Score | Beslissing         | Actie                  |
| ------------ | ------------------ | ---------------------- |
| ≥4.0         | **STRONG GO**      | Volledige commitment   |
| 3.5-3.9      | **GO**             | Proceed met monitoring |
| 3.0-3.4      | **CONDITIONAL GO** | Proceed met mitigatie  |
| 2.5-2.9      | **NO-GO**          | Overweeg pivot         |
| <2.5         | **STRONG NO-GO**   | Stop                   |

## Hard Blockers

Automatische NO-GO als:

- Problem Validation < 3.0
- Willingness to Pay < 2.0
- SOM < €500K (score < 3.0)

## Framework

Dit tool implementeert het framework uit:

- `frameworks/go-no-go-criteria.md`
- `templates/validation-report.md`

## Support

Voor vragen of issues, zie VINO-141 in Plane.
