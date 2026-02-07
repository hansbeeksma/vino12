# VINO12 Agentic Brainstorm Format

> Stappenplan voor collaborative brainstormsessies met AI agents.
> Gebaseerd op: Notebook A (Agentic AI), MIDAS framework, Centaur model.

---

## Rolverdeling

### Mensen (Creative Directors)

| Persoon     | Rol               | Verantwoordelijkheid                 |
| ----------- | ----------------- | ------------------------------------ |
| **Jij**     | Creative Director | Visie, merkidentiteit, eindbesluiten |
| **Collega** | Strategy Director | Markt, doelgroep, business model     |

### AI Agents (Team)

| Agent               | Persona                | Model            | Functie                                                |
| ------------------- | ---------------------- | ---------------- | ------------------------------------------------------ |
| **De Interviewer**  | Onderzoeksjournalist   | Claude           | Stelt scherpe vragen om verborgen ideeën op te halen   |
| **De Communicator** | Brand Copywriter       | Claude           | Vertaalt complexe gedachten naar heldere boodschappen  |
| **De Challenger**   | Advocaat van de Duivel | GPT-4o (via MCP) | Challenget aannames, doet premortems                   |
| **De Sommelier**    | Wine Expert            | Gemini (via MCP) | Wijn expertise, markttrends, assortiment advies        |
| **De Architect**    | Tech Lead              | Claude Code      | Haalbaarheid, implementatie complexiteit               |
| **De Synthesizer**  | Facilitator            | Claude           | Combineert output van alle agents tot actionable items |

---

## Sessie Structuur (90 minuten)

### Fase 1: DIVERGENT — Explore Mode (40 min)

**Doel:** Zoveel mogelijk ideeën genereren vanuit diverse perspectieven.

#### Stap 1: Creative Brief (5 min) — MENSEN

Schrijf samen een korte brief:

```markdown
## Brainstorm Brief

**Onderwerp:** [bijv. "Brand personality van VINO12"]
**Vraag:** [bijv. "Wat maakt VINO12 anders dan elke andere wijn webshop?"]
**Kaders:** [bijv. "Neo-brutalist design, €175 price point, NL markt"]
**Niet:** [bijv. "Geen traditioneel luxury, geen sommelier-pretentie"]
```

#### Stap 2: Agent Storm (20 min) — AI PARALLEL

Stuur de brief naar alle agents parallel via Claude Code:

```
# In Claude Code - parallel Task agents:

Task(claude/interviewer):
  "Je bent een onderzoeksjournalist. Stel 10 scherpe vragen
   over deze brief die ons dwingen dieper te denken: [BRIEF]"

Task(gemini/sommelier):
  "Je bent een wine industry expert. Genereer 8 onconventionele
   positioneringen voor dit wijnmerk: [BRIEF]"

Task(openai/challenger):
  "Je bent advocaat van de duivel. Noem 5 redenen waarom dit
   concept zou falen en 5 manieren om elk risico te neutraliseren: [BRIEF]"

Task(claude/communicator):
  "Je bent een brand copywriter. Schrijf 10 verschillende taglines
   en 3 brand manifestos voor dit concept: [BRIEF]"
```

#### Stap 3: Human Review (15 min) — MENSEN

- Lees alle agent output
- Markeer met **HOT** (verder uitdiepen), **WARM** (bewaren), **COLD** (verwerpen)
- Bespreek samen de HOT items
- Formuleer 2-3 richtingen om te verdiepen

---

### Fase 2: CONVERGENT — Focus Mode (35 min)

**Doel:** De beste ideeën verfijnen tot concrete richting.

#### Stap 4: Deep Dive (15 min) — AI GERICHT

Stuur de HOT items terug naar specifieke agents:

```
Task(claude/synthesizer):
  "Combineer deze 3 richtingen tot één coherent merkprofiel:
   1. [HOT item 1]
   2. [HOT item 2]
   3. [HOT item 3]

   Output: Brand DNA document met personality, tone, visuele
   richting, en kernwaarden."

Task(claude/architect):
  "Beoordeel deze richting op technische haalbaarheid:
   - Wat kan direct gebouwd worden?
   - Wat vereist externe tooling?
   - Wat zijn de risico's?"
```

#### Stap 5: Evaluator-Critic Loop (10 min) — AI

```
Task(claude/evaluator):
  "Beoordeel dit merkprofiel op:
   - Distinctiviteit (1-10): Hoe uniek vs concurrentie?
   - Coherentie (1-10): Past alles bij elkaar?
   - Uitvoerbaarheid (1-10): Kunnen we dit bouwen?
   - Doelgroep-fit (1-10): Resoneert dit met NL wijnliefhebbers?

   Geef per criterium een score en onderbouwing."
```

#### Stap 6: Besluit (10 min) — MENSEN

- Review het gesynthetiseerde merkprofiel + scores
- Neem beslissingen
- Documenteer in Plane issues

---

### Fase 3: VASTLEGGEN (15 min)

#### Stap 7: Documentatie — AI + MENSEN

```
Task(claude/synthesizer):
  "Maak een besluitendocument van deze brainstorm:

   ## Besluiten
   [lijst van genomen besluiten]

   ## Vervolgacties
   [concrete acties met eigenaar]

   ## Geparkeerde ideeën
   [WARM items voor volgende sessie]

   ## Verworpen
   [COLD items met reden]"
```

- Besluiten → Plane issues aanmaken
- Geparkeerde ideeën → Plane backlog
- Document → NotebookLM als bron toevoegen

---

## Brainstorm Topics Backlog

Gebruik dit als agenda voor meerdere sessies:

| #   | Sessie                  | Onderwerp                                            | Status |
| --- | ----------------------- | ---------------------------------------------------- | ------ |
| 1   | Brand Identity          | Merkpersoonlijkheid, tone of voice, visual direction |        |
| 2   | Product Concept         | Wijn selectie, pricing, box samenstelling            |        |
| 3   | User Experience         | Customer journey, onboarding, checkout flow          |        |
| 4   | Technische Architectuur | Agentic features, AI integratie, personalisatie      |        |
| 5   | Go-to-Market            | Lancering, marketing, partnerships, storytelling     |        |
| 6   | Visueel Ontwerp         | Logo, typografie, fotografie, verpakking             |        |

---

## Tools Setup

### Minimale Setup (Nu)

| Tool            | Gebruik                    | Status               |
| --------------- | -------------------------- | -------------------- |
| **Claude Code** | Orchestrator + agents      | ✅ Al geconfigureerd |
| **Gemini MCP**  | Sommelier + visueel agent  | ✅ Al geconfigureerd |
| **OpenAI MCP**  | Challenger agent           | ✅ Al geconfigureerd |
| **Miro**        | Visueel brainstorm board   | Aanmaken             |
| **NotebookLM**  | Kennisbank + sessie output | ✅ 2 notebooks       |

### Geavanceerde Setup (Later)

| Tool                 | Gebruik                        | Setup                |
| -------------------- | ------------------------------ | -------------------- |
| **CrewAI**           | Gestructureerde agent teams    | Python + YAML config |
| **Shared Workspace** | Async agent-agent samenwerking | Custom MCP server    |
| **Figma + AI**       | Visuele concept generatie      | Figma MCP            |

---

## Principes

1. **Mensen bepalen richting** — AI vergroot het speelveld
2. **Divergent voor convergent** — Eerst breed, dan smal
3. **Progressive Trust** — Start voorzichtig, geef agents geleidelijk meer vrijheid
4. **Alles documenteren** — Elke sessie levert Plane issues op
5. **Iterate** — Elke brainstorm bouwt voort op de vorige

---

_Gebaseerd op: Co-Intelligence (Mollick), MIDAS Framework, MultiColleagues, Notebook A bronnen_
_Versie: 1.0.0 | 2026-02-07_
