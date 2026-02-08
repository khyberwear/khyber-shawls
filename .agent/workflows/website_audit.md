---
description: Website Comprehensive Audit & Fix
---

# Tasks

## 1. React 19 Upgrade Fixes
- [ ] Scan for `useFormState` (replace with `useActionState`, import from 'react').
- [ ] Scan for `useFormStatus` (import from 'react').
- [ ] Verify `ReactDOM` usages.

## 2. Text Encoding (Mojibake) Repair
- [ ] Scan specifically for known mojibake artifacts:
  - `â€™` (’)
  - `â€“` (–)
  - `â€”` (—)
  - `â€œ` (“)
  - `â€` ”)
  - `â€¦` (…)
  - `âœ` (✨ etc)
  - `ðŸ` (Emojis)
- [ ] Fix identified files.

## 3. Type Safety & Linting
- [ ] Run `npm run lint`.
- [ ] Run `tsc --noEmit`.
- [ ] Fix critical errors.

## 4. Performance & Best Practices
- [ ] Review `next.config.ts`.
- [ ] Check fonts loading.
- [ ] Check image optimization (priority on LCP images).

## 5. Security Check
- [ ] Verify sensitive routes protection.
- [ ] Check `D1HttpBridge` usage security.

