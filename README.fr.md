# CITADEL

Construis avec l'IA sans finir avec une app fragile.

CITADEL est une couche de gouvernance légère pour les outils de code assistés par IA. Il aide les solo founders, les PMs et les petites équipes à transformer leurs idées en MVPs solides en poussant l'IA à :

- poser les bonnes questions avant de coder
- garder la mémoire du projet entre les sessions
- séparer la construction de la review
- vérifier les risques avant le shipping
- montrer le budget token avant que le contexte parte en vrille

[![npm version](https://img.shields.io/npm/v/citadel-ai.svg)](https://www.npmjs.com/package/citadel-ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Fonctionne avec **Codex** · **Claude Code** · **Cursor** · **Antigravity** · **Windsurf**

## C'est pour qui ?

CITADEL est fait pour :

- les solo founders qui construisent avec l'IA
- les PMs qui veulent transformer une idée en outil ou en MVP
- les petites équipes sans vraie organisation engineering

CITADEL n'est pas fait pour :

- ceux qui cherchent des prompts one-shot
- les équipes qui ont déjà un process engineering très solide
- les besoins enterprise complets dès le départ

## Pourquoi l'utiliser ?

Sans structure, coder avec l'IA est souvent impressionnant au début, puis douloureux quelques semaines plus tard.

Problèmes classiques :

- l'IA code avant que le besoin soit clair
- elle oublie les décisions prises dans les sessions précédentes
- elle casse des parties qui marchaient déjà
- personne ne review le travail indépendamment
- le projet devient difficile à faire évoluer

CITADEL ajoute du process autour de ton IA pour que tu puisses aller vite sans construire une house of cards.

## Ce que CITADEL fait

Après l'installation, ton IA va :

1. Poser des questions avant d'écrire du code
2. Écrire le plan du projet et les décisions importantes
3. Utiliser des rôles spécialisés pour construire
4. Utiliser des rôles séparés pour reviewer
5. Garder une mémoire projet pour reprendre proprement la session suivante

Sous le capot, CITADEL utilise une organisation structurée avec stratégie, makers, checkers, mémoire et gates. Tu n'as pas besoin d'apprendre toute cette mécanique pour en tirer de la valeur.

## Installation en 2 minutes

Dans ton dossier projet :

```bash
npx citadel-ai init
```

Ensuite, ouvre ton IDE IA et commence à parler.

Si ton IA ne sait pas quoi faire, dis-lui :

```text
Suis CITADEL. Pose des questions d'abord, fais un plan, protège ce qui ne doit pas casser, puis construis, review, et shippe proprement.
```

## Ce qui est installé

CITADEL ajoute :

- des fichiers de règles IDE comme `AGENTS.md`, `CLAUDE.md`, `.cursorrules`
- un hub projet visible `citadel/` pour le statut, le contexte, les décisions, l'architecture, le runbook et le handoff
- une télémétrie token visible dans `citadel/TOKENS.md`
- un moteur caché `.citadel/` pour l'état interne, les gates, les équipes, les agents et les skills

Dans la plupart des cas, tu n'as rien à configurer à la main.

## Ce qui se passe ensuite

Une fois installé, le flow est simple :

1. Tu décris ce que tu veux construire
2. Tu réponds aux questions de clarification
3. Tu valides le plan
4. Tu laisses l'IA construire ou corriger le bon morceau
5. Tu laisses l'IA reviewer avant de shipper

## Commandes

```bash
npx citadel-ai init
npx citadel-ai update
npx citadel-ai run
npx citadel-ai status
npx citadel-ai estimate "flow login"
npx citadel-ai agents
```

Dans Claude Code ou Cursor, tu peux aussi utiliser :

- `/citadel-start`
- `/citadel-help`
- `/citadel-build`
- `/citadel-fix`
- `/citadel-review`
- `/citadel-ship`
- `/citadel-estimate`
- `/citadel-snapshot`
- `/citadel-status`

## Si tu n'as jamais utilisé de terminal

Voir [GETTING-STARTED.md](GETTING-STARTED.md).

## Limites

- CITADEL améliore la façon dont ton IA travaille, mais ne remplace pas le jugement
- c'est surtout utile pour les MVPs, les outils internes et les produits early-stage
- le projet évolue encore

## Pourquoi c'est différent

La plupart des setups IA cherchent surtout à générer plus de code.

CITADEL cherche surtout à obtenir :

- de meilleures décisions avant le code
- une meilleure mémoire entre les sessions
- des changements plus sûrs
- une meilleure review avant le shipping

## English

Version anglaise : [README.md](README.md)

## Licence

MIT
