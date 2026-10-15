import html, sys
sys.path.insert(0, ".")
from data import PHOTOS, PAGES, SESSIONS

E = html.escape
PRI = {1: ("Essential", "Needed before launch"), 2: ("Important", "Strongly recommended"), 3: ("Completes the set", "Can follow shortly after launch")}
BY = {p["n"]: p for p in PHOTOS}
TOTAL = len(PHOTOS)
ESSENTIAL = [p for p in PHOTOS if p["priority"] == 1]


def zone_html(z):
    x, y, w, h, label, kind = z
    return f'<span class="z z-{kind}" style="left:{x}%;top:{y}%;width:{w}%;height:{h}%"><i>{E(label)}</i></span>'


def frame(p):
    ar = "16 / 11" if p["ratio"].startswith("16:11") else "4 / 5"
    return f'''<figure class="frame-wrap">
      <div class="frame" style="aspect-ratio:{ar}">{"".join(zone_html(z) for z in p["zones"])}</div>
      <figcaption>Framing guide · {E(p["ratio"])}</figcaption>
    </figure>'''


def card(p):
    label, note = PRI[p["priority"]]
    path = f'public/images/{p["folder"]}/{p["file"]}'
    bullets = "".join(f"<li>{E(s)}</li>" for s in p["scene"])
    return f'''
  <article class="card" id="p{p["n"]}" data-priority="{p["priority"]}">
    <header class="card-head">
      <span class="num">{p["n"]}</span>
      <div class="head-text">
        <p class="kicker"><span class="pill pill-{p["priority"]}">{label}</span><span>Caption on site: “{E(p["caption"])}”</span></p>
        <h3>{E(p["title"])}</h3>
        <p class="file"><code>{E(p["file"])}</code><span class="path">{E(path)}</span>
          <button type="button" class="copy" data-copy="{E(p["file"])}" aria-label="Copy file name {E(p["file"])}">Copy</button></p>
      </div>
      <label class="done"><input type="checkbox" id="done-{p["n"]}" data-done="{p["n"]}"><span>Captured</span></label>
    </header>
    <div class="card-body">
      <figure class="shot">
        <img src="img/p{p["n"]}.jpg" alt="Current website section with the placeholder for photo {p["n"]} outlined in yellow">
        <figcaption>On the website today. The yellow outline is the placeholder this photograph replaces.</figcaption>
      </figure>
      <div class="brief">
        <p class="why">{E(p["why"])}</p>
        <h4>What to capture</h4>
        <p>{E(p["capture"])}</p>
        <h4>In the frame</h4>
        <ul>{bullets}</ul>
        <div class="facts">
          <div><h4>Light &amp; color</h4><p>{E(p["light"])}</p></div>
          <div><h4>Avoid</h4><p>{E(p["avoid"])}</p></div>
          <div><h4>What's needed</h4><p>{E(p["needs"])}</p></div>
        </div>
        {frame(p)}
      </div>
    </div>
  </article>'''


def page_section(key, name, url, overview, intro):
    photos = [p for p in PHOTOS if p["page"] == key]
    nums = [p["n"] for p in photos]
    rng = f'{nums[0]}–{nums[-1]}' if len(nums) > 1 else nums[0]
    extra = ""
    return f'''
<section class="page-sec" id="{key}" aria-labelledby="{key}-h">
  <div class="page-intro">
    <div>
      <p class="eyebrow">Page · {E(url)}</p>
      <h2 id="{key}-h">{E(name)}</h2>
      <p class="lede">{E(intro)}</p>
      <p class="count">Photographs {rng} · {len(photos)} {"shot" if len(photos)==1 else "shots"}</p>
      {extra}
    </div>
    <figure class="overview">
      <div class="overview-scroll" tabindex="0" aria-label="Full page view of {E(name)}, scrollable">
        <img src="img/{overview}" alt="The full {E(name)} page with each photo spot numbered in yellow">
      </div>
      <figcaption>The whole page, top to bottom. Numbers mark each photo.</figcaption>
    </figure>
  </div>
  {"".join(card(p) for p in photos)}
</section>'''


essential_chips = "".join(
    f'<a class="chip" href="#p{p["n"]}"><b>{p["n"]}</b><span>{E(p["title"])}</span></a>' for p in ESSENTIAL)

sessions = "".join(
    f'''<li><div class="sess-h"><b>{E(t)}</b><span>{E(d)}</span></div>
      <p class="sess-n">{" ".join(f'<a href="#p{n}" class="tag tag-{BY[n]["priority"]}">{n}</a>' for n in ns)}</p></li>'''
    for t, d, ns in SESSIONS)

checklist_rows = "".join(
    f'<tr><td class="tn">{p["n"]}</td><td>{E(p["title"])}</td><td><code>{E(p["file"])}</code></td><td>{PRI[p["priority"]][0]}</td><td>{"16:11" if p["ratio"].startswith("16") else "4:5"}</td><td class="box" aria-label="Captured"></td></tr>'
    for p in PHOTOS)

CSS = open("guide.css").read()
JS = open("guide.js").read()

page = f'''<title>Ray Gennaro Photography Guide</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;1,6..96,400&family=Instrument+Sans:wght@400;500;600&display=swap">
<style>{CSS}</style>
<div class="wrap">
<header class="masthead">
  <p class="eyebrow">Chef Ray Gennaro · Website photography</p>
  <h1>The photographs that <em>finish the website.</em></h1>
  <p class="lede">The website is designed and built. Every page works today, on phones and computers. What it is missing is real photography: {TOTAL} spots currently hold a placeholder. This guide shows each one exactly where it sits on the website and describes the photograph that replaces it.</p>
  <p class="live">See the live website: <a href="https://chef-ray-gennaro.vercel.app" target="_blank" rel="noopener">chef-ray-gennaro.vercel.app</a></p>
</header>

<section class="status" aria-labelledby="status-h">
  <h2 id="status-h" class="sec-h">Where the website stands</h2>
  <div class="status-grid">
    <div class="meter">
      <div class="meter-row"><span>Design &amp; build</span><b>Complete</b></div>
      <div class="bar"><span style="width:100%"></span></div>
      <ul class="built">
        <li>Home page</li><li>Experiences</li><li>The Chef, with his story</li><li>Request an evening</li><li>Private invitations</li><li>Phone and computer layouts</li>
      </ul>
    </div>
    <div class="meter">
      <div class="meter-row"><span>Photography</span><b><span data-count>0</span> of {TOTAL}</b></div>
      <div class="bar bar-photo"><span data-bar style="width:0%"></span></div>
      <ul class="pri-list">
        <li><span class="pill pill-1">Essential</span> {sum(p["priority"]==1 for p in PHOTOS)} photos needed before launch</li>
        <li><span class="pill pill-2">Important</span> {sum(p["priority"]==2 for p in PHOTOS)} strongly recommended</li>
        <li><span class="pill pill-3">Completes the set</span> {sum(p["priority"]==3 for p in PHOTOS)} can follow after launch</li>
      </ul>
    </div>
  </div>
  <div class="today">
    <figure class="today-desk"><img src="img/home-hero.jpg" alt="The home page opening on a computer"><figcaption>The home page today on a computer</figcaption></figure>
    <figure class="today-phone"><img src="img/phone-hero.jpg" alt="The home page opening on a phone"><figcaption>On a phone</figcaption></figure>
    <figure class="today-phone"><img src="img/phone-portrait.jpg" alt="Photo 09 placeholder on a phone"><figcaption>Photo 09, on a phone</figcaption></figure>
    <figure class="today-phone"><img src="img/phone-experience.jpg" alt="Photo 10 placeholder on a phone"><figcaption>Photo 10, on a phone</figcaption></figure>
  </div>
  <p class="note">The placeholders are not empty boxes on purpose: each one is a sketch of the light and color the real photograph should have. Use them as a guide to mood. The photograph replaces them exactly, at the same size and shape.</p>
</section>

<section class="rules" aria-labelledby="rules-h">
  <h2 id="rules-h" class="sec-h">For every photograph</h2>
  <ul class="rule-grid">
    <li><b>Real light only.</b> Candles, windows, lamps, sunset. No flash, no bright overhead light.</li>
    <li><b>Warm and dark.</b> Deep brown shadows, amber candlelight, ivory linen, aged brass. Like a still from a film.</li>
    <li><b>Shallow focus.</b> Fast lens, f/1.4–2.8. Background lights melt into soft circles.</li>
    <li><b>No guest faces.</b> Hands, shoulders, backs and silhouettes only. Discretion is part of the brand.</li>
    <li><b>Chef Ray is always real.</b> Any photo of him, his family or his past must be a real photograph. Never a stand-in or an imitation.</li>
    <li><b>Nothing branded.</b> No logos, wine labels, boat names or recognizable homes.</li>
    <li><b>Leave room at the edges.</b> The website trims about 5% from each edge and adds a caption along the bottom.</li>
    <li><b>One look throughout.</b> Edit all photos with the same warm, slightly muted grade.</li>
  </ul>
  <div class="delivery">
    <h3>Delivery</h3>
    <dl>
      <div><dt>Format</dt><dd>JPEG, sRGB, highest quality. Keep the RAW files.</dd></div>
      <div><dt>Portrait (4:5)</dt><dd>At least 2400 × 3000 px. Photos 09–19.</dd></div>
      <div><dt>Landscape (16:11)</dt><dd>At least 2400 × 1650 px. Photos 01–08.</dd></div>
      <div><dt>File names</dt><dd>Exactly as written on each card, lower case.</dd></div>
      <div><dt>Alternates</dt><dd>Two or three strong variations of each, named <code>-alt1</code>, <code>-alt2</code>.</dd></div>
    </dl>
  </div>
</section>

<section class="first" aria-labelledby="first-h">
  <h2 id="first-h" class="sec-h">Shoot these first</h2>
  <p class="lede small">These seven make the website ready to launch. Four of them need Chef Ray in person.</p>
  <nav class="chips" aria-label="Essential photographs">{essential_chips}</nav>
  <h3 class="sub-h">Suggested sessions</h3>
  <ul class="sessions">{sessions}</ul>
</section>

<nav class="toolbar" aria-label="Guide">
  <div class="jump"><a href="#home">Home</a><a href="#experiences">Experiences</a><a href="#chef">The Chef</a><a href="#checklist">Checklist</a></div>
  <div class="filter" role="group" aria-label="Show">
    <button type="button" data-filter="all" aria-pressed="true">All {TOTAL}</button>
    <button type="button" data-filter="1" aria-pressed="false">Essential {len(ESSENTIAL)}</button>
  </div>
</nav>

{"".join(page_section(*pg) for pg in PAGES)}

<section class="checklist" id="checklist" aria-labelledby="check-h">
  <h2 id="check-h" class="sec-h">Shot checklist</h2>
  <div class="table-scroll">
  <table>
    <thead><tr><th>#</th><th>Photograph</th><th>File name</th><th>Priority</th><th>Shape</th><th>Done</th></tr></thead>
    <tbody>{checklist_rows}</tbody>
  </table>
  </div>
</section>

<footer class="foot">
  <p>Chef Ray Gennaro · Photography guide for the website · Screenshots taken from the current build. A printable PDF of this guide is shared alongside it.</p>
</footer>
</div>
<script>{JS}</script>
'''
open("site/index.html", "w").write(page)
# Local wrapper for PDF rendering (the artifact host adds its own skeleton).
open("site/print.html", "w").write('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' + page.replace("<title>", "</head><body><title>", 0) + "</body></html>")
print("built", len(page) // 1024, "KB")
