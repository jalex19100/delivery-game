# AGENTS.md

Guidance for coding agents working in this repository.

## What this is

A browser-based delivery-business simulation game. LAMP stack (PHP 8 + MySQL + Apache) serving
static-ish HTML views, with the arcade portion rendered by Phaser 3 on an HTML5 canvas.

The project is early-stage: the gameplay and UI are real, but there is **no backend API yet**.
All game state lives in `localStorage` under the key `deliveryGameState`. The MySQL schema in
`database/schema.sql` is designed but nothing reads or writes it at runtime.

## Layout

```
public/            Web root (Apache DocumentRoot / php -S target)
  index.php        Front controller — a switch on the URL path, includes a view
  .htaccess        Rewrites everything to index.php; security headers
  views/*.php      Full standalone HTML documents (no shared layout/partials)
  assets/js/       Source JavaScript (hand-edited)
  assets/css/      Stylesheets (loaded directly, never bundled)
  assets/images/   SVG sprites, loaded by Phaser at runtime by URL
  assets/dist/     BUILD OUTPUT — gitignored, do not hand-edit
src/config/        database.php returns a PDO config array (currently unused at runtime)
database/          schema.sql + migrations/ (see docs/database-management.md)
scripts/           build.sh, docker-setup.sh, create-migration.sh, check-deployment.sh
.github/workflows/ Static-file deploy + database deploy (both on push to main/master)
```

`README.md` documents an aspirational structure (`src/api`, `src/models`, `src/controllers`,
`public/game/scenes`). Those directories do not exist. Trust the tree above.

## Build and run

```bash
npm install && composer install
php -S localhost:8000 -t public
```

Or Docker (MySQL, phpMyAdmin, Apache, Vite dev server, MailHog):

```bash
./scripts/docker-setup.sh dev
```

Build the bundle after touching game JavaScript:

```bash
npm run build:prod
```

`npm run build` alone only writes `dist/`; `build:prod` runs `scripts/build.sh`, which also copies
`dist/*` into `public/assets/dist/` where the views actually look for it.

## The one gotcha that matters: two loading paths

The views do **not** all load JavaScript the same way.

- `views/game.php` loads the **built bundle**: `/assets/dist/js/game.js`. Editing
  `public/assets/js/game.js` or `game-scenes.js` changes nothing in the browser until you rebuild.
- Every other view (`dashboard`, `business`, `logistics`, `settings`, `404`) loads
  `/assets/js/dashboard.js` **directly** as a classic `<script>` — no build step, edits are live.
- `public/assets/js/main.js` is not referenced by any view. It is dead code today.

Consequences to keep in mind:

- `dashboard.js` is served as a classic script, so it cannot use ES module syntax. It currently ends
  with `export default Dashboard;`, which the browser rejects as a syntax error — treat that line as
  a live bug, not a pattern to copy.
- Vite's entry is only `public/assets/js/game.js` (see `vite.config.js`). Adding a new bundled entry
  means editing `rollupOptions.input`, not just creating a file.
- `vite.config.js` sets `publicDir: 'public'`, so a build copies `public/` into `dist/`, and
  `build.sh` then copies `dist/` back into `public/assets/dist/`. That nests a stale copy of the
  whole site under `public/assets/dist/assets/dist/…`. It is gitignored and harmless, but ignore
  those paths when searching — they are duplicates, not sources.
- Phaser is loaded from a CDN `<script>` in `views/game.php`, not from the bundle. Game code relies
  on the `Phaser` global; `game.js` guards with `typeof Phaser === 'undefined'`.

## Conventions

- Views are self-contained HTML documents. Adding a page means: a new `views/<name>.php` with the
  full `<head>`/`<body>`, plus a `case '/<name>':` in `public/index.php`.
- Game logic is plain ES6 classes, no framework, no TypeScript. `DeliveryGame` in `game.js` owns
  state and UI; `GameScene` in `game-scenes.js` owns the Phaser scene.
- Sprites are SVGs referenced by absolute URL (`/assets/images/x.svg`) in `GameScene.preload()`.
  New art must live in `public/assets/images/` and be registered there.
- Any change to persisted state must stay backward-compatible with existing `deliveryGameState`
  blobs in players' browsers, or explicitly clear them.
- Database changes go through `./scripts/create-migration.sh <name>` into `database/migrations/`,
  and `schema.sql` is updated to match.

## Tests

There are none. `composer test` maps to PHPUnit (installed at `vendor/bin/phpunit`) but no test
directory exists. Verify changes by running the app and checking the browser console — the game code
logs liberally.

## Deployment — be careful here

Pushing to `main`/`master` triggers a real production deploy:

- `.github/workflows/deploy_static_files.yml` builds, packages, and rsyncs over SSH to shared
  hosting. It runs `rm -rf $REMOTE_PATH/*` on the server before extracting.
- `.github/workflows/deploy_db.yml` fires when anything under `database/` changes and executes
  `schema.sql` and every migration against the production database (with a `mysqldump` backup and
  rollback-on-failure).

So a commit touching `database/` is a production database change. Don't push to `master` unless the
user has asked for a deploy. `deploy.sh` is the older manual path and is not used by CI.

## Secrets

`.env` is gitignored but **present in this working tree** — never print, commit, or copy its
contents. Use `env.example` when documenting configuration. Production credentials come from GitHub
Actions secrets prefixed `DELIVERY_`.
