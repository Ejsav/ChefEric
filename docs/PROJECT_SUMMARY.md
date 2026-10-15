# Chef Ray Gennaro: project summary

*October 2026 · prepared by Eric Jokl*

---

## 1. At a glance

| | |
|---|---|
| **Live website** | https://chef-ray-gennaro.vercel.app |
| **Status** | Designed, built, tested and live. It is waiting on photography, Ray's own words, and launch setup (domain and email). |
| **Overall score** | **8.5 / 10** today. **9+** once Ray's interview content and proof are added; no new code is needed for that. |
| **Pages** | 15 public pages, plus private invitation pages and a privacy page |
| **Performance (phone)** | Lighthouse 91–96 for speed, 96–100 for accessibility, 100 for best practices, 100 for SEO |
| **Quality checks** | 39 automated browser tests on desktop and phone. They run automatically on every change and are currently passing. |
| **Code** | GitHub `Ejsav/ChefEric`, branch `main` (the main repo; `Ejsav/Chef` is the original copy) |
| **Hosting** | Vercel, project `chef-ray-gennaro` |

---

## 2. The goal

Build the digital flagship for Chef Ray Gennaro, an Italian-American private chef from Connecticut with New Haven roots. He has decades of restaurant and private-chef experience, plus private-island dining and cooking classes.

The benchmark is not other chef websites. It is the best of luxury hospitality, private clubs and fashion: restraint, atmosphere, discretion and craftsmanship. The website should:
- make visitors feel they have met him
- present his work as possibilities, not packages
- turn the inquiry into the first chapter of working with him
- be ready to grow with the brand for the next decade

---

## 3. What a visitor experiences

### The feeling
- **A private room at night.** Deep espresso and walnut tones, ivory linen, aged brass, with oxblood used only twice on the whole site. Bodoni type, a classic Italian luxury typeface.
- **An opening sequence** on desktop, once per visit: a brass seal draws itself, his name rises, and a curtain lifts into the home page. Phones skip it and go straight in.
- **Continuous page transitions.** The header stays in place while the old page sinks into shadow and the new one rises like a curtain.
- **A site that responds:** a custom cursor that grows over anything clickable, buttons that lean gently toward the pointer, and a candle glow that follows the mouse (or shifts with scroll on phones).
- **Optional room sound:** a quiet fire-in-another-room ambience, off until the visitor turns it on.
- **Phones first-class:** a "Request an evening" bar sits where the thumb is, rails swipe, and the story runs vertically.
- **Adapts to every visitor:** slow connections, data-saver mode, older phones and reduced-motion settings each get a lighter version, decided before the page appears.

### Page by page

| Page | What's on it |
|---|---|
| **Home** | The opening ("Private tables for people who could dine anywhere") → The Premise, with words that ink in as you scroll → **Compose an evening** → **The Table** (sample menus) → The Chef → How an evening is made (five steps) → Discretion → the closing invitation |
| **Experiences** | Compose an evening, then the four forms: The Private Table · The Island & The Water · The Kitchen Lessons · The Occasion. Each lists what's included, group size and notice needed, with its own request button. |
| **Menus** | Four sample menus as printed cards on ivory paper: *Sunday, the New Haven way* · *Late summer in Connecticut* · *A night aboard* · *A winter table*. "Begin with a menu like this" carries the choice into the request. |
| **The Chef** | **The Archive:** six eras of his story that slide past horizontally on desktop (New Haven, the restaurant line, private rooms, the islands, teaching, now), each with what it taught him. Then **The Standards:** five rules for how he works. |
| **Where he cooks** | An index of six destination pages: **Connecticut · New York City · The Hamptons · Florida · Yachts · Private islands.** Each has its own written content, logistics, areas served and a questions section, with a request button that pre-fills the setting. |
| **Questions** | 17 answers across booking, pricing approach, the evening, travel, lessons, collaborations and discretion |
| **Inquire** | The conversational request (section 4) |
| **Private invitation** | A personal page that greets a guest by name |
| **Privacy** | A plain-language privacy notice |
| **404** | "This table isn't set." |

---

## 4. The signature features

### Compose an evening
Instead of a list of packages, visitors choose three things:
- **the room:** a Connecticut home, a Manhattan penthouse, a Hamptons estate, a Florida waterfront, a yacht, a private island, a hangar, or abroad
- **the reason:** friends, a milestone, hosting, family, a celebration, a lesson
- **the size of the table**

The evening is then written out for them, and one button carries it into the request.

### The conversational request
One question at a time, each shaped by the previous answer.
- **Asks the right person the right thing:** a planner is asked about "your client", and an assistant is asked about "they".
- **Practical follow-ups:** a yacht gets galley and stay-length questions, a home gets a kitchen question.
- **A shorter route for collaborations:** they skip the dinner questions (6 steps instead of 11).
- **Gifting:** "An evening as a gift" is its own path, a new source of revenue.
- **Easy to finish:** letter keys answer and Enter continues.
- **Drafts:** unfinished requests are saved for 14 days and offered back.
- **Read-back:** before sending, the visitor sees their request as one sentence, for example "A destination stay aboard a yacht in Newport, RI, in late June, for ten to twenty-four guests — a celebration."
- **What the office receives:** a reference number (RG-XXXXXX), the full details, and **where the client came from**: Instagram, Google, a concierge's link or a private invitation.

### Private invitations
Ray's office can generate personal invitation links, for example for "Mr. and Mrs. Whitman", with an optional note and a pre-selected setting.
- They are tamper-proof and expire on their own.
- They never appear in search results.
- They open the request already addressed to the guest.

This is the foundation for future client portals and proposals.

### Slots for his voice and proof
Ray's quotes, client testimonials, credentials (for example "30+ years") and press each have a place built into the site. They stay invisible until real content is added, then appear automatically. **Nothing invented is ever shown.**

---

## 5. Technology and quality

- **Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, a light animation library loaded only where it's needed, and Lenis smooth scrolling. Hosted on Vercel.
- **Speed:** every content page is pre-built as a static page, and the home page loads about 120 KB of JavaScript. Sections further down render only when the visitor approaches them.
- **Lighthouse on phones (latest runs):**

| Page | Speed | Accessibility | Best practices | SEO |
|---|---|---|---|---|
| Home | 91–92 | 97 | 100 | 100 |
| Menus | 92 | 100 | 100 | 100 |
| Connecticut | 92 | 100 | 100 | 100 |
| Questions | 95 | 100 | 100 | 100 |
| Inquire | 95 | 100 | 100 | 100 |

Nothing shifts while any page loads. The 97 on Home is the deliberate scroll effect where the opening words start faint and fill in; reduced-motion visitors see them at full strength.

- **Accessibility:** full keyboard use, screen-reader support, visible focus states, and respect for reduced-motion settings everywhere.
- **Safety net:** 39 automated browser tests covering:
  - every page on desktop and phone (one main heading, no sideways scrolling, no errors, no placeholder email)
  - the composer handing off to the request
  - the full planner-and-yacht request through to a reference number
  - the collaboration and gift paths
  - spam and incomplete requests being rejected
  - valid, expired and tampered invitations
- **Automatic checks:** typecheck, code quality, build and all 39 tests run on GitHub with every change. The first run passed.

---

## 6. Being found

- **Search pages:** six destination pages targeting the searches wealthy clients actually make ("private chef Connecticut", "private chef Hamptons", "yacht chef", "private island chef"), plus Menus and Questions.
- **Structured data for Google:** chef profile, business and services, a breadcrumb trail on every page, and question-and-answer data on the destination and Questions pages so Google can show answers directly.
- **Basics in place:** a sitemap of all 15 pages, clean page titles and descriptions, share images for links, and private pages hidden from search.
- **Safe addresses:** search engines are pointed at the live address until the real domain is connected, so nothing points at a domain that doesn't exist yet.

---

## 7. Honesty rules built into the work

- No invented clients, testimonials, press, numbers or quotes anywhere.
- Sample menus are clearly labelled as samples.
- Every photo of Ray, his family or his past must be a real photograph. Placeholders are mood sketches, not stand-ins.
- Guest faces are never shown.
- Details that need Ray's confirmation are flagged in the content files and listed in the interview kit.

---

## 8. Everything delivered

| Deliverable | Where |
|---|---|
| The live website | https://chef-ray-gennaro.vercel.app |
| Photography guide: 19 photos with screenshots of where each goes, instructions, priorities and a shoot plan. **Private until shared** from its Share menu. | https://claude.ai/artifact/B7gqBbTQQFL8BVH52v8sAn |
| Photography guide, printable PDF (27 pages) | Sent in chat as `Ray-Gennaro-Photography-Guide.pdf` |
| Complete image and video list: 72 assets, including the future films and pages | `docs/VISUAL_ASSETS.md` |
| The one-hour interview kit: 22 questions mapped to the exact places they fill, plus a facts checklist | `docs/RAY_INTERVIEW.md` |
| Technical guide (how to run, test and deploy) | `README.md` |
| This summary | `docs/PROJECT_SUMMARY.md` |

---

## 9. What's still open, and who it's waiting on

### Waiting on Ray (about an hour, after payment)
1. **The interview** (`docs/RAY_INTERVIEW.md`): his real quotes, his history with years and places, his signature dishes, and his own wording for The Standards.
2. **Proof:** three to five testimonials approved by past clients, verified credentials, any press.
3. **Confirm the facts** shown on the site: group sizes, notice periods, sommelier pairing, menu cards, the handwritten note after each evening, references on request, confidentiality agreements, and areas served.
4. **Family and career photos** to scan for the Archive.

### Waiting on the photographer
- **19 photographs** (see the photography guide). The 7 essential ones are numbers **01, 09, 10, 11, 12, 13 and 19**. Four of those need Ray in person (09, 12, 13 and 19), and one half-day session with him covers them.

### Setup, deliberately deferred until payment
- **Domain:** buy it, connect it in Vercel, set `NEXT_PUBLIC_SITE_URL`.
- **Public email:** set `NEXT_PUBLIC_CONTACT_EMAIL`. Until then no address is shown; contact links go to the request form.
- **Inquiry delivery:** set `RESEND_API_KEY`, `INQUIRY_TO_EMAIL` and `INQUIRY_FROM_EMAIL`. **Until then requests are only logged on the server and don't reach anyone.**
- **Private invitations:** set `INVITE_SECRET` so invitation links work.
- **Instagram:** set `NEXT_PUBLIC_INSTAGRAM`.
- **Analytics:** add Plausible or upgrade to Vercel Pro so click and request tracking is recorded. Page views already work on Vercel.
- **Legal:** a quick lawyer review of the privacy page before launch.

---

## 10. Score

| Area | Score |
|---|---|
| Art direction and typography | 8.5 |
| Motion and interaction | 7.5 |
| Mobile | 8 |
| Performance | 9 |
| Accessibility | 8.5 |
| The request experience | 9 |
| Engineering and testing | 9 |
| Search visibility | 8.5 |
| Copy | 7.5 |
| His story and voice | 6 (waiting on the interview) |
| Proof and trust | 5 (waiting on testimonials and credentials) |
| Launch readiness | 7.5 (domain and email deferred) |
| **Overall** | **8.5** |

**Path to 9+:** run the interview, add proof, swap in his real dishes, and add the photography. All of it is content; the site is built to receive it.

---

## 11. Timeline

| Step | What was done |
|---|---|
| 1. Foundation | Brand system, home page, Experiences, The Chef, request form, SEO basics |
| 2. The living system | Opening sequence, page transitions, cursor, responsive light, sound, phone action bar, device adaptation, Compose an evening, The Archive, The Standards, the conversational request, attribution, private invitations, analytics |
| 3. Asset planning | Complete image and video list; photography guide (web and PDF) |
| 4. Push to launch | Sample menus, six destination pages, Questions, gift path, slots for his voice and proof, privacy page, removal of placeholder details, automated tests and checks, performance fixes, live redeploy |
