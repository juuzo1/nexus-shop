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

    // Compute like rate from real ratings: likes / (likes + dislikes) × 100
    const likes    = Number(p.likes_count) || 0;
    const dislikes = Number(p.dislikes_count) || 0;
    const totalRatings = likes + dislikes;
    const likePct = totalRatings > 0 ? (likes / totalRatings * 100) : 0;

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
      like:        likePct.toFixed(2),
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
    likes_count, dislikes_count,
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


/* ============================================================
   GLOBAL DEPOSIT MODAL (Auto NOWPayments + Manual admin-approved)
   ------------------------------------------------------------
   Usage: window.openDepositModal()
   Available on every page that loads data.js.
   ============================================================ */
(function() {
  const NP_API_BASE = 'https://api.nowpayments.io/v1';
  const NP_API_KEY  = 'AJSE7BXG7ND91KX4M24Y4KCEC3QDFJ49';  // PUBLIC: only creates invoices, can't withdraw
  const NP_MIN_USD  = 15;
  const NP_MAX_USD  = 100000;
  const MAN_MIN_USD = 0.1;
  const MAN_MAX_USD = 100000;

  const NETWORKS = [
    { code: 'TRX', label: 'Tron (TRC20)',         field: 'deposit_wallet_trx' },
    { code: 'BSC', label: 'BNB Smart Chain (BEP20)', field: 'deposit_wallet_bsc' },
    { code: 'ETH', label: 'Ethereum (ERC20)',     field: 'deposit_wallet_eth' },
    { code: 'SOL', label: 'Solana',               field: 'deposit_wallet_sol' }
  ];

  function escHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }

  async function getDepositSettings() {
    if (!window.sb) return {};
    const { data, error } = await window.sb
      .from('site_settings')
      .select('deposit_wallet_eth, deposit_wallet_bsc, deposit_wallet_trx, deposit_wallet_sol')
      .eq('id', 1)
      .maybeSingle();
    if (error) { console.warn('[deposit] settings error', error); return {}; }
    return data || {};
  }

  window.openDepositModal = async function() {
    if (!window.sb) { alert('Database not connected.'); return; }
    const { data: { user } } = await window.sb.auth.getUser();
    if (!user) { alert('Please log in to deposit.'); return; }

    const settings = await getDepositSettings();

    const existing = document.getElementById('deposit-modal');
    if (existing) existing.remove();

    let activeTab = 'auto';            // 'auto' | 'manual'
    let selectedCoin = 'USDT';         // for Auto tab
    let selectedNetwork = 'TRX';       // for Manual tab

    const modal = document.createElement('div');
    modal.id = 'deposit-modal';
    modal.style.cssText = 'position:fixed; inset:0; z-index:10000; background:rgba(0,0,0,0.75); backdrop-filter:blur(8px); display:flex; align-items:center; justify-content:center; padding:20px; overflow-y:auto;';
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    function close() {
      modal.remove();
      document.body.style.overflow = '';
    }

    function render() {
      const tabsHtml = `
        <div style="display:flex; gap:6px; background:#0a0f1c; border:1px solid #1F2937; border-radius:10px; padding:4px; margin-bottom:20px;">
          <button type="button" data-tab="auto" class="dep-tab ${activeTab==='auto'?'dep-tab-active':''}" style="flex:1; background:${activeTab==='auto'?'linear-gradient(135deg,#3A7BD5,#3AABFF)':'transparent'}; border:none; color:${activeTab==='auto'?'#fff':'#9CA3AF'}; padding:10px; border-radius:7px; font-size:13px; font-weight:600; cursor:pointer; font-family:inherit;">Auto (NOWPayments)</button>
          <button type="button" data-tab="manual" class="dep-tab ${activeTab==='manual'?'dep-tab-active':''}" style="flex:1; background:${activeTab==='manual'?'linear-gradient(135deg,#3A7BD5,#3AABFF)':'transparent'}; border:none; color:${activeTab==='manual'?'#fff':'#9CA3AF'}; padding:10px; border-radius:7px; font-size:13px; font-weight:600; cursor:pointer; font-family:inherit;">Manual</button>
        </div>
      `;

      let bodyHtml = '';
      if (activeTab === 'auto') {
        bodyHtml = `
          <p style="font-size:12.5px; color:#9CA3AF; margin-bottom:18px;">Pay in any crypto via NOWPayments. Auto-credited once confirmed.</p>

          <label style="display:block; font-size:12px; color:#9CA3AF; text-transform:uppercase; letter-spacing:0.04em; font-weight:600; margin-bottom:8px;">Receive as</label>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:18px;">
            <button type="button" data-coin="USDT" class="dep-coin-btn" style="background:#0a0f1c; border:1.5px solid ${selectedCoin==='USDT'?'#3AABFF':'#1F2937'}; border-radius:10px; padding:12px; cursor:pointer; font-family:inherit; display:flex; align-items:center; gap:10px;">
              <span style="width:28px; height:28px; border-radius:50%; background:#26A17B; display:flex; align-items:center; justify-content:center; color:white; font-weight:700; font-size:13px;">T</span>
              <span style="color:#fff; font-weight:600; font-size:14px;">USDT</span>
            </button>
            <button type="button" data-coin="USDC" class="dep-coin-btn" style="background:#0a0f1c; border:1.5px solid ${selectedCoin==='USDC'?'#3AABFF':'#1F2937'}; border-radius:10px; padding:12px; cursor:pointer; font-family:inherit; display:flex; align-items:center; gap:10px;">
              <span style="width:28px; height:28px; border-radius:50%; background:#2775CA; display:flex; align-items:center; justify-content:center; color:white; font-weight:700; font-size:13px;">C</span>
              <span style="color:#fff; font-weight:600; font-size:14px;">USDC</span>
            </button>
          </div>

          <label style="display:block; font-size:12px; color:#9CA3AF; text-transform:uppercase; letter-spacing:0.04em; font-weight:600; margin-bottom:6px;">Amount (USD) <span style="color:#ff3a6e;">*</span></label>
          <div style="position:relative;">
            <span style="position:absolute; left:14px; top:50%; transform:translateY(-50%); color:#6B7280; font-size:14px; font-weight:600;">$</span>
            <input id="dep-auto-amount" type="number" min="${NP_MIN_USD}" max="${NP_MAX_USD}" step="0.01" placeholder="100.00" style="width:100%; box-sizing:border-box; background:#0a0f1c; border:1px solid #1F2937; border-radius:9px; padding:12px 14px 12px 28px; color:#fff; font-size:15px; outline:none; font-family:inherit;">
          </div>
          <div style="font-size:11.5px; color:#6B7280; margin-top:6px;">Min $${NP_MIN_USD}. For deposits under $20, prefer USDT-BSC or LTC at checkout.</div>

          <div id="dep-error" style="display:none; background:rgba(255,58,110,0.1); border:1px solid rgba(255,58,110,0.3); border-radius:8px; padding:10px 12px; color:#ff3a6e; font-size:12.5px; margin-top:14px;"></div>

          <div style="display:flex; gap:8px; margin-top:20px;">
            <button id="dep-cancel" type="button" style="flex:1; background:#1A2436; border:1px solid #1F2937; color:#fff; padding:11px; border-radius:9px; font-size:14px; font-weight:600; cursor:pointer; font-family:inherit;">Cancel</button>
            <button id="dep-auto-submit" type="button" style="flex:2; background:linear-gradient(135deg,#3A7BD5,#3AABFF); border:none; color:#fff; padding:11px; border-radius:9px; font-size:14px; font-weight:700; cursor:pointer; font-family:inherit;">Continue to payment</button>
          </div>
        `;
      } else {
        // Manual tab
        const selectedNet = NETWORKS.find(n => n.code === selectedNetwork);
        const masterAddr = settings[selectedNet.field] || '';

        const networkOpts = NETWORKS.map(n => `
          <option value="${n.code}" ${n.code===selectedNetwork?'selected':''}>${escHtml(n.label)}</option>
        `).join('');

        bodyHtml = `
          <p style="font-size:12.5px; color:#9CA3AF; margin-bottom:18px;">Send USDT to our wallet, then submit your wallet address &amp; amount. Admin reviews &amp; approves.</p>

          <label style="display:block; font-size:12px; color:#9CA3AF; text-transform:uppercase; letter-spacing:0.04em; font-weight:600; margin-bottom:6px;">Currency</label>
          <div style="background:#0a0f1c; border:1px solid #1F2937; border-radius:9px; padding:12px 14px; display:flex; align-items:center; gap:10px; margin-bottom:14px;">
            <span style="width:24px; height:24px; border-radius:50%; background:#26A17B; display:flex; align-items:center; justify-content:center; color:white; font-weight:700; font-size:11px;">T</span>
            <span style="color:#fff; font-weight:600; font-size:13.5px;">USDT</span>
            <span style="color:#6B7280; font-size:12px; margin-left:auto;">Tether USD</span>
          </div>

          <label style="display:block; font-size:12px; color:#9CA3AF; text-transform:uppercase; letter-spacing:0.04em; font-weight:600; margin-bottom:6px;">Network</label>
          <select id="dep-man-network" style="width:100%; box-sizing:border-box; background:#0a0f1c; border:1px solid #1F2937; border-radius:9px; padding:12px 14px; color:#fff; font-size:14px; outline:none; font-family:inherit; margin-bottom:14px;">
            ${networkOpts}
          </select>

          <label style="display:block; font-size:12px; color:#9CA3AF; text-transform:uppercase; letter-spacing:0.04em; font-weight:600; margin-bottom:6px;">Our deposit address</label>
          ${masterAddr ? `
            <div style="background:#0a0f1c; border:1px solid #1F2937; border-radius:9px; padding:10px 12px; display:flex; align-items:center; gap:8px; margin-bottom:14px;">
              <span id="dep-man-addr" style="flex:1; color:#fff; font-size:12px; font-family:monospace; word-break:break-all; line-height:1.5;">${escHtml(masterAddr)}</span>
              <button id="dep-man-copy" type="button" style="background:#1A2436; border:1px solid #1F2937; color:#3AABFF; padding:6px 10px; border-radius:6px; font-size:11px; cursor:pointer; font-family:inherit; flex-shrink:0;">Copy</button>
            </div>
          ` : `
            <div style="background:rgba(255,58,110,0.1); border:1px solid rgba(255,58,110,0.3); border-radius:8px; padding:10px 12px; color:#ff3a6e; font-size:12px; margin-bottom:14px;">
              No deposit address configured for ${escHtml(selectedNet.label)}. Contact admin.
            </div>
          `}

          <label style="display:block; font-size:12px; color:#9CA3AF; text-transform:uppercase; letter-spacing:0.04em; font-weight:600; margin-bottom:6px;">Your wallet address (sender) <span style="color:#ff3a6e;">*</span></label>
          <input id="dep-man-sender" type="text" placeholder="${selectedNetwork==='TRX'?'T...':selectedNetwork==='SOL'?'...':'0x...'}" style="width:100%; box-sizing:border-box; background:#0a0f1c; border:1px solid #1F2937; border-radius:9px; padding:11px 14px; color:#fff; font-size:13px; outline:none; font-family:monospace; margin-bottom:6px;">
          <div style="font-size:11.5px; color:#6B7280; margin-bottom:14px;">The wallet you'll send USDT from. This wallet will be linked to your account permanently.</div>

          <label style="display:block; font-size:12px; color:#9CA3AF; text-transform:uppercase; letter-spacing:0.04em; font-weight:600; margin-bottom:6px;">Amount sent (USDT) <span style="color:#ff3a6e;">*</span></label>
          <div style="position:relative;">
            <input id="dep-man-amount" type="number" min="${MAN_MIN_USD}" max="${MAN_MAX_USD}" step="0.01" placeholder="10.00" style="width:100%; box-sizing:border-box; background:#0a0f1c; border:1px solid #1F2937; border-radius:9px; padding:12px 14px; color:#fff; font-size:15px; outline:none; font-family:inherit;">
          </div>
          <div style="font-size:11.5px; color:#6B7280; margin-top:6px;">Min $${MAN_MIN_USD}. Pending admin review (typically within 24h).</div>

          <div id="dep-error" style="display:none; background:rgba(255,58,110,0.1); border:1px solid rgba(255,58,110,0.3); border-radius:8px; padding:10px 12px; color:#ff3a6e; font-size:12.5px; margin-top:14px;"></div>

          <div style="display:flex; gap:8px; margin-top:20px;">
            <button id="dep-cancel" type="button" style="flex:1; background:#1A2436; border:1px solid #1F2937; color:#fff; padding:11px; border-radius:9px; font-size:14px; font-weight:600; cursor:pointer; font-family:inherit;">Cancel</button>
            <button id="dep-man-submit" type="button" style="flex:2; background:linear-gradient(135deg,#3A7BD5,#3AABFF); border:none; color:#fff; padding:11px; border-radius:9px; font-size:14px; font-weight:700; cursor:pointer; font-family:inherit;">Submit deposit request</button>
          </div>
        `;
      }

      modal.innerHTML = `
        <div style="background:#131B2D; border:1px solid #1F2937; border-radius:14px; padding:28px; width:100%; max-width:500px; box-shadow:0 24px 64px rgba(0,0,0,0.6); max-height:90vh; overflow-y:auto;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:18px;">
            <h2 style="font-size:20px; font-weight:700; color:#fff;">Deposit funds</h2>
            <button id="dep-close" type="button" style="background:transparent; border:none; color:#9CA3AF; font-size:22px; cursor:pointer; padding:4px 10px;">×</button>
          </div>
          ${tabsHtml}
          ${bodyHtml}
        </div>
      `;
      attachHandlers();
    }

    function showErr(msg) {
      const err = modal.querySelector('#dep-error');
      if (err) { err.textContent = msg; err.style.display = 'block'; }
    }
    function clearErr() {
      const err = modal.querySelector('#dep-error');
      if (err) err.style.display = 'none';
    }

    function attachHandlers() {
      modal.querySelector('#dep-close').addEventListener('click', close);
      const cancelBtn = modal.querySelector('#dep-cancel');
      if (cancelBtn) cancelBtn.addEventListener('click', close);

      // Tab switching
      modal.querySelectorAll('.dep-tab').forEach(btn => {
        btn.addEventListener('click', () => {
          activeTab = btn.dataset.tab;
          render();
        });
      });

      if (activeTab === 'auto') {
        // Coin selection
        modal.querySelectorAll('.dep-coin-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            selectedCoin = btn.dataset.coin;
            render();
          });
        });

        modal.querySelector('#dep-auto-submit').addEventListener('click', handleAutoSubmit);
      } else {
        // Manual tab
        modal.querySelector('#dep-man-network').addEventListener('change', e => {
          selectedNetwork = e.target.value;
          render();
        });

        const copyBtn = modal.querySelector('#dep-man-copy');
        if (copyBtn) {
          copyBtn.addEventListener('click', () => {
            const addr = modal.querySelector('#dep-man-addr').textContent;
            navigator.clipboard.writeText(addr).then(() => {
              copyBtn.textContent = 'Copied!';
              setTimeout(() => { copyBtn.textContent = 'Copy'; }, 1500);
            });
          });
        }

        modal.querySelector('#dep-man-submit').addEventListener('click', handleManualSubmit);
      }
    }

    async function handleAutoSubmit() {
      clearErr();
      const amount = parseFloat(modal.querySelector('#dep-auto-amount').value);
      if (isNaN(amount) || amount < NP_MIN_USD) {
        showErr(`Amount must be at least $${NP_MIN_USD}.`); return;
      }
      if (amount > NP_MAX_USD) {
        showErr(`Amount must be no more than $${NP_MAX_USD}.`); return;
      }

      const submitBtn = modal.querySelector('#dep-auto-submit');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Creating invoice...';

      try {
        const ipnUrl = `${SUPABASE_URL}/functions/v1/nowpayments-ipn`;
        const successUrl = window.location.origin + window.location.pathname + '?deposit=success';
        const cancelUrl  = window.location.origin + window.location.pathname + '?deposit=cancelled';

        const npRes = await fetch(`${NP_API_BASE}/invoice`, {
          method: 'POST',
          headers: { 'x-api-key': NP_API_KEY, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            price_amount: amount,
            price_currency: 'usd',
            ipn_callback_url: ipnUrl,
            success_url: successUrl,
            cancel_url: cancelUrl,
            order_id: `nx-deposit-${user.id.slice(0,8)}-${Date.now()}`,
            order_description: `Nexus.Market deposit — ${selectedCoin} ${amount} USD`
          })
        });

        if (!npRes.ok) throw new Error(`NOWPayments: ${await npRes.text()}`);
        const npData = await npRes.json();
        if (!npData.id || !npData.invoice_url) throw new Error('Invalid response from NOWPayments');

        submitBtn.textContent = 'Saving...';
        const { error: rpcErr } = await window.sb.rpc('create_deposit_invoice', {
          p_amount_usd: amount,
          p_target_coin: selectedCoin,
          p_np_invoice_id: String(npData.id),
          p_np_pay_url: npData.invoice_url
        });
        if (rpcErr) throw rpcErr;

        submitBtn.textContent = 'Redirecting...';
        window.location.href = npData.invoice_url;
      } catch (e) {
        console.error('[deposit] auto failed', e);
        showErr('Failed: ' + (e.message || e));
        submitBtn.disabled = false;
        submitBtn.textContent = 'Continue to payment';
      }
    }

    async function handleManualSubmit() {
      clearErr();
      const sender = modal.querySelector('#dep-man-sender').value.trim();
      const amount = parseFloat(modal.querySelector('#dep-man-amount').value);

      if (sender.length < 10) { showErr('Please enter a valid wallet address.'); return; }
      if (isNaN(amount) || amount < MAN_MIN_USD) {
        showErr(`Amount must be at least $${MAN_MIN_USD}.`); return;
      }
      if (amount > MAN_MAX_USD) {
        showErr(`Amount must be no more than $${MAN_MAX_USD}.`); return;
      }

      // Basic format validation per network
      let valid = true;
      if (selectedNetwork === 'TRX' && !sender.startsWith('T')) valid = false;
      if ((selectedNetwork === 'ETH' || selectedNetwork === 'BSC') && !sender.startsWith('0x')) valid = false;
      if (!valid) {
        showErr(`Wallet address format doesn't match ${selectedNetwork} network.`); return;
      }

      const submitBtn = modal.querySelector('#dep-man-submit');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';

      try {
        const { error } = await window.sb.rpc('submit_manual_deposit', {
          p_network: selectedNetwork,
          p_sender_address: sender,
          p_amount: amount,
          p_target_coin: 'USDT'
        });
        if (error) throw error;

        close();
        alert('Deposit request submitted. Admin will review and approve once your transfer arrives.');
      } catch (e) {
        console.error('[deposit] manual failed', e);
        showErr('Failed: ' + (e.message || e));
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit deposit request';
      }
    }

    modal.addEventListener('click', e => { if (e.target === modal) close(); });
    render();
  };

  // Auto-show success message after returning from NOWPayments
  document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('deposit') === 'success') {
      setTimeout(() => {
        alert('Payment received! Your balance will be credited within a few minutes once the network confirms the transaction.');
      }, 500);
      const url = new URL(window.location);
      url.searchParams.delete('deposit');
      window.history.replaceState({}, '', url.toString());
    } else if (params.get('deposit') === 'cancelled') {
      const url = new URL(window.location);
      url.searchParams.delete('deposit');
      window.history.replaceState({}, '', url.toString());
    }
  });
})();


/* ============================================================
   GLOBAL WALLET MODAL (Overview / Deposit / Withdraw)
   ------------------------------------------------------------
   Usage: window.openWalletModal()
   Replaces the old wallet dropdown + bottom modal pane.
   ============================================================ */
(function() {
  const NETWORKS = [
    { code: 'TRX', label: 'Tron (TRC20)' },
    { code: 'BSC', label: 'BNB Smart Chain (BEP20)' },
    { code: 'ETH', label: 'Ethereum (ERC20)' },
    { code: 'SOL', label: 'Solana' }
  ];

  function escHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }

  async function fetchBalances() {
    if (!window.sb) return { USDT: 0, USDC: 0 };
    const { data: { user } } = await window.sb.auth.getUser();
    if (!user) return { USDT: 0, USDC: 0 };
    const { data, error } = await window.sb.from('wallets')
      .select('coin, balance').eq('user_id', user.id);
    if (error) { console.warn('[wallet] balance err', error); return { USDT: 0, USDC: 0 }; }
    const out = { USDT: 0, USDC: 0 };
    (data || []).forEach(r => { out[r.coin] = parseFloat(r.balance || 0); });
    return out;
  }

  async function fetchDepositSettings() {
    if (!window.sb) return {};
    const { data } = await window.sb.from('site_settings')
      .select('deposit_wallet_eth, deposit_wallet_bsc, deposit_wallet_trx, deposit_wallet_sol')
      .eq('id', 1).maybeSingle();
    return data || {};
  }

  window.openWalletModal = async function(initialTab) {
    console.log('[wallet] openWalletModal called, initialTab=', initialTab);
    if (!window.sb) { alert('Database not connected.'); return; }
    const { data: { user } } = await window.sb.auth.getUser();
    if (!user) { alert('Please log in.'); return; }
    console.log('[wallet] user OK, fetching balances...');

    const balances = await fetchBalances();
    const settings = await fetchDepositSettings();
    console.log('[wallet] data ready, opening modal');

    const existing = document.getElementById('nx-wallet-modal-v2');
    if (existing) existing.remove();

    let activeTab = initialTab || 'overview'; // overview | deposit | withdraw

    // Deposit sub-state
    let depMode = 'auto';                    // auto | manual
    let depCoin = 'USDT';
    let depNetwork = 'TRX';

    // Withdraw sub-state
    let wdCoin = 'USDT';
    let wdNetwork = 'TRX';

    const modal = document.createElement('div');
    modal.id = 'nx-wallet-modal-v2';
    modal.style.cssText = 'position:fixed; inset:0; z-index:10000; background:rgba(0,0,0,0.75); backdrop-filter:blur(8px); display:flex; align-items:center; justify-content:center; padding:20px; overflow-y:auto;';
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    function close() {
      modal.remove();
      document.body.style.overflow = '';
    }

    function showErr(msg) {
      const e = modal.querySelector('#wm-error');
      if (e) { e.textContent = msg; e.style.display = 'block'; }
    }
    function clearErr() {
      const e = modal.querySelector('#wm-error');
      if (e) e.style.display = 'none';
    }

    function tabBtn(tab, label) {
      const isActive = activeTab === tab;
      return `<button type="button" data-tab="${tab}" class="wm-tab ${isActive?'wm-tab-active':''}" style="flex:1; background:${isActive?'linear-gradient(135deg,#3A7BD5,#3AABFF)':'transparent'}; border:none; color:${isActive?'#fff':'#9CA3AF'}; padding:10px; border-radius:7px; font-size:13.5px; font-weight:600; cursor:pointer; font-family:inherit;">${label}</button>`;
    }

    function render() {
      let body = '';
      if (activeTab === 'overview') body = renderOverview();
      else if (activeTab === 'deposit') body = renderDeposit();
      else if (activeTab === 'withdraw') body = renderWithdraw();
      else if (activeTab === 'history') body = renderHistory();

      modal.innerHTML = `
        <div style="background:#131B2D; border:1px solid #1F2937; border-radius:14px; padding:24px; width:100%; max-width:480px; box-shadow:0 24px 64px rgba(0,0,0,0.6); max-height:90vh; overflow-y:auto;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <div style="display:flex; align-items:center; gap:8px;">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3AABFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
              <h2 style="font-size:18px; font-weight:700; color:#fff;">Wallet</h2>
            </div>
            <button id="wm-close" type="button" style="background:transparent; border:none; color:#9CA3AF; font-size:22px; cursor:pointer; padding:4px 10px;">×</button>
          </div>

          <div style="display:flex; gap:6px; background:#0a0f1c; border:1px solid #1F2937; border-radius:10px; padding:4px; margin-bottom:18px;">
            ${tabBtn('overview','Overview')}
            ${tabBtn('deposit','Deposit')}
            ${tabBtn('withdraw','Withdraw')}
            ${tabBtn('history','History')}
          </div>

          ${body}

          <div id="wm-error" style="display:none; background:rgba(255,58,110,0.1); border:1px solid rgba(255,58,110,0.3); border-radius:8px; padding:10px 12px; color:#ff3a6e; font-size:12.5px; margin-top:14px;"></div>
        </div>
      `;
      attach();
    }

    function renderOverview() {
      const total = (balances.USDT + balances.USDC).toFixed(2);
      return `
        <div style="font-size:11.5px; color:#9CA3AF; text-transform:uppercase; letter-spacing:0.04em; font-weight:600; margin-bottom:6px;">Balance</div>
        <div style="font-size:28px; font-weight:800; color:#fff; margin-bottom:18px;">$${total} <span style="font-size:13px; font-weight:600; color:#9CA3AF;">USD</span></div>

        <div style="background:#0a0f1c; border:1px solid #1F2937; border-radius:10px; overflow:hidden;">
          <div style="display:flex; justify-content:space-between; padding:10px 14px; background:rgba(58,171,255,0.05); border-bottom:1px solid #1F2937; font-size:11px; color:#3AABFF; text-transform:uppercase; letter-spacing:0.04em; font-weight:600;">
            <span>Currency</span><span>Value</span>
          </div>
          <div style="padding:14px;">
            <div style="display:flex; align-items:center; gap:12px; padding:10px 0; border-bottom:1px solid #1F2937;">
              <span style="width:32px; height:32px; border-radius:50%; background:#26A17B; display:flex; align-items:center; justify-content:center; color:white; font-weight:700; font-size:14px;">T</span>
              <div style="flex:1;">
                <div style="color:#fff; font-weight:600; font-size:14px;">USDT</div>
                <div style="color:#9CA3AF; font-size:11.5px;">USD Tether</div>
              </div>
              <div style="text-align:right;">
                <div style="color:#fff; font-weight:600; font-size:14px;">${balances.USDT.toFixed(8)}</div>
                <div style="color:#9CA3AF; font-size:11.5px;">$${balances.USDT.toFixed(2)} USD</div>
              </div>
            </div>
            <div style="display:flex; align-items:center; gap:12px; padding:10px 0;">
              <span style="width:32px; height:32px; border-radius:50%; background:#2775CA; display:flex; align-items:center; justify-content:center; color:white; font-weight:700; font-size:14px;">C</span>
              <div style="flex:1;">
                <div style="color:#fff; font-weight:600; font-size:14px;">USDC</div>
                <div style="color:#9CA3AF; font-size:11.5px;">USD Coin</div>
              </div>
              <div style="text-align:right;">
                <div style="color:#fff; font-weight:600; font-size:14px;">${balances.USDC.toFixed(8)}</div>
                <div style="color:#9CA3AF; font-size:11.5px;">$${balances.USDC.toFixed(2)} USD</div>
              </div>
            </div>
          </div>
        </div>

        <div style="display:flex; gap:8px; margin-top:18px;">
          <button id="wm-go-deposit" type="button" style="flex:1; background:linear-gradient(135deg,#3A7BD5,#3AABFF); border:none; color:#fff; padding:11px; border-radius:9px; font-size:14px; font-weight:700; cursor:pointer; font-family:inherit;">Deposit</button>
          <button id="wm-go-withdraw" type="button" style="flex:1; background:#1A2436; border:1px solid #1F2937; color:#fff; padding:11px; border-radius:9px; font-size:14px; font-weight:600; cursor:pointer; font-family:inherit;">Withdraw</button>
        </div>
      `;
    }

    function renderDeposit() {
      const modeBtn = (mode, label) => {
        const isOn = depMode === mode;
        return `<button type="button" data-depmode="${mode}" class="wm-depmode" style="flex:1; background:${isOn?'rgba(58,171,255,0.15)':'#0a0f1c'}; border:1.5px solid ${isOn?'#3AABFF':'#1F2937'}; color:${isOn?'#3AABFF':'#9CA3AF'}; padding:9px; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer; font-family:inherit;">${label}</button>`;
      };

      let inner = '';
      if (depMode === 'auto') {
        const coinBtn = (c, color, letter) => {
          const isOn = depCoin === c;
          return `<button type="button" data-depcoin="${c}" class="wm-depcoin" style="background:#0a0f1c; border:1.5px solid ${isOn?'#3AABFF':'#1F2937'}; border-radius:10px; padding:12px; cursor:pointer; font-family:inherit; display:flex; align-items:center; gap:10px;">
            <span style="width:28px; height:28px; border-radius:50%; background:${color}; display:flex; align-items:center; justify-content:center; color:white; font-weight:700; font-size:13px;">${letter}</span>
            <span style="color:#fff; font-weight:600; font-size:14px;">${c}</span>
          </button>`;
        };
        inner = `
          <p style="font-size:12.5px; color:#9CA3AF; margin-bottom:14px;">Pay any crypto via NOWPayments. Auto-credited once confirmed.</p>
          <label style="display:block; font-size:12px; color:#9CA3AF; text-transform:uppercase; letter-spacing:0.04em; font-weight:600; margin-bottom:8px;">Receive as</label>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:14px;">
            ${coinBtn('USDT', '#26A17B', 'T')}
            ${coinBtn('USDC', '#2775CA', 'C')}
          </div>
          <label style="display:block; font-size:12px; color:#9CA3AF; text-transform:uppercase; letter-spacing:0.04em; font-weight:600; margin-bottom:6px;">Amount (USD) <span style="color:#ff3a6e;">*</span></label>
          <div style="position:relative;">
            <span style="position:absolute; left:14px; top:50%; transform:translateY(-50%); color:#6B7280; font-size:14px; font-weight:600;">$</span>
            <input id="wm-auto-amount" type="number" min="15" max="100000" step="0.01" placeholder="100.00" style="width:100%; box-sizing:border-box; background:#0a0f1c; border:1px solid #1F2937; border-radius:9px; padding:12px 14px 12px 28px; color:#fff; font-size:15px; outline:none; font-family:inherit;">
          </div>
          <div style="font-size:11.5px; color:#6B7280; margin-top:6px;">Min $15. For amounts under $20, prefer USDT-BSC at checkout.</div>
          <button id="wm-auto-submit" type="button" style="width:100%; margin-top:16px; background:linear-gradient(135deg,#3A7BD5,#3AABFF); border:none; color:#fff; padding:12px; border-radius:9px; font-size:14px; font-weight:700; cursor:pointer; font-family:inherit;">Continue to payment</button>
        `;
      } else {
        const fieldMap = { ETH: 'deposit_wallet_eth', BSC: 'deposit_wallet_bsc', TRX: 'deposit_wallet_trx', SOL: 'deposit_wallet_sol' };
        const masterAddr = settings[fieldMap[depNetwork]] || '';
        const netOpts = NETWORKS.map(n => `<option value="${n.code}" ${n.code===depNetwork?'selected':''}>${escHtml(n.label)}</option>`).join('');
        inner = `
          <p style="font-size:12.5px; color:#9CA3AF; margin-bottom:14px;">Send USDT to our wallet, then submit your wallet address &amp; amount. Admin reviews &amp; approves.</p>

          <label style="display:block; font-size:12px; color:#9CA3AF; text-transform:uppercase; letter-spacing:0.04em; font-weight:600; margin-bottom:6px;">Network</label>
          <select id="wm-man-network" style="width:100%; box-sizing:border-box; background:#0a0f1c; border:1px solid #1F2937; border-radius:9px; padding:11px 14px; color:#fff; font-size:13.5px; outline:none; font-family:inherit; margin-bottom:12px;">${netOpts}</select>

          <label style="display:block; font-size:12px; color:#9CA3AF; text-transform:uppercase; letter-spacing:0.04em; font-weight:600; margin-bottom:6px;">Our deposit address</label>
          ${masterAddr ? `
            <div style="background:#0a0f1c; border:1px solid #1F2937; border-radius:9px; padding:10px 12px; display:flex; align-items:center; gap:8px; margin-bottom:12px;">
              <span id="wm-man-addr" style="flex:1; color:#fff; font-size:11.5px; font-family:monospace; word-break:break-all; line-height:1.5;">${escHtml(masterAddr)}</span>
              <button id="wm-man-copy" type="button" style="background:#1A2436; border:1px solid #1F2937; color:#3AABFF; padding:6px 10px; border-radius:6px; font-size:11px; cursor:pointer; font-family:inherit; flex-shrink:0;">Copy</button>
            </div>
          ` : `
            <div style="background:rgba(255,58,110,0.1); border:1px solid rgba(255,58,110,0.3); border-radius:8px; padding:10px 12px; color:#ff3a6e; font-size:12px; margin-bottom:12px;">
              No deposit address configured for ${escHtml(depNetwork)}. Contact admin.
            </div>
          `}

          <label style="display:block; font-size:12px; color:#9CA3AF; text-transform:uppercase; letter-spacing:0.04em; font-weight:600; margin-bottom:6px;">Your wallet (sender) <span style="color:#ff3a6e;">*</span></label>
          <input id="wm-man-sender" type="text" placeholder="${depNetwork==='TRX'?'T...':depNetwork==='SOL'?'...':'0x...'}" style="width:100%; box-sizing:border-box; background:#0a0f1c; border:1px solid #1F2937; border-radius:9px; padding:11px 14px; color:#fff; font-size:12.5px; outline:none; font-family:monospace; margin-bottom:5px;">
          <div style="font-size:11px; color:#6B7280; margin-bottom:12px;">This wallet will be linked permanently to your account.</div>

          <label style="display:block; font-size:12px; color:#9CA3AF; text-transform:uppercase; letter-spacing:0.04em; font-weight:600; margin-bottom:6px;">Amount sent (USDT) <span style="color:#ff3a6e;">*</span></label>
          <input id="wm-man-amount" type="number" min="0.1" max="100000" step="0.01" placeholder="10.00" style="width:100%; box-sizing:border-box; background:#0a0f1c; border:1px solid #1F2937; border-radius:9px; padding:11px 14px; color:#fff; font-size:14px; outline:none; font-family:inherit;">
          <div style="font-size:11px; color:#6B7280; margin-top:5px;">Pending admin review (~24h).</div>

          <button id="wm-man-submit" type="button" style="width:100%; margin-top:16px; background:linear-gradient(135deg,#3A7BD5,#3AABFF); border:none; color:#fff; padding:12px; border-radius:9px; font-size:14px; font-weight:700; cursor:pointer; font-family:inherit;">Submit deposit request</button>
        `;
      }

      return `
        <div style="display:flex; gap:6px; margin-bottom:14px;">
          ${modeBtn('auto','Auto (NOWPayments)')}
          ${modeBtn('manual','Manual')}
        </div>
        ${inner}
      `;
    }

    function renderWithdraw() {
      const coinBtn = (c, color, letter) => {
        const isOn = wdCoin === c;
        return `<button type="button" data-wdcoin="${c}" class="wm-wdcoin" style="background:#0a0f1c; border:1.5px solid ${isOn?'#3AABFF':'#1F2937'}; border-radius:10px; padding:12px; cursor:pointer; font-family:inherit; display:flex; align-items:center; gap:10px;">
          <span style="width:28px; height:28px; border-radius:50%; background:${color}; display:flex; align-items:center; justify-content:center; color:white; font-weight:700; font-size:13px;">${letter}</span>
          <div style="flex:1; text-align:left;">
            <div style="color:#fff; font-weight:600; font-size:14px;">${c}</div>
            <div style="color:#9CA3AF; font-size:11px;">Bal: ${balances[c].toFixed(2)}</div>
          </div>
        </button>`;
      };
      const netOpts = NETWORKS.map(n => `<option value="${n.code}" ${n.code===wdNetwork?'selected':''}>${escHtml(n.label)}</option>`).join('');

      return `
        <p style="font-size:12.5px; color:#9CA3AF; margin-bottom:14px;">Submit a withdrawal request. Admin will process and send funds to your wallet manually.</p>

        <label style="display:block; font-size:12px; color:#9CA3AF; text-transform:uppercase; letter-spacing:0.04em; font-weight:600; margin-bottom:8px;">Coin</label>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:14px;">
          ${coinBtn('USDT', '#26A17B', 'T')}
          ${coinBtn('USDC', '#2775CA', 'C')}
        </div>

        <label style="display:block; font-size:12px; color:#9CA3AF; text-transform:uppercase; letter-spacing:0.04em; font-weight:600; margin-bottom:6px;">Network</label>
        <select id="wm-wd-network" style="width:100%; box-sizing:border-box; background:#0a0f1c; border:1px solid #1F2937; border-radius:9px; padding:11px 14px; color:#fff; font-size:13.5px; outline:none; font-family:inherit; margin-bottom:12px;">${netOpts}</select>

        <label style="display:block; font-size:12px; color:#9CA3AF; text-transform:uppercase; letter-spacing:0.04em; font-weight:600; margin-bottom:6px;">Recipient address <span style="color:#ff3a6e;">*</span></label>
        <input id="wm-wd-address" type="text" placeholder="${wdNetwork==='TRX'?'T...':wdNetwork==='SOL'?'...':'0x...'}" style="width:100%; box-sizing:border-box; background:#0a0f1c; border:1px solid #1F2937; border-radius:9px; padding:11px 14px; color:#fff; font-size:12.5px; outline:none; font-family:monospace; margin-bottom:12px;">

        <label style="display:block; font-size:12px; color:#9CA3AF; text-transform:uppercase; letter-spacing:0.04em; font-weight:600; margin-bottom:6px;">Amount (${wdCoin}) <span style="color:#ff3a6e;">*</span></label>
        <div style="position:relative;">
          <input id="wm-wd-amount" type="number" min="0.01" max="${balances[wdCoin]}" step="0.01" placeholder="0.00" style="width:100%; box-sizing:border-box; background:#0a0f1c; border:1px solid #1F2937; border-radius:9px; padding:11px 90px 11px 14px; color:#fff; font-size:14px; outline:none; font-family:inherit;">
          <button id="wm-wd-max" type="button" style="position:absolute; right:8px; top:50%; transform:translateY(-50%); background:#1A2436; border:1px solid #1F2937; color:#3AABFF; padding:5px 10px; border-radius:6px; font-size:11px; cursor:pointer; font-family:inherit; font-weight:600;">MAX</button>
        </div>
        <div style="font-size:11.5px; color:#6B7280; margin-top:5px;">Available: ${balances[wdCoin].toFixed(8)} ${wdCoin}</div>

        <button id="wm-wd-submit" type="button" style="width:100%; margin-top:16px; background:linear-gradient(135deg,#3A7BD5,#3AABFF); border:none; color:#fff; padding:12px; border-radius:9px; font-size:14px; font-weight:700; cursor:pointer; font-family:inherit;">Submit withdraw request</button>
      `;
    }

    function renderHistory() {
      // Initial empty container — async fill below
      return `
        <div style="display:flex; gap:6px; margin-bottom:14px;">
          <button type="button" data-histfilter="all" class="wm-histfilter wm-histfilter-active" style="flex:1; background:rgba(58,171,255,0.15); border:1.5px solid #3AABFF; color:#3AABFF; padding:8px; border-radius:8px; font-size:12.5px; font-weight:600; cursor:pointer; font-family:inherit;">All</button>
          <button type="button" data-histfilter="deposit" class="wm-histfilter" style="flex:1; background:#0a0f1c; border:1.5px solid #1F2937; color:#9CA3AF; padding:8px; border-radius:8px; font-size:12.5px; font-weight:600; cursor:pointer; font-family:inherit;">Deposits</button>
          <button type="button" data-histfilter="withdraw" class="wm-histfilter" style="flex:1; background:#0a0f1c; border:1.5px solid #1F2937; color:#9CA3AF; padding:8px; border-radius:8px; font-size:12.5px; font-weight:600; cursor:pointer; font-family:inherit;">Withdraws</button>
        </div>
        <div id="wm-hist-list" style="background:#0a0f1c; border:1px solid #1F2937; border-radius:10px; max-height:380px; overflow-y:auto;">
          <div style="padding:32px; text-align:center; color:#6B7280; font-size:13px;">Loading...</div>
        </div>
      `;
    }

    let HIST_FILTER = 'all';
    let HIST_DATA = { deposits: [], withdraws: [] };

    async function loadHistory() {
      const listEl = modal.querySelector('#wm-hist-list');
      if (!listEl) return;
      try {
        // Manual deposits
        const depPromise = window.sb.from('manual_deposit_requests')
          .select('id, network, sender_address, claimed_amount, approved_amount, target_coin, status, admin_note, resolved_at, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        // NOWPayments deposits (auto)
        const autoDepPromise = window.sb.from('deposit_invoices')
          .select('id, amount_usd, target_coin, status, credited_at, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        // Withdraws
        const wdPromise = window.sb.from('withdraw_requests')
          .select('id, coin, network, recipient_address, amount, status, admin_note, tx_hash, resolved_at, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        const [depRes, autoDepRes, wdRes] = await Promise.all([depPromise, autoDepPromise, wdPromise]);

        const manualDeps = (depRes.data || []).map(d => ({
          kind: 'deposit',
          source: 'manual',
          id: d.id,
          coin: d.target_coin,
          network: d.network,
          amount: d.approved_amount != null ? d.approved_amount : d.claimed_amount,
          status: d.status === 'approved' ? 'completed' : d.status,
          note: d.admin_note,
          created_at: d.created_at,
          extra: 'From: ' + d.sender_address.slice(0, 8) + '...' + d.sender_address.slice(-6)
        }));

        const autoDeps = (autoDepRes.data || []).map(d => ({
          kind: 'deposit',
          source: 'nowpayments',
          id: d.id,
          coin: d.target_coin,
          network: 'NOWPayments',
          amount: d.amount_usd,
          status: d.status === 'finished' ? 'completed' : (d.status === 'failed' || d.status === 'expired' ? 'rejected' : 'pending'),
          note: null,
          created_at: d.created_at,
          extra: 'NOWPayments invoice'
        }));

        const wds = (wdRes.data || []).map(w => ({
          kind: 'withdraw',
          source: 'manual',
          id: w.id,
          coin: w.coin,
          network: w.network,
          amount: w.amount,
          status: w.status === 'approved' ? 'completed' : w.status,
          note: w.admin_note,
          created_at: w.created_at,
          extra: 'To: ' + w.recipient_address.slice(0, 8) + '...' + w.recipient_address.slice(-6),
          tx_hash: w.tx_hash
        }));

        HIST_DATA = { deposits: [...manualDeps, ...autoDeps], withdraws: wds };
        paintHistory();
      } catch (e) {
        console.error('[history]', e);
        listEl.innerHTML = `<div style="padding:32px; text-align:center; color:#ff3a6e; font-size:13px;">Failed to load: ${e.message || e}</div>`;
      }
    }

    function paintHistory() {
      const listEl = modal.querySelector('#wm-hist-list');
      if (!listEl) return;

      let items = [];
      if (HIST_FILTER === 'all') items = [...HIST_DATA.deposits, ...HIST_DATA.withdraws];
      else if (HIST_FILTER === 'deposit') items = HIST_DATA.deposits;
      else if (HIST_FILTER === 'withdraw') items = HIST_DATA.withdraws;

      items.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      if (items.length === 0) {
        listEl.innerHTML = `<div style="padding:32px; text-align:center; color:#6B7280; font-size:13px;">No ${HIST_FILTER === 'all' ? '' : HIST_FILTER + ' '}transactions yet.</div>`;
        return;
      }

      const STATUS_BADGE = {
        pending:   '<span style="background:rgba(245,158,11,0.18); color:#F59E0B; padding:2px 7px; border-radius:999px; font-size:10.5px; font-weight:700;">PENDING</span>',
        completed: '<span style="background:rgba(16,185,129,0.15); color:#10B981; padding:2px 7px; border-radius:999px; font-size:10.5px; font-weight:700;">COMPLETED</span>',
        rejected:  '<span style="background:rgba(255,58,110,0.15); color:#ff3a6e; padding:2px 7px; border-radius:999px; font-size:10.5px; font-weight:700;">REJECTED</span>'
      };

      listEl.innerHTML = items.map(it => {
        const date = new Date(it.created_at);
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ', ' +
                        date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
        const isDep = it.kind === 'deposit';
        const sign = isDep ? '+' : '−';
        const color = isDep ? '#10B981' : '#F59E0B';
        const iconBg = isDep ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)';
        const iconColor = isDep ? '#10B981' : '#F59E0B';
        const arrow = isDep
          ? '<polyline points="19 12 12 19 5 12"/><line x1="12" x2="12" y1="5" y2="19"/>'  // down arrow (incoming)
          : '<polyline points="5 12 12 5 19 12"/><line x1="12" x2="12" y1="19" y2="5"/>';   // up arrow (outgoing)

        return `
          <div style="display:flex; align-items:center; gap:12px; padding:12px 14px; border-bottom:1px solid #1F2937;">
            <div style="width:34px; height:34px; border-radius:50%; background:${iconBg}; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${arrow}</svg>
            </div>
            <div style="flex:1; min-width:0;">
              <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:2px;">
                <span style="color:#fff; font-weight:600; font-size:13.5px;">${isDep ? 'Deposit' : 'Withdraw'} <span style="color:#9CA3AF; font-weight:500; font-size:11.5px;">· ${escHtml(it.network)}</span></span>
                <span style="color:${color}; font-weight:700; font-size:13.5px; flex-shrink:0;">${sign}${parseFloat(it.amount).toFixed(2)} ${escHtml(it.coin)}</span>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
                <span style="color:#6B7280; font-size:11.5px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${dateStr} · ${escHtml(it.extra)}</span>
                ${STATUS_BADGE[it.status] || ''}
              </div>
              ${it.note ? `<div style="color:#9CA3AF; font-size:11px; margin-top:4px; font-style:italic;">${escHtml(it.note)}</div>` : ''}
            </div>
          </div>
        `;
      }).join('');
    }

    function attach() {
      modal.querySelector('#wm-close').addEventListener('click', close);
      modal.querySelectorAll('.wm-tab').forEach(b => b.addEventListener('click', () => { activeTab = b.dataset.tab; render(); }));

      if (activeTab === 'overview') {
        const dep = modal.querySelector('#wm-go-deposit');
        const wd = modal.querySelector('#wm-go-withdraw');
        if (dep) dep.addEventListener('click', () => { activeTab = 'deposit'; render(); });
        if (wd) wd.addEventListener('click', () => { activeTab = 'withdraw'; render(); });
      }

      if (activeTab === 'deposit') {
        modal.querySelectorAll('.wm-depmode').forEach(b => b.addEventListener('click', () => { depMode = b.dataset.depmode; render(); }));

        if (depMode === 'auto') {
          modal.querySelectorAll('.wm-depcoin').forEach(b => b.addEventListener('click', () => { depCoin = b.dataset.depcoin; render(); }));
          const sub = modal.querySelector('#wm-auto-submit');
          if (sub) sub.addEventListener('click', handleAutoDeposit);
        } else {
          const sel = modal.querySelector('#wm-man-network');
          if (sel) sel.addEventListener('change', e => { depNetwork = e.target.value; render(); });
          const cp = modal.querySelector('#wm-man-copy');
          if (cp) cp.addEventListener('click', () => {
            const a = modal.querySelector('#wm-man-addr').textContent;
            navigator.clipboard.writeText(a).then(() => {
              cp.textContent = 'Copied!';
              setTimeout(() => cp.textContent = 'Copy', 1500);
            });
          });
          const sub = modal.querySelector('#wm-man-submit');
          if (sub) sub.addEventListener('click', handleManualDeposit);
        }
      }

      if (activeTab === 'withdraw') {
        modal.querySelectorAll('.wm-wdcoin').forEach(b => b.addEventListener('click', () => { wdCoin = b.dataset.wdcoin; render(); }));
        const sel = modal.querySelector('#wm-wd-network');
        if (sel) sel.addEventListener('change', e => { wdNetwork = e.target.value; render(); });
        const max = modal.querySelector('#wm-wd-max');
        if (max) max.addEventListener('click', () => {
          modal.querySelector('#wm-wd-amount').value = balances[wdCoin].toFixed(8);
        });
        const sub = modal.querySelector('#wm-wd-submit');
        if (sub) sub.addEventListener('click', handleWithdraw);
      }

      if (activeTab === 'history') {
        loadHistory();
        modal.querySelectorAll('.wm-histfilter').forEach(b => {
          b.addEventListener('click', () => {
            HIST_FILTER = b.dataset.histfilter;
            modal.querySelectorAll('.wm-histfilter').forEach(x => {
              x.classList.remove('wm-histfilter-active');
              x.style.background = '#0a0f1c';
              x.style.borderColor = '#1F2937';
              x.style.color = '#9CA3AF';
            });
            b.classList.add('wm-histfilter-active');
            b.style.background = 'rgba(58,171,255,0.15)';
            b.style.borderColor = '#3AABFF';
            b.style.color = '#3AABFF';
            paintHistory();
          });
        });
      }
    }

    async function handleAutoDeposit() {
      clearErr();
      const amount = parseFloat(modal.querySelector('#wm-auto-amount').value);
      if (isNaN(amount) || amount < 15) { showErr('Min $15.'); return; }
      if (amount > 100000) { showErr('Max $100000.'); return; }
      const btn = modal.querySelector('#wm-auto-submit');
      btn.disabled = true; btn.textContent = 'Creating invoice...';
      try {
        const NP_API_KEY = 'AJSE7BXG7ND91KX4M24Y4KCEC3QDFJ49';
        const ipnUrl = `${SUPABASE_URL}/functions/v1/nowpayments-ipn`;
        const successUrl = window.location.origin + window.location.pathname + '?deposit=success';
        const cancelUrl = window.location.origin + window.location.pathname + '?deposit=cancelled';
        const npRes = await fetch('https://api.nowpayments.io/v1/invoice', {
          method: 'POST',
          headers: { 'x-api-key': NP_API_KEY, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            price_amount: amount,
            price_currency: 'usd',
            ipn_callback_url: ipnUrl,
            success_url: successUrl,
            cancel_url: cancelUrl,
            order_id: `nx-deposit-${user.id.slice(0,8)}-${Date.now()}`,
            order_description: `Nexus.Market deposit — ${depCoin} ${amount} USD`
          })
        });
        if (!npRes.ok) throw new Error(await npRes.text());
        const npData = await npRes.json();
        if (!npData.id || !npData.invoice_url) throw new Error('Invalid NOWPayments response');
        const { error } = await window.sb.rpc('create_deposit_invoice', {
          p_amount_usd: amount,
          p_target_coin: depCoin,
          p_np_invoice_id: String(npData.id),
          p_np_pay_url: npData.invoice_url
        });
        if (error) throw error;
        window.location.href = npData.invoice_url;
      } catch (e) {
        console.error('[wallet] auto deposit failed', e);
        showErr('Failed: ' + (e.message || e));
        btn.disabled = false; btn.textContent = 'Continue to payment';
      }
    }

    async function handleManualDeposit() {
      clearErr();
      const sender = modal.querySelector('#wm-man-sender').value.trim();
      const amount = parseFloat(modal.querySelector('#wm-man-amount').value);
      if (sender.length < 10) { showErr('Invalid wallet address.'); return; }
      if (isNaN(amount) || amount < 0.1) { showErr('Min $0.1.'); return; }
      if (depNetwork === 'TRX' && !sender.startsWith('T')) { showErr(`Wallet doesn't match ${depNetwork}.`); return; }
      if ((depNetwork === 'ETH' || depNetwork === 'BSC') && !sender.startsWith('0x')) { showErr(`Wallet doesn't match ${depNetwork}.`); return; }
      const btn = modal.querySelector('#wm-man-submit');
      btn.disabled = true; btn.textContent = 'Submitting...';
      console.log('[wallet] submitting manual deposit', { network: depNetwork, sender, amount });
      try {
        const result = await window.sb.rpc('submit_manual_deposit', {
          p_network: depNetwork,
          p_sender_address: sender,
          p_amount: amount,
          p_target_coin: 'USDT'
        });
        console.log('[wallet] RPC response:', result);
        if (result && result.error) throw result.error;
        close();
      } catch (e) {
        console.error('[wallet] manual deposit failed', e);
        showErr('Failed: ' + (e.message || JSON.stringify(e)));
        btn.disabled = false; btn.textContent = 'Submit deposit request';
      }
    }

    async function handleWithdraw() {
      clearErr();
      const addr = modal.querySelector('#wm-wd-address').value.trim();
      const amount = parseFloat(modal.querySelector('#wm-wd-amount').value);
      if (addr.length < 10) { showErr('Invalid recipient address.'); return; }
      if (isNaN(amount) || amount <= 0) { showErr('Invalid amount.'); return; }
      if (amount > balances[wdCoin]) { showErr(`Insufficient ${wdCoin} balance.`); return; }
      if (wdNetwork === 'TRX' && !addr.startsWith('T')) { showErr(`Address doesn't match ${wdNetwork}.`); return; }
      if ((wdNetwork === 'ETH' || wdNetwork === 'BSC') && !addr.startsWith('0x')) { showErr(`Address doesn't match ${wdNetwork}.`); return; }
      if (!confirm(`Confirm withdrawal of ${amount} ${wdCoin} via ${wdNetwork} to:\n${addr}\n\nThis will deduct ${amount} ${wdCoin} from your balance immediately. Admin will process within 24h.`)) return;
      const btn = modal.querySelector('#wm-wd-submit');
      btn.disabled = true; btn.textContent = 'Submitting...';
      try {
        const { error } = await window.sb.rpc('submit_withdraw', {
          p_coin: wdCoin,
          p_network: wdNetwork,
          p_recipient_address: addr,
          p_amount: amount
        });
        if (error) throw error;
        close();
        if (typeof window.refreshWalletBalances === 'function') window.refreshWalletBalances();
      } catch (e) {
        console.error('[wallet] withdraw failed', e);
        showErr('Failed: ' + (e.message || e));
        btn.disabled = false; btn.textContent = 'Submit withdraw request';
      }
    }

    modal.addEventListener('click', e => { if (e.target === modal) close(); });
    render();
  };
})();
