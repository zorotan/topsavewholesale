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
| Email | `topsavewholesale@gmail.com` |
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

## Publishing it

The site is static files, so it can go online free:

- **Netlify Drop** — go to [app.netlify.com/drop](https://app.netlify.com/drop) and drag
  this whole folder onto the page. It's live in about 30 seconds. Easiest option.
- **GitHub Pages** or **Cloudflare Pages** — also free, needs a GitHub account.

Once it's live, point your domain at it and add the link to your Instagram,
Facebook and TikTok bios — that's where most of your traffic will come from.

---

## One thing worth doing

`assets/img/tsw-logo.png` is 2123×741px and about 1MB. The site only ever
displays it at 40–76px tall, so that's a 1MB download for nothing — noticeable
on mobile data. Run it through [tinypng.com](https://tinypng.com) (free, no
signup) and replace the file with the compressed version. Nothing else needs to
change.
