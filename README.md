# Evad Ceremony - Voting Platform

Plateforme de vote pour la cérémonie EVAD 2026, construite avec Nuxt 3, Supabase et Resend.

## Fonctionnalités

- 10 catégories de prix avec jusqu'à 16 nominés chacune
- Vote sécurisé par OTP email (Resend)
- Persistence Supabase (Postgres + Storage pour les images)
- Admin panel : résultats temps réel + CRUD catégories/nominés (avec upload image)
- 1 vote par couple (email, catégorie) garanti au niveau DB
- Anti-fraude : rate limit, hash OTP, max 5 tentatives

## Stack

- **Framework** : Nuxt 3 (SSR)
- **DB / Storage** : Supabase (Postgres + Storage public)
- **Email OTP** : Resend
- **Styling** : Tailwind CSS

## Setup

### Prérequis

- Node.js 20+
- pnpm
- Un projet Supabase (https://supabase.com)
- Un compte Resend (https://resend.com)

### 1. Installation

```bash
pnpm install
```

### 2. Variables d'environnement

Copier `.env.example` en `.env` et remplir :

```env
ADMIN_PASSWORD=changeme
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
SUPABASE_STORAGE_BUCKET=nominee-images
RESEND_API_KEY=re_xxxxx
RESEND_FROM_EMAIL=EVAD Ceremony <vote@votre-domaine.com>
```

- `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` : Supabase → Project Settings → API
- `RESEND_API_KEY` : Resend → API Keys (en prod, vérifier un domaine d'envoi via DNS SPF + DKIM)
- En dev sans domaine vérifié, utiliser `EVAD Ceremony <onboarding@resend.dev>` (n'envoie qu'à l'email propriétaire du compte Resend)

### 3. Initialiser la base Supabase

Dans Supabase Studio → SQL Editor, exécuter le contenu de :

```
supabase/migrations/20260603120000_init_schema.sql
```

Puis créer le bucket Storage `nominee-images` (public) :
- Supabase Studio → Storage → New bucket → name `nominee-images` → cocher "Public bucket"

### 4. Seed initial des catégories et nominés

```bash
pnpm seed
```

Cela peuple les 10 catégories et leurs nominés depuis les valeurs initiales. Idempotent (upsert).

### 5. Lancer

```bash
pnpm dev
```

Le site est disponible sur http://localhost:3000.

## Admin

`/admin` — password = `ADMIN_PASSWORD` (par défaut `evad2026`).

Trois onglets :
- **Résultats** : statistiques et classement par catégorie
- **Catégories** : CRUD (créer, éditer, supprimer en cascade)
- **Nominés** : CRUD avec upload d'image vers Supabase Storage

## Architecture

- `src/server/api/` : routes Nitro publiques (`vote`, `verify-otp`, `categories`, `nominees`)
- `src/server/api/admin/` : routes admin protégées par middleware `admin-auth`
- `src/server/utils/` : `supabase` (client service role), `resend`, `otp`, `storage`, `admin-auth`
- `src/server/middleware/admin-auth.ts` : check password sur toutes les routes `/api/admin/*`
- `src/composables/` : `useCategories`, `useCategory`, `useNominee`, `useAdmin`
- `src/layouts/admin.vue` : layout admin avec login + nav onglets
- `src/pages/admin/` : pages admin (results, categories, nominees)
- `supabase/migrations/` : SQL versionné
- `scripts/seed-supabase.ts` : seed initial

## Sécurité

- `SUPABASE_SERVICE_ROLE_KEY` exclusivement côté serveur (jamais en `runtimeConfig.public`).
- RLS activé sur toutes les tables sans policy → seul le service role accède (anon key inerte).
- Email normalisé (lowercase + trim) avant query/insert.
- OTP hashé SHA-256 en DB, TTL 10 min, max 5 tentatives.
- Anti-double-vote via contrainte UNIQUE `(email, category_id)` en DB.
- Upload image : validation mime + taille (< 5 MB) côté backend.

## Dates clés

- Ouverture des votes : 7 juin 2026
- Cérémonie : 18 octobre 2026

## Production

```bash
pnpm build
pnpm preview
```

Voir https://nuxt.com/docs/getting-started/deployment.

## Credits

Développé par [Checkit](https://checkit.dance)

---

© 2026 EVAD Ceremony.
