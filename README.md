# Top Save Wholesale — Website

A single-page website for **TOP SAVE WHOLESALE SDN BHD**, built to do two things:
get people to walk into the shop, and get them to message you on WhatsApp.

Plain HTML, CSS and JavaScript. No build step, no dependencies, no hosting fees.

---

## Preview it

Double-click `index.html`. That's the whole site.

## File layout

```
index.html                 the entire page
assets/css/styles.css      all styling (brand colours at the top)
assets/js/main.js          mobile menu, gallery fallback, footer year
assets/img/tsw-logo.png    logo
assets/gallery/            the product banners shown in "Our Range"
photos/                    your originals — print PDFs and source images
docs/                      the design spec the site was built from
```

---

## Everyday edits

Everything below is in `index.html`. Search for the text, change it, save, refresh.

| To change | Search for |
|---|---|
| Phone / WhatsApp number | `60137157918` — appears in 8 places, replace all |
| Email | `sales@topsavewholesale.com` |
| Address | `Unit L11` — appears in 2 places (Visit Us, footer) |
| Opening hours | `10:00am to 10:00pm` and `10am – 10pm` |
| Product categories | the `<div class="cat">` blocks under "What We Stock" |
| Brand colours | `--navy` and `--gold` at the top of `assets/css/styles.css` |

### The "Our Range" section

It currently shows your four product banners, held in `assets/gallery/`:

| File | Shows |
|---|---|
| `range-everyday-essentials.jpg` | Camping gear, umbrellas, torchlights, tissues, bin bags |
| `range-audio-mobile.jpg` | Headphones, earbuds, powerbanks, smart watches, cables |
| `range-smart-accessories.jpg` | Speakers, phone cases, fans, car mounts, plugs |
| `range-work-home-tech.jpg` | Keyboards, mice, dash cams, lamps, projectors, doorbells |

The banners are never cropped — each keeps its own shape, so the text on them
always stays readable. Each has a caption underneath listing what's in it; those
captions are in `index.html`, right below each image.

**To add more**, drop the file into `assets/gallery/` and copy an existing
`<figure class="gallery-item">` block in `index.html`, changing the filename,
the `alt` text and the caption. If a file is ever missing or renamed, that tile
quietly disappears instead of showing a broken image.

**To add real shop photos** (shop front, aisles, counter) — do the same thing.
Landscape works best. Resize to around 1200px wide first; straight-from-the-phone
photos are 4–8MB each and will make the page slow on mobile data.

### The WhatsApp links

Every WhatsApp button opens a chat with a message already typed in:

> "Hi Top Save Wholesale, I saw your website and would like to enquire about your products."

That's how you'll know a customer came from the website. To change the wording,
search `index.html` for `?text=` — the message must be URL-encoded
(`%20` for a space, `%2C` for a comma).

---

## The live site

**https://topsavewholesale.com**

Hosted free on GitHub Pages from the repo
[zorotan/topsavewholesale](https://github.com/zorotan/topsavewholesale),
served over HTTPS with a certificate GitHub renews automatically.

`www.topsavewholesale.com` and the old `zorotan.github.io/topsavewholesale/`
address both redirect here, so previously shared links keep working.

### How the domain is wired

- Domain registered at **Exabytes**; DNS zone lives in their **DNS Manager**.
- Four `A` records on `@` point to GitHub's servers
  (`185.199.108–111.153`), and a `CNAME` on `www` points to `zorotan.github.io`.
- The **`CNAME` file in this repo** holds `topsavewholesale.com`. Do not delete
  it — Pages deploys from the branch root, so if that file disappears the site
  silently reverts to the github.io address.

### Publishing an update

Edit the files, then run these three commands from this folder:

```bash
git add -A
```

```bash
git commit -m "Update opening hours"
```

```bash
git push
```

The live site updates about a minute later. Change the message in quotes to
describe whatever you changed.

### What is and isn't published

`.gitignore` keeps these on your computer only — they are **not** on the public
internet: `photos/` (the 76MB of print PDFs), `company_details.txt`, `docs/`,
and `.claude/`. Only `index.html` and `assets/` are published.

### Next step

Add **topsavewholesale.com** to your Instagram, Facebook and TikTok bios —
that's where most of your traffic will come from.

---

## Email

`sales@topsavewholesale.com` is hosted on **Zoho Mail** (free plan). The free
plan has no IMAP, POP or forwarding, so that mailbox lives only in Zoho's
webmail and mobile app — **not** in Gmail. Keep the Zoho Mail app installed with
notifications on, or enquiries from the website will go unread.

DNS for mail sits alongside the website records in the Exabytes DNS Manager:
three `MX` records to Zoho, plus `SPF`, `DKIM` (`zmail._domainkey`) and `DMARC`
(`_dmarc`). All verified passing.

DMARC is at `p=none` (monitor only), with aggregate reports going to
`topsavewholesale@gmail.com`. Once a month of reports shows nothing legitimate
failing, it can be tightened to `p=quarantine` by **editing** the existing
`_dmarc` record — never by adding a second one.

Upgrading to Zoho Mail Lite (around RM 48/year) would add forwarding and IMAP,
putting this mailbox into the Gmail app directly.

## About the logo files

- `tsw-logo-web.webp` (15 KB) — what visitors actually load
- `tsw-logo-web.png` (203 KB) — fallback for browsers without WebP, plus favicon
- `tsw-logo.png` (1 MB) — full-size original, used only for social link previews

If you ever replace the logo, regenerate all three. Don't point the page at the
1 MB original — that was the single heaviest thing on the site before it was
resized.
