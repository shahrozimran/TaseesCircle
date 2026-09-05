# English / Urdu language switching

## Required behavior

The public website, authentication screens, member dashboard and administration screens offer English and Urdu. A language button in each active navigation header opens a dropdown containing **English** and **اردو**. English is the default. The selected language persists across navigation, refreshes and return visits. Switching does not reset forms, sign users out, change routes or modify stored records.

Arabic Quran verses and Arabic religious passages remain exactly as authored, including diacritics and punctuation. Their containers explicitly declare `lang="ar"`, `dir="rtl"` and `translate="no"`. English explanatory translations, article prose and interface labels receive Urdu counterparts. User-authored posts, personal names, messages, addresses, passwords, email addresses and circle codes retain their original values.

## Implementation sequence

1. **Inventory and safeguards**
   - Inspect all public, authentication, dashboard and admin routes and shared components.
   - Catalogue authored interface text, editorial content, validation feedback, empty states, filters, notifications and accessible labels.
   - Preserve Arabic source data and existing authorization rules. Do not reintroduce the removed third-party translation widget.
2. **Shared localization foundation**
   - Add a local English-to-Urdu message catalogue with English source text as readable keys.
   - Provide a React language context, text component and translation/formatting helpers; perform translation during React rendering without modifying React-owned DOM text.
   - Read a validated language cookie on the server for matching first-render HTML. Persist user changes in a first-party cookie and local storage; synchronize open tabs.
   - Keep existing URLs and OAuth callback paths stable. Refresh server metadata after changes without a full page reload.
3. **Language controls**
   - Reuse one dropdown across public desktop/mobile navigation, dashboard headers and admin screens, including admin login.
   - Support click/touch, keyboard activation, arrow keys, Escape, outside click, current-selection announcement and focus restoration.
   - Match the existing gold/beige visual design and maintain compact mobile controls.
4. **Translate the full surface**
   - Home, About, Pakistan, Canada, discussion hubs and articles, Resources, Contact and Join pages.
   - Sign in, account creation, password recovery and profile setup.
   - Dashboard summary, profile, circle registration/joining, posts, membership controls, notifications and support.
   - Admin overview, approvals, circles, members/users, support tickets and administration dialogs.
   - Include form placeholders, accessible names, tooltips, success/error feedback, relative times, dates and counts. Keep option values and database enums language-independent.
5. **Urdu layout and Arabic protection**
   - Set the document language/direction to `ur`/`rtl` or `en`/`ltr`.
   - Use an Urdu-capable font and readable line spacing; replace directional spacing/alignment with logical utilities where appropriate.
   - Mirror directional navigation and sidebar placement, preserve symmetric decoration and keep email/code/phone inputs readable left-to-right.
   - Ensure existing Arabic content bypasses the catalogue in either language.
6. **Verification and publication**
   - Validate catalogue coverage, interpolation, locale normalization, English restoration and exact Arabic preservation.
   - Run lint and a production build; distinguish pre-existing issues from introduced regressions.
   - Exercise desktop/mobile public routes, both languages, dropdown keyboard behavior, navigation/refresh persistence, translated form feedback and article text in a real browser.
   - Exercise authenticated UI with local fixtures if live test credentials are unavailable; do not create production users or change production data for testing.
   - Review the diff, commit only task changes, push to the requested GitHub repository and report the commit plus any verification limits.

## Maintenance and acceptance criteria

New authored copy must have an Urdu catalogue entry and render through the localization helpers. Rich sentences should use named placeholders so Urdu can reorder variables without changing their values. Unknown user content falls back to its original text; it is never sent to an external translation service. Arabic data is excluded from translation, and regression checks compare it with the pre-change source.

Acceptance requires switching both directions on all app surfaces, persistence, readable RTL at mobile widths, unchanged Arabic and raw form/database values, successful production compilation and no new lint failures.

## Delivered implementation

- `src/lib/i18n/messages.mjs` contains the local Urdu catalogue. `translate.mjs` handles exact messages, named placeholders, known legacy notification templates, dates and bilingual search.
- `LanguageProvider` and the server cookie helper keep React content, document direction and metadata aligned. Reading the language cookie makes page rendering dynamic; there are no new locale URL prefixes or database migrations.
- `LanguageSwitcher`, `T` and `LocalizedForm` provide reusable controls, rich translated sentences and native validation feedback. Language options remain labelled English and اردو in both modes.
- Public navigation, mobile navigation, authentication, all dashboard/admin routes and the missing-page view are localized. Arabic containers stay outside translation boundaries. Account fields, posts, support correspondence, mosque names, addresses and join codes remain raw.
- Urdu uses Noto Naskh Arabic. Existing Arabic scripture retains Amiri. Layout spacing, off-canvas panels and directional navigation follow document direction.

## Verification and repeatable checks

Run `npm ci`, `npm run test:i18n`, `npm run build` and `npm run lint`.

The eight regression tests cover catalogue integrity, supported locales, safe interpolation, editorial coverage, JSX translation boundaries, all 38 baseline Arabic passages, localized dates and bilingual search. The baseline was captured from commit `bf2d5d9` before this feature; do not regenerate it merely to make a failing test pass.

Browser checks covered 13 public/authentication routes, Urdu/English restoration, native validation feedback, retained form values, reload persistence, cross-tab synchronization, keyboard navigation, mobile menus and Arabic text equality. Authenticated fixtures covered 14 dashboard/admin screens, including circle membership, prayer check-ins and admin tools at desktop and 375 px mobile widths.

The production build and localization tests pass. Lint comparison against the starting commit found 17 existing errors before this work and 15 afterward, with no introduced findings. New localization modules, tests and preview tooling lint cleanly. Existing hook-related lint errors remain outside this feature's scope.

Live authentication/database workflows require deployment environment credentials, which were unavailable locally. Authenticated visual checks used the actual page components with local fixture data; no production accounts or records were created or changed.

Production-mode browser checks also passed for 12 public/login routes and the translated 404 page: matching Urdu server HTML, localized titles, no JavaScript exceptions and no horizontal overflow at 375 px. The existing production middleware returns its configuration-missing 503 for `/admin/login` without service credentials; admin login was checked in development and authenticated admin screens through fixtures.

To repeat authenticated visual checks:

1. Run `npm run dev -- --port 3101` for the application's stylesheet and fonts.
2. In another terminal, run `npm run preview:i18n`.
3. Open `http://localhost:3102/?screen=dashboard&lang=ur` or use `lang=en`.
4. Available screens: `dashboard`, `profile`, `register`, `join`, `mycircle`, `circle`, `notifications`, `support`, `overview`, `approvals`, `circles`, `manage`, `users`, `tickets`. Use `path=/admin` for admin navigation highlighting. `mode=setup` and `mode=empty` exercise incomplete profiles and accounts without a circle.

Fixtures and mock imports are used only by the local preview bundle. They are never added to production routes. Screenshots and generated bundles go into ignored `output/`.

For new copy, add a catalogue entry and render authored text through `<T>` or `t()`. Use `<T message="...{name}..." values={{ name: <bdi>{name}</bdi> }} />` for sentences with user values, and translate option labels while preserving option values. Render user-authored content directly. Keep Quran Arabic in its protected `lang="ar" dir="rtl" translate="no"` container.
