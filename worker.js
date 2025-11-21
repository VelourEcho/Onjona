// Cloudflare Worker: serve OG HTML to social crawlers, redirect all other visitors immediately.
//
// Deploy this script in Cloudflare Workers and route it to the path you will share (e.g. example.com/Onjona).
//
// Behavior:
// - If User-Agent looks like a known social crawler -> return 200 with OG HTML (no redirect).
// - Otherwise -> return 302 redirect to affiliate URL (immediate).
//
// Replace AFFILIATE_URL and the OG_* constants below as needed.

const AFFILIATE_URL = 'https://www.effectivegatecpm.com/tkw0412f?key=c65f3961bc1f9764e1874c0408bb1cb0';
const OG_TITLE = "Exclusive Content You’ll Love";
const OG_DESCRIPTION = "Click to explore something special.";
const OG_URL = "https://velourecho.github.io/Onjona/"; // the canonical URL you want shown in previews
const OG_IMAGE = "https://raw.githubusercontent.com/VelourEcho/Onjona/main/image.jpg";
const OG_IMAGE_ALT = "Preview image";

const BOT_UA_REGEX = /facebookexternalhit|Facebot|WhatsApp|Twitterbot|Pinterest|Slackbot|LinkedInBot|Discordbot|embedly|TelegramBot|WhatsApp|Applebot/i;

addEventListener('fetch', event => {
  event.respondWith(handle(event.request));
});

async function handle(request) {
  const ua = request.headers.get('user-agent') || '';

  // If request comes from a recognized crawler, return the OG HTML for preview
  if (BOT_UA_REGEX.test(ua)) {
    const html = getOgHtml();
    return new Response(html, {
      status: 200,
      headers: {
        'content-type': 'text/html; charset=utf-8',
        // Prevent indexing even though crawler fetched the page
        'x-robots-tag': 'noindex, nofollow',
      }
    });
  }

  // For non-bots: immediate redirect (302)
  return Response.redirect(AFFILIATE_URL, 302);
}

function getOgHtml() {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="robots" content="noindex, nofollow" />
  <title>${escapeHtml(OG_TITLE)}</title>

  <!-- Open Graph (for Facebook / Messenger preview) -->
  <meta property="og:title" content="${escapeHtml(OG_TITLE)}" />
  <meta property="og:description" content="${escapeHtml(OG_DESCRIPTION)}" />
  <meta property="og:url" content="${escapeHtml(OG_URL)}" />
  <meta property="og:image" content="${escapeHtml(OG_IMAGE)}" />
  <meta property="og:image:alt" content="${escapeHtml(OG_IMAGE_ALT)}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="${escapeHtml(OG_TITLE)}" />

  <!-- Twitter card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(OG_TITLE)}" />
  <meta name="twitter:description" content="${escapeHtml(OG_DESCRIPTION)}" />
  <meta name="twitter:image" content="${escapeHtml(OG_IMAGE)}" />

  <link rel="canonical" href="${escapeHtml(OG_URL)}" />
  <style>
    body { font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial; background:#f2f5f9; margin:0; color:#0f1724; }
    .wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}
    .card{background:#fff;padding:28px;border-radius:12px;box-shadow:0 8px 30px rgba(16,24,40,0.08);max-width:520px;text-align:center}
    h1{font-size:20px;margin:0 0 12px}
    p{margin:0;color:#516377}
  </style>
</head>
<body>
  <main class="wrap" role="main">
    <div class="card" aria-live="polite">
      <h1>Exclusive Content You’ll Love</h1>
      <p>Click to explore something special.</p>
    </div>
  </main>
</body>
</html>`;
}

// simple safe html escape
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
