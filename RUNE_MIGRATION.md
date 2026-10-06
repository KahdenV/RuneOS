# RUNE OS migration roadmap

## Foundation
- Base: StarNet v0.13.1
- Main AI: Kara
- Local model target: Ollama / qwen3:8b
- Safety model: approval-gated high-impact actions
- Existing legacy RUNE prototype remains preserved separately

## RUNE divisions
- COMMAND: Kara
- BUSINESS: NOVA, ATLAS, FORGE, LEDGER, SENTINEL
- PERSONAL
- SCHOOL
- HOME
- MANUFACTURING
- COMMERCE

## Migration order
1. Import the stable upstream foundation without touching legacy RUNE.
2. Disable the upstream StarNet updater.
3. Replace visible StarNet branding with RUNE OS.
4. Replace restricted StarNet artwork/sprites/logo with original RUNE assets.
5. Configure Kara as the primary command persona.
6. Rebuild the Business Lab as native StarNet/RUNE agents and workflows.
7. Add RUNE approval policies and evidence-quality rules.
8. Bring over useful data/workflows from legacy RUNE only after the new base is stable.
9. Add Home Assistant, calendar/tasks, school, commerce, and other connectors.
10. Create a RUNE-specific updater/release pipeline.

## Important
Do not globally search-and-replace internal "StarNet"/"SKYNET" identifiers yet.
Some are internal protocol, filesystem, test, and compatibility names. Rebrand them
incrementally with tests so we do not break the harness.
