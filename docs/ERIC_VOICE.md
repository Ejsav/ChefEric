# Eric's voice and facts — the one-hour session

The site was written without inventing anything about Eric: no clients, no numbers, no press, no culinary history. Every place his own words or proof belong already exists and stays hidden until it has real content. This session fills them and confirms every claim the concept makes.

Record it. Exact wording beats polished wording.

---

## Part 1 — His words (fills `content/voice.ts` → `quotes`)

The first quote appears large on the home page under the premise. Aim for one sentence that could only have come from him.

1. What does a great evening do to people that a great restaurant can't?
2. What do you notice in a room in the first ten seconds?
3. What did building websites and products teach you about hosting?
4. What's the one thing you never let happen at a table you're responsible for?
5. What's the difference between an evening that's expensive and one that's unforgettable?
6. Who is the evening for — the guests or the host?

## Part 2 — The Making (confirms `content/archive.ts`)

Six chapters are written in his voice but without dates or names. For each, confirm the line, change anything that isn't true, and decide whether to add a year or a place.

| Chapter | Lesson on the site | Confirm or rewrite |
|---|---|---|
| I. The screen | Every feeling was designed by someone. | |
| II. The pressure | Never confuse motion with progress. | |
| III. The attention | Trust is decided before anyone speaks. | |
| IV. The room | An evening is an interface. Design every touchpoint. | |
| V. The table | The guest should never see the effort. | |
| VI. Now | Every evening is built once. | |

## Part 3 — The Standards (confirms `content/archive.ts` → `standards`)

Five rules. Read each aloud; if he wouldn't say it that way, rewrite it in his words.

## Part 4 — The concept's promises (must be true before taking a booking)

- [ ] **Chef partners.** The site says each evening's kitchen is led by a chef chosen for the table. Name at least two chefs ready to work under this concept.
- [ ] **Team.** Service staff, sommelier on request, rentals and sound: who provides each.
- [ ] **Guest counts and notice periods** for each experience (`content/experiences.ts`).
- [ ] **A printed record after each evening** (Method step 05, `content/method.ts`).
- [ ] **Phones checked at the door, on request** (Discretion section).
- [ ] **Confidentiality agreements** offered as standard for yachts and islands.
- [ ] **Where evenings travel** (`content/places.ts`, `lib/site.ts` → `serviceArea`).
- [ ] **The Founders' Table** format: who it is for and what it includes.

## Part 5 — Proof (fills `testimonials`, `credentials`, `press`)

Only once real:
- three to five testimonials from hosts or guests, approved in writing, attributed without names
- verifiable figures, for example evenings hosted (never estimates)
- press or appearances, with links

## Part 6 — Launch setup

- [ ] Domain connected in Vercel, `NEXT_PUBLIC_SITE_URL` set
- [ ] Public inbox: `NEXT_PUBLIC_CONTACT_EMAIL`
- [ ] Inquiry delivery: `RESEND_API_KEY`, `INQUIRY_TO_EMAIL`, `INQUIRY_FROM_EMAIL` (until set, requests are only logged on the server)
- [ ] Private invitations: `INVITE_SECRET`
- [ ] Instagram: `NEXT_PUBLIC_INSTAGRAM`
- [ ] Privacy page reviewed by counsel
