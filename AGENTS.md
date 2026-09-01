# Seoul trip website — project memory

## Source of truth

- The authoritative repository is `https://github.com/silka-co/seoul` on `main`.
- The deployed site is `https://silka-co.github.io/seoul/`.
- Before changing the website, start from the latest `main` in that repository. Do not treat an untracked local folder, copied itinerary, or the master-list document as the website source of truth.

## Itinerary rules

- Keep each planned stop on only one calendar day. Check the `days` data for duplicate stop names after every itinerary edit.
- Do not schedule a venue on a day it is normally closed. Confirm current hours, exhibitions, reservations, and dates from primary/official sources when the information could have changed.
- List each day’s stops in visit order. Every stop must retain its Korean address plus Naver Map and KakaoMap links.
- Include the relevant designer, artist, exhibition, and booking note in the itinerary card. Keep optional alternatives visibly separate from the planned sequence.
- Museum SAN and other Wonju day trips are cancelled unless the user explicitly reinstates them. Do not re-add a second HAUS NOWHERE visit after the Seongsu visit unless the user explicitly asks.

## Verification and delivery

- Run `npm run lint`, `npm run build`, and the itinerary duplicate-stop scan before committing website changes.
- Commit only reviewed site files. Push to `main` only when the user asks for the website to be updated or explicitly asks to push.
