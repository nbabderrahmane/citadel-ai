# 🏰 CITADEL

**Tu vibecodes. Ta démo marche. Mais est-ce que ton projet repose sur du sable ?**

CITADEL aide les vibe coders sérieux à construire avec de la structure, de la mémoire et de la review — pour que leur MVP ne s'effondre pas sous les erreurs cachées.

[![npm version](https://img.shields.io/npm/v/citadel-ai.svg)](https://www.npmjs.com/package/citadel-ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

```bash
npx citadel-ai init
```

Fonctionne avec **Claude Code** · **Cursor** · **Antigravity** · **Windsurf**

---

## C'est pour toi ?

### CITADEL est fait pour

- Les solo founders qui construisent leur MVP avec l'IA
- Les opérationnels et PMs qui vibecodent des outils internes
- Les growth builders qui shippent vite sans équipe dev dédiée
- Les développeurs non-traditionnels qui veulent des garde-fous, pas du gatekeeping

### CITADEL n'est PAS fait pour

- Ceux qui cherchent des prompts one-shot
- Les devs seniors qui ont déjà une discipline d'architecture solide
- Les équipes qui ont besoin d'une plateforme CI/CD de production
- Les débutants complets qui n'ont jamais rien construit avec l'IA

---

## Le problème

Quand tu vibecodes sans structure :

- L'IA skip l'architecture — elle génère du code qui marche aujourd'hui et casse demain
- Personne ne review — le builder valide son propre travail (et rate ses propres erreurs)
- Le contexte se perd — l'IA oublie ce qui a été décidé 3 messages plus tôt
- Aucun standard — code spaghetti, magic numbers, business logic partout
- La sécurité est un afterthought — auth, encryption, compliance arrivent "plus tard" (jamais)

Tu te retrouves avec un prototype qui démo bien et qui s'effondre en utilisation réelle.

---

## Ce que CITADEL fait

CITADEL installe une couche de gouvernance dans ton IDE IA. Il ne remplace pas ton IA — il la fait travailler comme une équipe disciplinée au lieu d'un improvisateur solo.

**Force la réflexion stratégique d'abord.** Avant tout code, un C-Suite virtuel pose des questions sur ton produit, ton architecture, la sécurité, les données et la croissance. Tu réponds. Ensuite les specs sont rédigées. Pas l'inverse.

**Sépare la construction de la review.** L'agent qui écrit le code n'est jamais celui qui le review. Comme dans toute organisation d'ingénierie sérieuse.

**Impose des checks de sécurité avant le shipping.** 5 gates obligatoires de l'inception au déploiement. La sécurité a un droit de veto — sans exception.

**Garde la mémoire du projet entre les sessions.** Décisions, erreurs, choix d'architecture — tout est persisté localement. L'IA ne repart pas de zéro à chaque fois.

**Charge uniquement ce qui est nécessaire.** Au lieu de charger les 42 profils d'agents en contexte (et de cramer ton quota de tokens), CITADEL ne charge que l'équipe pertinente pour la phase en cours. 88% de tokens en moins.

---

## Sans CITADEL / Avec CITADEL

| | Sans | Avec CITADEL |
|--|------|-------------|
| Démarrage | "Fais-moi une app" → l'IA fonce dans le code | Le C-Suite demande : c'est pour qui ? quelles données ? quelle sécurité ? |
| Architecture | Ce que l'IA décide sur le moment | ADR explicite, reviewé par un agent architecture dédié |
| Qualité du code | On espère que ça tient | Standards enforcés : 200 lignes/fichier, erreurs typées, pas de magic numbers |
| Review | Tu relis toi-même (et tu rates des trucs) | Agents checkers indépendants avec une perspective différente |
| Sécurité | "On ajoutera l'auth plus tard" | Review sécurité à chaque gate. Droit de veto sur le déploiement |
| Session suivante | L'IA a tout oublié | La mémoire persiste décisions, erreurs et contexte projet |
| Consommation tokens | Contexte complet à chaque message (~14K tokens) | Chargement par phase (~1 800 tokens par phase) |

---

## Comment ça marche — 5 étapes

### Étape 1 : Clarifier ce que tu construis
Le C-Suite (produit, architecture, sécurité, données, croissance) pose des questions avant que quoi que ce soit ne soit rédigé.

### Étape 2 : Verrouiller la stratégie
PRD, décisions d'architecture, exigences sécurité, modèle de données — tout écrit dans `.citadel/specs/` après tes réponses.

### Étape 3 : Construire avec séparation des rôles
Des agents makers spécialisés construisent par domaine (backend, frontend, mobile, API, auth, data). Chacun suit des standards de code stricts.

### Étape 4 : Reviewer avant de shipper
Des agents checkers indépendants valident la qualité du code, les tests, la performance, la sécurité, l'accessibilité. Builder ≠ reviewer — toujours.

### Étape 5 : Shipper avec mémoire
Décisions, erreurs et contexte persistent dans `.citadel/memory/`. La session suivante reprend là où tu t'es arrêté.

---

## Démarrage rapide

### Option 1 : Copie-colle dans ton chat IA (le plus simple)

Ouvre ton IDE IA (Cursor, Antigravity, Claude Code, Windsurf) et colle ça :

```
Lance cette commande dans le terminal : npx citadel-ai init
Puis lis le fichier CLAUDE.md ou GEMINI.md qui a été créé et suis ses instructions.
```

Ton IA fait le reste. Décris ce que tu veux construire.

### Option 2 : Une commande dans le terminal

Ouvre le terminal dans ton IDE (appuie sur `` Ctrl+` `` dans la plupart des IDEs) et tape :

```bash
npx citadel-ai init
```

Retourne dans ton chat IA et commence à parler.

### Jamais utilisé un terminal ?

Voir [GETTING-STARTED.md](GETTING-STARTED.md) — un guide pas-à-pas sans aucun prérequis.

---

## Ce qui est installé

```
ton-projet/
├── CLAUDE.md              ← Chargé auto par Claude Code
├── GEMINI.md              ← Chargé auto par Antigravity
├── .cursorrules           ← Chargé auto par Cursor
├── .windsurfrules         ← Chargé auto par Windsurf
├── .claude/commands/      ← /citadel-help, /citadel-build, /citadel-review...
├── .cursor/commands/
├── .citadel/
│   ├── agents/            ← 42 personas d'agents complètes (référence)
│   ├── teams/             ← 10 fichiers équipe (chargement par phase)
│   ├── specs/             ← PRD, ADR, Sécurité, Data Model, Growth
│   ├── memory/            ← État persistant (gitignored)
│   └── gates/             ← Suivi des gates (gitignored)
```

Tout est installé. L'IDE ne lit que ce qui est contextuel.

| IDE | Comment démarrer |
|-----|-----------------|
| Claude Code | `/citadel-help` |
| Cursor | `/citadel-help` |
| Antigravity | Commence à chatter |
| Windsurf | Commence à chatter |

CLI optionnel (nécessite une clé API) :
```bash
export ANTHROPIC_API_KEY=sk-ant-...  # ou OPENAI_API_KEY
npx citadel-ai run
```

---

## Pourquoi c'est différent

La plupart des frameworks IA donnent **plus d'agents**. CITADEL donne **plus de discipline**.

- **Organisation > cerveau unique.** 42 agents avec des rôles, règles et personnalités distincts — mais chargés par phase, pas tous en même temps.
- **Gouvernance > vitesse.** Questions avant specs. Review avant ship. Veto sécurité avant déploiement.
- **Mémoire > amnésie.** Décisions, choix d'architecture et erreurs passées persistent localement entre les sessions.
- **Efficacité > force brute.** Chargement de contexte par phase : ~1 800 tokens au lieu de ~14 000.

---

## Les 42 agents

Chaque agent a une persona complète : nom, inspiration, philosophie, voix, règles immuables et system prompt. Tout stocké dans `.citadel/agents/`.

**Stratégie (C-Suite) :** ATLAS (Orchestrateur) · LINUS (CTO) · MARTY (CPO) · SEAN (CGO) · BRUCE (CISO) · MONICA (CDO)

**Constructeurs (Makers) :** UNCLE BOB · DAN · STEIPETE · KELSEY · JONY · TERESA · STRUNK · DJ PATIL · CYRUS · CHAMATH · FILIPPO · MOXIE · MAX · CODD · KARPATHY · HARRISON · ALEX · GRACE · CHARITY · RICH

**Validateurs (Checkers) :** GUIDO · KENT · BRENDAN · JAKOB · RAZOR · LISA · NATE · ALEYDA · PEEP · CHARLIE · WINDOW · DATE · DEMING · FLYWAY · AARON · TRAIL

`npx citadel-ai agents` les liste tous avec leurs rôles et équipes.

---

## Limites connues

- **Early stage.** C'est la v1, en développement actif. Des aspérités sont à prévoir.
- **Pas autonome.** CITADEL structure le travail IA — il ne tourne pas sans supervision.
- **Pas un remplacement d'équipe.** Excellent pour les MVPs et l'outillage interne. Pour scaler en production, il faut de vrais développeurs et un CTO.
- **Dépendant de l'IDE.** Le chargement par phase dépend de comment ton IDE lit les fichiers de contexte. Le comportement varie.

---

## Roadmap

- [ ] Wizard d'onboarding (10 premières minutes guidées)
- [ ] Vidéo démo (60 secondes)
- [ ] Optimisations spécifiques par IDE
- [ ] Système de plugins pour agents personnalisés
- [ ] Cas d'usage non-code (équipes growth, marketing, ops)

---

## Commandes CLI

| Commande | Description |
|---------|-------------|
| `npx citadel-ai init` | Installe CITADEL dans ton projet |
| `npx citadel-ai update` | Met à jour le framework (garde tes données) |
| `npx citadel-ai run` | CLI interactif (nécessite clé API) |
| `npx citadel-ai agents` | Liste les 42 agents |
| `npx citadel-ai status` | Phase & gate en cours |
| `npx citadel-ai help` | Toutes les commandes |

---

## Contribuer

CITADEL est construit pour les gens qui construisent avec l'IA sans être développeurs traditionnels. Si c'est toi, tu es le bienvenu ici.

Voir [CONTRIBUTING.md](CONTRIBUTING.md) pour les guidelines.

---

## Licence

MIT

---

Construit avec 🏰 par des humains qui parlent aux machines.
