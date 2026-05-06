/* ============================================================
   data.js — Supabase data loader (v3 — full fallback)
   ------------------------------------------------------------
   v3 changes:
   - Disable realtime (no WebSocket)
   - 5s timeout per query
   - Fallback now includes 12 products + 10 FAQ + 12 categories
     so the page renders fully even if DB is unreachable.
   ============================================================ */

const SUPABASE_URL  = 'https://nnnjofdrxrcvywwgzdhr.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ubmpvZmRyeHJjdnl3d2d6ZGhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2OTM4OTEsImV4cCI6MjA5MzI2OTg5MX0.me5Ms7YRXp9ILUEEOdfHaCn4UjjMk2oZsRYcohbPK7k';

// Disable realtime + replace the broken Web Lock with a no-op lock.
// The default lock can hang for 5s if a previous tab/session left it
// orphaned, which freezes ALL Supabase calls until it times out.
// A no-op lock is safe for single-tab usage.
function noOpLock(_name, _acquireTimeout, fn) { return fn(); }

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON, {
  realtime: { params: { eventsPerSecond: 0 } },
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    lock: noOpLock
  }
});

// ---------- Fallback products (12) -----------------------------
const FALLBACK_PRODUCTS = [
  { name:'ChatGPT Plus',         desc:'Private OpenAI account · GPT-4 + DALL·E',   theme:'chatgpt',    logo_class:'gpt', logo:'∞', price:'14.99', orders:'5,000',  completion:'100', like:'99.61', delivery:'15 min', seller:'AlphaVault',   color:'#10B981' },
  { name:'Spotify Premium',      desc:'Family plan · 6 accounts · Ad-free hi-fi',  theme:'spotify',    logo_class:'sp',  logo:'♪', price:'3.49',  orders:'12,400', completion:'99',  like:'98.42', delivery:'5 min',  seller:'NodeKing',     color:'#1DB954' },
  { name:'Netflix 4K UHD',       desc:'Premium · 4 screens · Worldwide access',    theme:'netflix',    logo_class:'nf',  logo:'N', price:'5.99',  orders:'8,250',  completion:'100', like:'97.85', delivery:'10 min', seller:'DigitalDen',   color:'#E50914' },
  { name:'YouTube Premium',      desc:'Ad-free · Background play · YT Music',      theme:'youtube',    logo_class:'yt',  logo:'▶', price:'2.99',  orders:'15,200', completion:'100', like:'99.12', delivery:'Instant',seller:'ByteBazaar',   color:'#FF0000' },
  { name:'Adobe Creative Cloud', desc:'All apps · PS, Ai, PR, AE + 20 more',       theme:'adobe',      logo_class:'ad',  logo:'A', price:'19.99', orders:'3,180',  completion:'98',  like:'96.74', delivery:'15 min', seller:'PixelPro',     color:'#FA0F00' },
  { name:'Discord Nitro',        desc:'HD streaming · Server boosts · Emojis',     theme:'discord',    logo_class:'dc',  logo:'D', price:'7.49',  orders:'6,840',  completion:'100', like:'98.93', delivery:'Instant',seller:'VaultMaster',  color:'#5865F2' },
  { name:'Canva Pro',            desc:'Premium templates · BG remover · 100GB',    theme:'canva',      logo_class:'cv',  logo:'C', price:'9.99',  orders:'4,520',  completion:'100', like:'99.34', delivery:'5 min',  seller:'KeyForge',     color:'#00C4CC' },
  { name:'Figma Professional',   desc:'Unlimited files · Dev mode · Libraries',    theme:'figma',      logo_class:'fg',  logo:'F', price:'11.99', orders:'2,910',  completion:'99',  like:'98.07', delivery:'Instant',seller:'ChainCrafted', color:'#A259FF' },
  { name:'Midjourney Pro',       desc:'AI image generation · Fast hours',          theme:'midjourney', logo_class:'mj',  logo:'M', price:'12.99', orders:'7,650',  completion:'100', like:'99.45', delivery:'10 min', seller:'NeonForge',    color:'#4A4A8E' },
  { name:'Notion Plus',          desc:'Unlimited blocks · AI · Collaboration',     theme:'notion',     logo_class:'nt',  logo:'N', price:'4.99',  orders:'3,420',  completion:'100', like:'98.76', delivery:'Instant',seller:'QuantumKey',   color:'#1F1F1F' },
  { name:'Steam Wallet $50',     desc:'Region-free gift code · Instant delivery',  theme:'steam',      logo_class:'st',  logo:'S', price:'47.50', orders:'9,100',  completion:'100', like:'99.20', delivery:'Instant',seller:'CryptoSage',   color:'#1B6FA8' },
  { name:'Apple Music',          desc:'Family plan · 6 accounts · Spatial Audio',  theme:'apple',      logo_class:'ap',  logo:'♫', price:'4.49',  orders:'4,280',  completion:'100', like:'98.55', delivery:'5 min',  seller:'OmegaVault',   color:'#FA2D48' }
];

// ---------- Fallback hard-coded -------------------------------
const FALLBACK_SITE_DATA = {
  logo: { text: "Nexus.Market", accent_index: 5 },
  sub_nav: [
    { label: "Home",        href: "index.html",       active: true  },
    { label: "Marketplace", href: "marketplace.html", active: false },
    { label: "Docs",        href: "#",                active: false },
    { label: "Tools",       href: "#",                active: false },
    { label: "Earn",        href: "#",                active: false }
  ],
  hero: {
    title_html: 'The decentralized marketplace<br>for <span class="accent">digital goods</span> &amp; subscriptions.',
    description: "Buy, sell, and trade premium accounts, AI tools, and software keys with cryptographic escrow. Zero middlemen. Instant delivery. Full transparency.",
    ctas: [
      { label: "Explore Marketplace", url: "marketplace.html", style: "primary" },
      { label: "Start Selling",       url: "#",                style: "secondary" }
    ],
    stats: [
      { value: "12.4K", suffix: "+", label: "Active Listings" },
      { value: "98.7",  suffix: "%", label: "Success Rate"   },
      { value: "$2.1M", suffix: "",  label: "Volume / 30D"   },
      { value: "<90",   suffix: "s", label: "Avg. Delivery"  }
    ]
  },
  // 4 sections, each with all 12 fallback products
  sections: [
    { id: 'best-sellers',  title: 'Best Sellers',  subtitle: 'Top performers · Verified by smart contracts · Highest demand',  title_href: '#', products: FALLBACK_PRODUCTS },
    { id: 'trending',      title: 'Trending Now',  subtitle: 'Most active listings · Buyer favorites · 24h volume',            title_href: '#', products: FALLBACK_PRODUCTS },
    { id: 'new-arrivals',  title: 'New Arrivals',  subtitle: 'Just listed · Verified by smart contracts · Fresh from sellers', title_href: '#', products: FALLBACK_PRODUCTS },
    { id: 'premium-picks', title: 'Premium Picks', subtitle: 'Hand-curated · Top sellers only · Premium digital goods',        title_href: '#', products: FALLBACK_PRODUCTS }
  ],
  faq: {
    title: "Frequently Asked Questions",
    subtitle: "Everything you need to know about Nexus.Market — from how escrow works to why crypto, support, and seller policies.",
    title_href: "#",
    items: [
      { q: "How does the smart contract escrow work?", a: "When you place an order, your payment is locked in a smart contract until you confirm receipt of the product. The seller can only access the funds after you mark the order as fulfilled, or after the automated arbitration window closes without dispute. This protects both parties without requiring trust in a centralized middleman." },
      { q: "What payment methods do you accept?",      a: "We accept Bitcoin (BTC), Ethereum (ETH), USDT, USDC, and Solana (SOL) for all transactions. Crypto payments are processed via on-chain escrow contracts. We do not currently accept fiat payments to maintain decentralization, though this may be added in the future for select products." },
      { q: "How fast is delivery?",                    a: "Delivery times depend on the seller and product type. Most digital goods (account credentials, software keys, gift cards) are delivered instantly or within 5-15 minutes. Each listing displays the seller's average delivery time, and you can see real-time delivery stats on every product page." },
      { q: "What if the product doesn't work or the seller doesn't deliver?", a: "Open a dispute from your order page within 24 hours. Our automated arbitration system reviews the case and refunds your payment from escrow if the seller failed to deliver or the product is verifiably non-functional. Disputes are typically resolved within 24-48 hours." },
      { q: "Are the accounts and licenses legal?",     a: "All sellers must agree to our Terms of Service which prohibit selling stolen or fraudulently obtained accounts. We use a combination of seller verification, reputation scoring, and buyer reporting to maintain quality. However, you should review the listing details and seller reviews before purchasing — some products (like region-locked subscriptions) may have specific usage restrictions." },
      { q: "How do I become a seller?",                a: "Click \"Start Selling\" on the homepage and complete the seller verification process. New sellers undergo a brief KYC and listing review (usually 24 hours). Once approved, you can list unlimited products with no upfront fee. Nexus.Market takes a 3% fee on completed sales — paid only when you successfully fulfill an order." },
      { q: "Is my payment information private?",       a: "Yes. We only see the on-chain transaction hash, not your wallet identity beyond what you choose to share. We do not store credit card or banking information because we don't accept fiat. Your account email is required for order delivery but is never shared with sellers." },
      { q: "Can I get a refund?",                      a: "Yes, if the seller fails to deliver, the product doesn't match the listing, or you receive a non-functional product, you're entitled to a full refund through our dispute system. Refunds are sent back to your original payment wallet within 24 hours of dispute resolution. Note: \"buyer's remorse\" or \"I changed my mind\" is not grounds for refund on digital goods." },
      { q: "Do you have a referral program?",          a: "Yes. Click \"Earn\" in the navigation menu to join. You earn 1% of every transaction made by users you refer, paid in USDC weekly to your wallet. Top referrers also unlock perks like priority support and reduced platform fees." },
      { q: "How do I contact support?",                a: "Reach our 24/7 support team through Telegram, the in-app live chat, or by submitting a ticket from your order page. Average first response time is under 5 minutes for crypto orders and under 15 minutes for fiat orders." }
    ]
  },
  // Categories for the "All categories" dropdown
  categories: [
    { slug: 'social-media',    label: 'Social Media Accounts' },
    { slug: 'ai-productivity', label: 'AI & Productivity Accounts' },
    { slug: 'video-editing',   label: 'Video & Editing Accounts' },
    { slug: 'email-comm',      label: 'Email & Communication' },
    { slug: 'proxy-privacy',   label: 'Proxy & Privacy Tools' },
    { slug: 'courses',         label: 'Online Courses & Education' },
    { slug: 'ebooks',          label: 'Ebooks & Digital Guides' },
    { slug: 'software',        label: 'Software & Digital Tools' },
    { slug: 'accounts',        label: 'Accounts & Access (General)' },
    { slug: 'digital-files',   label: 'Digital Products & Files' },
    { slug: 'services',        label: 'Services' },
    { slug: 'misc',            label: 'Miscellaneous / Other' }
  ]
};

// Expose fallback categories so navbar dropdown can use them
window.FALLBACK_CATEGORIES = FALLBACK_SITE_DATA.categories;

// ---------- Timeout helper -----------------------------------
function withTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('[data.js] ' + label + ' timed out after ' + ms + 'ms')), ms)
    )
  ]);
}

const QUERY_TIMEOUT_MS = 5000;

// ---------- Loaders ------------------------------------------

async function loadLogo() {
  try {
    const { data, error } = await withTimeout(
      sb.from('site_settings').select('logo_text, logo_accent_idx').eq('id', 1).maybeSingle(),
      QUERY_TIMEOUT_MS, 'loadLogo'
    );
    if (error || !data) { console.warn('[data.js] loadLogo fallback', error); return FALLBACK_SITE_DATA.logo; }
    return { text: data.logo_text, accent_index: data.logo_accent_idx };
  } catch (e) {
    console.warn('[data.js] loadLogo failed:', e.message);
    return FALLBACK_SITE_DATA.logo;
  }
}

async function loadSubNav() {
  try {
    const { data, error } = await withTimeout(
      sb.from('menu_items').select('label, href, is_active, sort_order').order('sort_order', { ascending: true }),
      QUERY_TIMEOUT_MS, 'loadSubNav'
    );
    if (error || !data || data.length === 0) { console.warn('[data.js] loadSubNav fallback', error); return FALLBACK_SITE_DATA.sub_nav; }
    return data.map(m => ({ label: m.label, href: m.href, active: m.is_active }));
  } catch (e) {
    console.warn('[data.js] loadSubNav failed:', e.message);
    return FALLBACK_SITE_DATA.sub_nav;
  }
}

async function loadHero() {
  try {
    const { data, error } = await withTimeout(
      sb.from('hero_content').select('title_html, description, ctas, stats').eq('id', 1).maybeSingle(),
      QUERY_TIMEOUT_MS, 'loadHero'
    );
    if (error || !data) { console.warn('[data.js] loadHero fallback', error); return FALLBACK_SITE_DATA.hero; }
    return {
      title_html:  data.title_html,
      description: data.description,
      ctas: Array.isArray(data.ctas) ? data.ctas.map(c => ({
        label: c.label,
        href:  c.url || c.href || '#',
        style: c.style || 'primary'
      })) : [],
      stats: Array.isArray(data.stats) ? data.stats : []
    };
  } catch (e) {
    console.warn('[data.js] loadHero failed:', e.message);
    return FALLBACK_SITE_DATA.hero;
  }
}

async function loadFaq() {
  try {
    const { data, error } = await withTimeout(
      sb.from('faq_items').select('question, answer, sort_order').eq('is_visible', true).order('sort_order', { ascending: true }),
      QUERY_TIMEOUT_MS, 'loadFaq'
    );
    if (error || !data || data.length === 0) { console.warn('[data.js] loadFaq fallback', error); return FALLBACK_SITE_DATA.faq; }
    return {
      title: "Frequently Asked Questions",
      subtitle: "Everything you need to know about Nexus.Market — from how escrow works to why crypto, support, and seller policies.",
      title_href: "#",
      items: data.map(f => ({ q: f.question, a: f.answer }))
    };
  } catch (e) {
    console.warn('[data.js] loadFaq failed:', e.message);
    return FALLBACK_SITE_DATA.faq;
  }
}

/* loadSections — DYNAMIC sections (no manual mapping needed).
   - Best Sellers : top 12 products by total_orders DESC
   - Trending Now : top 12 products by total_orders DESC + recent boost
   - New Arrivals : top 12 products by created_at DESC
   - Premium Picks: products where is_featured = true (admin-curated)
   This way: adding a product in admin auto-shows in New Arrivals (and Best
   Sellers if it has orders, Premium Picks if admin ticks Featured).
   No need to maintain section_products mapping. */
async function loadSections() {
  // Helper to normalize a product row from the DB into the shape pages expect.
  function normalize(p) {
    // Use first image as cover if present, otherwise fall back to legacy theme/logo
    const cover = (p.images && p.images.length) ? p.images[0] : null;

    // Resolve seller name: prefer the actual owner (profile) over the legacy sellers row
    let sellerName = 'Seller';
    let sellerColor = '#3AABFF';
    if (p.profiles && p.profiles.display_name) {
      sellerName = p.profiles.display_name;
      // Generate a stable color from the user id (mock until we add avatar_color to profiles)
      sellerColor = '#3AABFF';
    } else if (p.sellers && p.sellers.name) {
      sellerName = p.sellers.name;
      sellerColor = p.sellers.avatar_color || '#3AABFF';
    }

    const ordersCount = Number(p.total_orders || 0);
    const isNew = ordersCount === 0;

    return {
      name:        p.name,
      desc:        p.description || '',
      theme:       p.theme || 'chatgpt',
      logo_class:  p.logo_class || 'gpt',
      logo:        p.logo_char || (p.name || '?').charAt(0).toUpperCase(),
      cover_url:   cover,
      price:       Number(p.base_price).toFixed(2),
      orders:      formatNumber(ordersCount),
      completion:  Number(p.completion_rate).toFixed(0),
      like:        Number(p.like_rate).toFixed(2),
      delivery:    p.delivery_time,
      seller:      sellerName,
      color:       sellerColor,
      slug:        p.slug,
      is_new:      isNew
    };
  }

  const PRODUCT_SELECT = `
    id, slug, name, description, base_price,
    theme, logo_class, logo_char, images,
    total_orders, completion_rate, like_rate, delivery_time, is_featured, created_at,
    owner_user_id,
    sellers ( name, avatar_color )
  `;

  async function queryProducts(orderCol, ascending, filter) {
    let q = sb.from('products').select(PRODUCT_SELECT);
    // status='approved' is enforced by RLS in public_read policy
    if (filter) q = filter(q);
    return withTimeout(
      q.order(orderCol, { ascending }).limit(12),
      QUERY_TIMEOUT_MS,
      'queryProducts(' + orderCol + ')'
    );
  }

  try {
    const [bestRes, trendingRes, newRes, featuredRes] = await Promise.all([
      queryProducts('total_orders', false).catch(e => ({ data: null, error: e })),
      queryProducts('total_orders', false).catch(e => ({ data: null, error: e })), // same metric for now
      queryProducts('created_at', false).catch(e => ({ data: null, error: e })),
      queryProducts('created_at', false, q => q.eq('is_featured', true)).catch(e => ({ data: null, error: e }))
    ]);

    // Collect all owner user ids and fetch their profiles in one query
    const allRows = [bestRes, trendingRes, newRes, featuredRes].flatMap(r => (r && r.data) || []);
    const ownerIds = [...new Set(allRows.map(r => r.owner_user_id).filter(Boolean))];
    const profileMap = {};
    if (ownerIds.length > 0) {
      try {
        const { data: profs } = await sb
          .from('profiles')
          .select('id, display_name, avatar_url')
          .in('id', ownerIds);
        (profs || []).forEach(p => { profileMap[p.id] = p; });
      } catch (e) {
        console.warn('[data.js] profile lookup failed', e);
      }
    }
    // Attach profile to each product row before normalization
    [bestRes, trendingRes, newRes, featuredRes].forEach(res => {
      if (res && res.data) {
        res.data.forEach(p => {
          if (p.owner_user_id && profileMap[p.owner_user_id]) {
            p.profiles = profileMap[p.owner_user_id];
          }
        });
      }
    });

    function buildSection(slug, title, subtitle, res) {
      const rows = (res && res.data) || [];
      const products = rows.map(normalize);
      // No fallback when DB is empty — show genuine empty state
      return {
        id: slug,
        title,
        subtitle,
        title_href: '#',
        products: products
      };
    }

    return [
      buildSection('best-sellers',  'Best Sellers',   'Top performers · Verified by smart contracts · Highest demand',  bestRes),
      buildSection('trending',      'Trending Now',   'Most active listings · Buyer favorites · 24h volume',            trendingRes),
      buildSection('new-arrivals',  'New Arrivals',   'Just listed · Verified by smart contracts · Fresh from sellers', newRes),
      buildSection('premium-picks', 'Premium Picks',  'Hand-curated · Top sellers only · Premium digital goods',        featuredRes)
    ];
  } catch (e) {
    console.warn('[data.js] loadSections failed:', e.message);
    return FALLBACK_SITE_DATA.sections;
  }
}

function formatNumber(n) { return Number(n || 0).toLocaleString('en-US'); }

async function loadSiteData() {
  console.log('[data.js] Loading site data from Supabase...');
  const startTime = Date.now();
  try {
    const [logo, sub_nav, hero, sections, faq] = await Promise.all([
      loadLogo(), loadSubNav(), loadHero(), loadSections(), loadFaq()
    ]);
    const elapsed = Date.now() - startTime;
    console.log('[data.js] Loaded in ' + elapsed + 'ms — sections:', sections.length, 'faq:', faq.items.length);
    return { logo, sub_nav, hero, sections, faq };
  } catch (e) {
    console.error('[data.js] Failed to load:', e);
    return FALLBACK_SITE_DATA;
  }
}

let SITE_DATA = null;

const SITE_DATA_READY = loadSiteData().then(d => {
  SITE_DATA = d;
  window.SITE_DATA = d;
  return d;
}).catch(e => {
  console.error('[data.js] Critical:', e);
  SITE_DATA = FALLBACK_SITE_DATA;
  window.SITE_DATA = FALLBACK_SITE_DATA;
  return FALLBACK_SITE_DATA;
});

window.sb = sb;
window.SITE_DATA_READY = SITE_DATA_READY;
