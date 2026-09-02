# Seoul trip website — project memory

## Source of truth

- The authoritative repository is `https://github.com/silka-co/seoul` on `main`.
- The deployed site is `https://silka-co.github.io/seoul/`.
- Before changing the website, start from the latest `main` in that repository. Do not treat an untracked local folder, copied itinerary, or the master-list document as the website source of truth.

## Itinerary rules

- Treat `app/page.tsx` as the current schedule. Do not duplicate the full itinerary in project memory, because dates and choices continue to evolve during the trip.
- Keep each planned stop on only one calendar day. Check the `days` data for duplicate stop names after every itinerary edit.
- Do not schedule a venue on a day it is normally closed. Confirm current hours, exhibitions, reservations, and dates from primary/official sources when the information could have changed.
- List each day’s stops in visit order. Every stop must retain its Korean address plus Naver Map and KakaoMap links.
- Include the relevant designer, artist, exhibition, and booking note in the itinerary card. Keep optional alternatives visibly separate from the planned sequence.
- Museum SAN and other Wonju day trips are cancelled unless the user explicitly reinstates them. Do not re-add a second HAUS NOWHERE visit after the Seongsu visit unless the user explicitly asks.

## Traveler preferences

- The shared Seoul trip is for Silka and Teresa. Resolve relative dates such as “today” and “tomorrow” in the `Asia/Seoul` timezone.
- Prioritize serious contemporary art, architecture, immersive spatial work, Korean and international designer fashion, well-curated vintage, and design-led shops or cafés. Do not prioritize K-pop, novelty attractions, or gimmicky pop-ups.
- Keep days geographically coherent and comfortable. Avoid unnecessary cross-city detours and long-distance day trips; allow time for shopping, trying things on, long lunches, and rest.
- When listing fashion, name every requested designer or label even when it is inside a department store or multi-brand retailer. Important requested names include SAN SAN GEAR, WOOYOUNGMI, WE11DONE, JUUN.J, Maison Margiela, Dior, Yohji Yamamoto, CFCL, Guidi, KOLOR, and Hed Mayner.
- Use exact venue names: `D&DEPARTMENT SEOUL by MMMG`, `SAN SAN GEAR Hannam`, `WE11DONE Cheongdam`, and `Maison Margiela — The Hyundai Seoul`.

## Stable trip decisions

- The travelers’ home base is `서울 종로구 창덕궁길 59-2`, near Changdeokgung in Jongno. Treat “near us” or “near the accommodation” as this address unless the user says they are elsewhere.
- Places confirmed visited include Design Miami Seoul, Maison Margiela at The Hyundai Seoul, SAN SAN GEAR at The Hyundai Seoul, and Jongno 3-ga Pojangmacha Street. Keep their subtle `✓ Been` history, exclude them from “not yet visited” recommendations, and do not place them on future active itinerary days.
- The Book Society Hoehyeon has not been visited. It is open Wednesday–Sunday 13:00–19:00 and closed Monday–Tuesday; it is roughly 30–40 minutes from the accommodation by public transport rather than immediately nearby.
- Aapex Bar has not been visited. It is in Yongsan at `서울 용산구 한강대로21길 17-13` and is roughly 40–50 minutes from the accommodation by public transport, so do not describe it as a nearby Jongno option.
- Cassina Store Seoul Samcheong was explicitly removed from the itinerary. Do not re-add it unless the user asks.
- The Book Society is closed Monday and Tuesday; never place it on Tuesday without verified evidence of a special opening.
- Hongje Yuyeon beneath Yujin Complex is the requested nighttime light-and-sound visit. Do not describe it as a laser show unless a verified temporary laser programme exists.
- Changdeokgung Secret Garden (Huwon) is the chosen palace-garden experience. The travelers care about the garden, not the palace interiors or changing-of-the-guard ceremony.
- HAUS NOWHERE Seoul in Seongsu and HAUS NOWHERE Dosan are different locations, but repeating the same Gentle Monster/Tamburins/NUDAKE brand family is unwanted after the Seongsu visit.
- Museum SAN and the Gwangju/Wonju museum day trips were removed because the travelers do not want to travel that far.

## Collaboration preferences

- When the user asks to review or rewrite the itinerary before changing the website, present the proposed schedule in chat and wait for approval before editing.
- When the user asks to update the website, apply the approved version to the authoritative repository, verify it, commit it, and push it so GitHub Pages can deploy.
- Be explicit about whether a suggestion is planned, optional, unscheduled, closed, or requires advance booking. Never imply that a local draft has been published.

## Verification and delivery

- Run `npm run lint`, `npm run build`, and the itinerary duplicate-stop scan before committing website changes.
- Commit only reviewed site files. Push to `main` only when the user asks for the website to be updated or explicitly asks to push.
