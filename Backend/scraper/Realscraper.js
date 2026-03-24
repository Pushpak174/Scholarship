const axios = require("axios");
const cheerio = require("cheerio");
const mongoose = require("mongoose");
const { Scholarship } = require("../App/model/scholarshipmodel");

require("dotenv").config({ path: "../.env" });

// ── Helpers ────────────────────────────────────────────────────────────────

function parseAmount(raw) {
  if (!raw) return { amountValue: null, currency: null };
  const currency = raw.includes("₹") ? "INR" : raw.includes("$") ? "USD" : null;
  const cleaned = raw.replace(/[^\d]/g, "");
  return { amountValue: cleaned ? Number(cleaned) : null, currency };
}

function parseList(text) {
  if (!text) return [];
  return text.split(/[,/|]/).map((v) => v.trim()).filter(Boolean);
}

function safeDate(str) {
  if (!str) return null;
  // Handle common formats: "31 Oct 2026", "October 31, 2026", "2026-10-31"
  const cleaned = str.replace(/(\d+)(st|nd|rd|th)/gi, "$1").trim();
  const d = new Date(cleaned);
  return isNaN(d.getTime()) ? null : d;
}

function absoluteUrl(href, base) {
  if (!href) return null;
  href = href.trim();
  if (href.startsWith("http://") || href.startsWith("https://")) return href;
  if (href.startsWith("//")) return "https:" + href;
  if (href.startsWith("/")) return base + href;
  return null;
}

async function fetchHTML(url, extraHeaders = {}) {
  const { data } = await axios.get(url, {
    timeout: 20000,
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      "Accept-Encoding": "gzip, deflate, br",
      ...extraHeaders,
    },
  });
  return data;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ── Source 1: NSP India (Government) ──────────────────────────────────────

async function scrapeNSP() {
  const results = [];
  try {
    console.log("  ↳ NSP India (scholarships.gov.in)...");
    const html = await fetchHTML("https://scholarships.gov.in/public/schemeGuidelines/schemeList.action");
    const $ = cheerio.load(html);
    $("table tr").each((i, row) => {
      if (i === 0) return;
      const cols = $(row).find("td");
      if (cols.length < 3) return;
      const title = $(cols[1]).text().trim();
      const provider = $(cols[2]).text().trim();
      const href = $(cols[1]).find("a").attr("href");
      const link = absoluteUrl(href, "https://scholarships.gov.in") || "https://scholarships.gov.in";
      if (!title) return;
      results.push({
        title, provider: provider || "Government of India",
        amount: null, amountValue: null, currency: "INR",
        eligibility: { categories: [], locations: ["India"], courses: [] },
        deadline: new Date("2026-12-31"), // NSP deadlines are typically end of year
        url: link, source: "nsp_india", tags: ["india", "government"],
      });
    });
    console.log(`     ✓ NSP: ${results.length} entries`);
  } catch (err) {
    console.warn(`  ⚠️  NSP failed: ${err.message}`);
  }
  return results;
}

// ── Source 2: Buddy4Study ──────────────────────────────────────────────────

async function scrapeBuddy4Study() {
  const results = [];
  for (const page of [1, 2, 3]) {
    try {
      console.log(`  ↳ Buddy4Study page ${page}...`);
      const html = await fetchHTML(`https://www.buddy4study.com/scholarships?page=${page}`);
      const $ = cheerio.load(html);
      $(".scholarship-card, .b4s-scholarship-card, article.scholarship, .card").each((_, el) => {
        const title = $(el).find("h2, h3, .scholarship-title, .title").first().text().trim();
        if (!title || title.length < 5) return;
        const provider = $(el).find(".provider, .organisation, .org-name, .sponsor").first().text().trim();
        const rawAmount = $(el).find(".amount, .scholarship-amount, .prize, .award").first().text().trim();
        const deadlineText = $(el).find(".deadline, .last-date, .end-date, .closing-date").first().text().trim();
        const href = $(el).find("a").first().attr("href");
        const link = absoluteUrl(href, "https://www.buddy4study.com");
        const categories = $(el).find(".category, .eligibility-tag, .tag").map((_, t) => $(t).text().trim()).get().filter(Boolean);
        const location = $(el).find(".location, .state, .place").first().text().trim();
        const course = $(el).find(".course, .stream, .discipline").first().text().trim();
        const { amountValue, currency } = parseAmount(rawAmount);
        results.push({
          title, provider: provider || "Buddy4Study",
          amount: rawAmount || null, amountValue, currency: currency || "INR",
          eligibility: { categories, locations: parseList(location), courses: parseList(course) },
          deadline: safeDate(deadlineText), url: link,
          source: "buddy4study", tags: ["india"],
        });
      });
      await sleep(1500);
    } catch (err) {
      console.warn(`  ⚠️  Buddy4Study page ${page} failed: ${err.message}`);
    }
  }
  console.log(`     ✓ Buddy4Study: ${results.length} entries`);
  return results;
}

// ── Source 3: AglaSem Scholarships ────────────────────────────────────────

async function scrapeAglaSem() {
  const results = [];
  try {
    console.log("  ↳ AglaSem...");
    const html = await fetchHTML("https://aglasem.com/scholarships/");
    const $ = cheerio.load(html);
    $("article, .entry, .post, .scholarship-item").each((_, el) => {
      const title = $(el).find("h2 a, h3 a, .entry-title a").first().text().trim();
      if (!title || title.length < 5) return;
      const href = $(el).find("h2 a, h3 a, .entry-title a").first().attr("href");
      const link = absoluteUrl(href, "https://aglasem.com");
      const deadlineText = $(el).find(".deadline, time, .date").first().text().trim();
      results.push({
        title, provider: "AglaSem",
        amount: null, amountValue: null, currency: "INR",
        eligibility: { categories: [], locations: ["India"], courses: [] },
        deadline: safeDate(deadlineText) || new Date("2026-12-31"),
        url: link, source: "aglasem", tags: ["india"],
      });
    });
    console.log(`     ✓ AglaSem: ${results.length} entries`);
  } catch (err) {
    console.warn(`  ⚠️  AglaSem failed: ${err.message}`);
  }
  return results;
}

// ── Source 4: Vidyasaarathi ────────────────────────────────────────────────

async function scrapeVidyasaarathi() {
  const results = [];
  try {
    console.log("  ↳ Vidyasaarathi...");
    const html = await fetchHTML("https://www.vidyasaarathi.co.in/Vidyasaarathi/scholarshiplist");
    const $ = cheerio.load(html);
    $(".scholarship-box, .schol-card, .card, .item").each((_, el) => {
      const title = $(el).find("h3, h4, .schol-name, .title").first().text().trim();
      if (!title || title.length < 5) return;
      const provider = $(el).find(".provider, .company, .org").first().text().trim();
      const rawAmount = $(el).find(".amount, .award, .stipend").first().text().trim();
      const deadlineText = $(el).find(".deadline, .last-date, .closing").first().text().trim();
      const href = $(el).find("a").first().attr("href");
      const link = absoluteUrl(href, "https://www.vidyasaarathi.co.in") || "https://www.vidyasaarathi.co.in";
      const { amountValue, currency } = parseAmount(rawAmount);
      results.push({
        title, provider: provider || "Vidyasaarathi",
        amount: rawAmount || null, amountValue, currency: currency || "INR",
        eligibility: { categories: [], locations: ["India"], courses: [] },
        deadline: safeDate(deadlineText) || new Date("2026-12-31"),
        url: link, source: "vidyasaarathi", tags: ["india", "corporate"],
      });
    });
    console.log(`     ✓ Vidyasaarathi: ${results.length} entries`);
  } catch (err) {
    console.warn(`  ⚠️  Vidyasaarathi failed: ${err.message}`);
  }
  return results;
}

// ── Source 5: Scholarships.com ────────────────────────────────────────────

async function scrapeScholarshipsDotCom() {
  const results = [];
  const urls = [
    "https://www.scholarships.com/financial-aid/college-scholarships/scholarships-by-type/merit-scholarships/",
    "https://www.scholarships.com/financial-aid/college-scholarships/scholarships-by-deadline/scholarships-in-2026/",
  ];
  for (const url of urls) {
    try {
      console.log(`  ↳ Scholarships.com: ${url.split("/").slice(-2, -1)[0]}...`);
      const html = await fetchHTML(url);
      const $ = cheerio.load(html);
      $("h3 a, h2 a, .scholarship-name a, td a[href*='scholarship']").each((_, el) => {
        const title = $(el).text().trim();
        if (!title || title.length < 8) return;
        const href = $(el).attr("href");
        const link = absoluteUrl(href, "https://www.scholarships.com");
        if (!link) return;
        results.push({
          title, provider: "Scholarships.com",
          amount: null, amountValue: null, currency: "USD",
          eligibility: { categories: [], locations: ["USA"], courses: [] },
          deadline: new Date("2026-10-01"),
          url: link, source: "scholarships_com", tags: ["usa"],
        });
      });
      await sleep(1000);
    } catch (err) {
      console.warn(`  ⚠️  Scholarships.com failed: ${err.message}`);
    }
  }
  console.log(`     ✓ Scholarships.com: ${results.length} entries`);
  return results;
}

// ── Source 6: College Board Opportunity Scholarships ──────────────────────

async function scrapeCollegeBoard() {
  const results = [];
  try {
    console.log("  ↳ College Board BigFuture...");
    const html = await fetchHTML("https://bigfuture.collegeboard.org/scholarship-search");
    const $ = cheerio.load(html);
    $(".scholarship-card, .result-card, .opportunity-card, article").each((_, el) => {
      const title = $(el).find("h2, h3, .card-title, .name").first().text().trim();
      if (!title || title.length < 5) return;
      const rawAmount = $(el).find(".award, .amount").first().text().trim();
      const deadlineText = $(el).find(".deadline, .due-date").first().text().trim();
      const href = $(el).find("a").first().attr("href");
      const link = absoluteUrl(href, "https://bigfuture.collegeboard.org");
      const { amountValue, currency } = parseAmount(rawAmount);
      results.push({
        title, provider: "College Board",
        amount: rawAmount || null, amountValue, currency: currency || "USD",
        eligibility: { categories: [], locations: ["USA"], courses: [] },
        deadline: safeDate(deadlineText) || new Date("2026-12-01"),
        url: link || "https://bigfuture.collegeboard.org/scholarship-search",
        source: "collegeboard", tags: ["usa"],
      });
    });
    console.log(`     ✓ College Board: ${results.length} entries`);
  } catch (err) {
    console.warn(`  ⚠️  College Board failed: ${err.message}`);
  }
  return results;
}

// ── Source 7: Unigo ───────────────────────────────────────────────────────

async function scrapeUnigo() {
  const results = [];
  try {
    console.log("  ↳ Unigo...");
    const html = await fetchHTML("https://www.unigo.com/scholarships/our-scholarships");
    const $ = cheerio.load(html);
    $(".scholarship, .schol-item, .card, article").each((_, el) => {
      const title = $(el).find("h2, h3, .title, .schol-name").first().text().trim();
      if (!title || title.length < 5) return;
      const rawAmount = $(el).find(".award, .amount, .prize").first().text().trim();
      const deadlineText = $(el).find(".deadline, .due-date, .closing").first().text().trim();
      const href = $(el).find("a").first().attr("href");
      const link = absoluteUrl(href, "https://www.unigo.com");
      const { amountValue, currency } = parseAmount(rawAmount);
      results.push({
        title, provider: "Unigo",
        amount: rawAmount || null, amountValue, currency: currency || "USD",
        eligibility: { categories: [], locations: ["USA"], courses: [] },
        deadline: safeDate(deadlineText) || new Date("2026-11-01"),
        url: link || "https://www.unigo.com/scholarships",
        source: "unigo", tags: ["usa"],
      });
    });
    console.log(`     ✓ Unigo: ${results.length} entries`);
  } catch (err) {
    console.warn(`  ⚠️  Unigo failed: ${err.message}`);
  }
  return results;
}

// ── Source 8: Seed (hardcoded real scholarships) ──────────────────────────
// Always inserted as reliable fallback with correct URLs and future deadlines

function getSeedScholarships() {
  return [
    // ── India ──
    {
      title: "Prime Minister's Scholarship Scheme (PMSS)",
      provider: "Kendriya Sainik Board, Ministry of Defence",
      amount: "₹25,000/year", amountValue: 25000, currency: "INR",
      eligibility: { categories: ["GEN", "OBC", "SC", "ST"], locations: ["India"], courses: ["Any"], minGPA: 6.0 },
      deadline: new Date("2026-10-31"),
      url: "https://ksb.gov.in/pmss.htm",
      source: "seed", tags: ["india", "government", "defence"],
    },
    {
      title: "Central Sector Scheme of Scholarships (CSSS)",
      provider: "Ministry of Education, Government of India",
      amount: "₹12,000/year", amountValue: 12000, currency: "INR",
      eligibility: { categories: ["GEN", "OBC", "SC", "ST", "EWS"], locations: ["India"], courses: ["Any"], minGPA: 7.0 },
      deadline: new Date("2026-11-30"),
      url: "https://scholarships.gov.in",
      source: "seed", tags: ["india", "government", "merit"],
    },
    {
      title: "Post Matric Scholarship for SC Students",
      provider: "Ministry of Social Justice, Government of India",
      amount: "₹7,000–₹12,000/year", amountValue: 12000, currency: "INR",
      eligibility: { categories: ["SC"], locations: ["India"], courses: ["Any"] },
      deadline: new Date("2026-12-15"),
      url: "https://scholarships.gov.in",
      source: "seed", tags: ["india", "government", "sc"],
    },
    {
      title: "Post Matric Scholarship for OBC Students",
      provider: "Ministry of Social Justice, Government of India",
      amount: "Up to ₹10,000/year", amountValue: 10000, currency: "INR",
      eligibility: { categories: ["OBC"], locations: ["India"], courses: ["Any"] },
      deadline: new Date("2026-12-15"),
      url: "https://scholarships.gov.in",
      source: "seed", tags: ["india", "government", "obc"],
    },
    {
      title: "Post Matric Scholarship for ST Students",
      provider: "Ministry of Tribal Affairs, Government of India",
      amount: "Up to ₹10,000/year", amountValue: 10000, currency: "INR",
      eligibility: { categories: ["ST"], locations: ["India"], courses: ["Any"] },
      deadline: new Date("2026-12-31"),
      url: "https://scholarships.gov.in",
      source: "seed", tags: ["india", "government", "st"],
    },
    {
      title: "Ishan Uday Scholarship for North East",
      provider: "UGC / Government of India",
      amount: "₹5,400–₹7,800/month", amountValue: 7800, currency: "INR",
      eligibility: { categories: ["GEN", "OBC", "SC", "ST"], locations: ["Assam", "Arunachal Pradesh", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Sikkim", "Tripura"], courses: ["Any"] },
      deadline: new Date("2026-10-31"),
      url: "https://www.ugc.gov.in/ishan_uday/",
      source: "seed", tags: ["india", "northeast", "ugc"],
    },
    {
      title: "Pragati Scholarship for Girls (AICTE)",
      provider: "AICTE",
      amount: "₹50,000/year", amountValue: 50000, currency: "INR",
      eligibility: { categories: ["GEN", "OBC", "SC", "ST", "EWS"], locations: ["India"], courses: ["Engineering"] },
      deadline: new Date("2026-11-30"),
      url: "https://www.aicte-india.org/bureaus/pgd/scholarships",
      source: "seed", tags: ["india", "aicte", "women", "engineering"],
    },
    {
      title: "Saksham Scholarship for Differently Abled (AICTE)",
      provider: "AICTE",
      amount: "₹50,000/year", amountValue: 50000, currency: "INR",
      eligibility: { categories: ["GEN", "OBC", "SC", "ST", "EWS"], locations: ["India"], courses: ["Engineering"] },
      deadline: new Date("2026-11-30"),
      url: "https://www.aicte-india.org/bureaus/pgd/scholarships",
      source: "seed", tags: ["india", "aicte", "differently-abled"],
    },
    {
      title: "HDFC Bank Parivartan's ECS Scholarship",
      provider: "HDFC Bank",
      amount: "₹75,000/year", amountValue: 75000, currency: "INR",
      eligibility: { categories: ["GEN", "OBC", "SC", "ST", "EWS"], locations: ["India"], courses: ["Engineering", "Medical", "Any"] },
      deadline: new Date("2026-09-30"),
      url: "https://www.buddy4study.com/scholarship/hdfc-bank-parivartan-ecs-scholarship",
      source: "seed", tags: ["india", "corporate", "hdfc"],
    },
    {
      title: "Tata Capital Pankh Scholarship",
      provider: "Tata Capital",
      amount: "Up to ₹50,000/year", amountValue: 50000, currency: "INR",
      eligibility: { categories: ["GEN", "OBC", "SC", "ST", "EWS"], locations: ["India"], courses: ["Any"] },
      deadline: new Date("2026-08-31"),
      url: "https://www.buddy4study.com/scholarship/tata-capital-pankh-scholarship-program",
      source: "seed", tags: ["india", "corporate", "tata"],
    },
    {
      title: "Reliance Foundation Undergraduate Scholarships",
      provider: "Reliance Foundation",
      amount: "₹2,00,000/year", amountValue: 200000, currency: "INR",
      eligibility: { categories: ["GEN", "OBC", "SC", "ST", "EWS"], locations: ["India"], courses: ["Engineering", "Science", "Commerce", "Arts"] },
      deadline: new Date("2026-09-15"),
      url: "https://scholarships.reliancefoundation.org",
      source: "seed", tags: ["india", "corporate", "reliance"],
    },
    {
      title: "Inspire Scholarship (DST)",
      provider: "Department of Science & Technology, Govt. of India",
      amount: "₹80,000/year", amountValue: 80000, currency: "INR",
      eligibility: { categories: ["GEN", "OBC", "SC", "ST", "EWS"], locations: ["India"], courses: ["Science"], minGPA: 7.0 },
      deadline: new Date("2026-10-15"),
      url: "https://online-inspire.gov.in/",
      source: "seed", tags: ["india", "government", "science", "dst"],
    },
    {
      title: "L'Oréal India For Young Women in Science",
      provider: "L'Oréal India",
      amount: "₹2,50,000", amountValue: 250000, currency: "INR",
      eligibility: { categories: ["GEN", "OBC", "SC", "ST", "EWS"], locations: ["India"], courses: ["Science", "Engineering", "Medical"] },
      deadline: new Date("2026-07-31"),
      url: "https://www.lorealparisusa.com/women-in-science",
      source: "seed", tags: ["india", "women", "science"],
    },
    {
      title: "Swami Vivekananda Merit-cum-Means Scholarship (West Bengal)",
      provider: "Govt. of West Bengal",
      amount: "₹1,000–₹5,000/month", amountValue: 60000, currency: "INR",
      eligibility: { categories: ["GEN", "OBC", "SC", "ST", "EWS"], locations: ["West Bengal"], courses: ["Any"] },
      deadline: new Date("2026-11-30"),
      url: "https://svmcm.wbhed.gov.in/",
      source: "seed", tags: ["india", "west-bengal", "state"],
    },
    {
      title: "Assam Scholarship for Higher Education",
      provider: "Govt. of Assam – Directorate of Higher Education",
      amount: "₹10,000–₹36,000/year", amountValue: 36000, currency: "INR",
      eligibility: { categories: ["GEN", "OBC", "SC", "ST", "EWS"], locations: ["Assam"], courses: ["Any"] },
      deadline: new Date("2026-12-31"),
      url: "https://scholarships.gov.in",
      source: "seed", tags: ["india", "assam", "state", "northeast"],
    },
    // ── USA ──
    {
      title: "Gates Scholarship",
      provider: "Bill & Melinda Gates Foundation",
      amount: "$10,000+", amountValue: 10000, currency: "USD",
      eligibility: { categories: [], locations: ["USA"], courses: ["Any"], minGPA: 3.3 },
      deadline: new Date("2026-09-15"),
      url: "https://www.thegatesscholarship.org",
      source: "seed", tags: ["usa", "merit"],
    },
    {
      title: "Coca-Cola Scholars Program",
      provider: "Coca-Cola Scholars Foundation",
      amount: "$20,000", amountValue: 20000, currency: "USD",
      eligibility: { categories: [], locations: ["USA"], courses: ["Any"], minGPA: 3.0 },
      deadline: new Date("2026-10-31"),
      url: "https://www.coca-colascholarsfoundation.org",
      source: "seed", tags: ["usa", "merit"],
    },
    {
      title: "Dell Scholars Program",
      provider: "Michael & Susan Dell Foundation",
      amount: "$20,000", amountValue: 20000, currency: "USD",
      eligibility: { categories: [], locations: ["USA"], courses: ["Any"] },
      deadline: new Date("2026-12-01"),
      url: "https://www.dellscholars.org",
      source: "seed", tags: ["usa", "merit"],
    },
    {
      title: "Ron Brown Scholar Program",
      provider: "CAP Charitable Foundation",
      amount: "$40,000", amountValue: 40000, currency: "USD",
      eligibility: { categories: [], locations: ["USA"], courses: ["Any"], minGPA: 3.0 },
      deadline: new Date("2027-01-09"),
      url: "https://www.ronbrown.org",
      source: "seed", tags: ["usa"],
    },
    {
      title: "Burger King Scholars Program",
      provider: "Burger King McLamore Foundation",
      amount: "$25,000", amountValue: 25000, currency: "USD",
      eligibility: { categories: [], locations: ["USA"], courses: ["Any"] },
      deadline: new Date("2026-12-15"),
      url: "https://www.bkmclamorefoundation.org",
      source: "seed", tags: ["usa"],
    },
    {
      title: "Elks National Foundation Most Valuable Student",
      provider: "Elks National Foundation",
      amount: "$12,500", amountValue: 12500, currency: "USD",
      eligibility: { categories: [], locations: ["USA"], courses: ["Any"], minGPA: 2.0 },
      deadline: new Date("2026-11-05"),
      url: "https://www.elks.org/scholars/scholarships/MVS.cfm",
      source: "seed", tags: ["usa", "merit"],
    },
    {
      title: "Jack Kent Cooke Foundation Scholarship",
      provider: "Jack Kent Cooke Foundation",
      amount: "$55,000", amountValue: 55000, currency: "USD",
      eligibility: { categories: [], locations: ["USA"], courses: ["Any"], minGPA: 3.5 },
      deadline: new Date("2026-11-18"),
      url: "https://www.jkcf.org/our-scholarships/college-scholarship-program/",
      source: "seed", tags: ["usa", "merit"],
    },
    {
      title: "Society of Women Engineers (SWE) Scholarship",
      provider: "Society of Women Engineers",
      amount: "$16,000", amountValue: 16000, currency: "USD",
      eligibility: { categories: [], locations: ["USA"], courses: ["Engineering"], minGPA: 3.0 },
      deadline: new Date("2027-05-01"),
      url: "https://scholarships.swe.org",
      source: "seed", tags: ["usa", "engineering", "women"],
    },
    {
      title: "AMS Minority Scholarship (Meteorology)",
      provider: "American Meteorological Society",
      amount: "$10,000", amountValue: 10000, currency: "USD",
      eligibility: { categories: [], locations: ["USA"], courses: ["Science", "Engineering"] },
      deadline: new Date("2027-02-01"),
      url: "https://www.ametsoc.org/ams/index.cfm/information-for/students/ams-scholarships-and-fellowships/",
      source: "seed", tags: ["usa", "stem", "science"],
    },
  ];
}

// ── Dedup ──────────────────────────────────────────────────────────────────

function dedup(scholarships) {
  const seen = new Set();
  return scholarships.filter((s) => {
    const key = (s.title || "").toLowerCase().replace(/\s+/g, " ").trim();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ── Main ───────────────────────────────────────────────────────────────────

async function scrape() {
  try {
    await mongoose.connect(process.env.DBURL);
    console.log("✅ MongoDB connected\n");

    // Step 1: Remove old scraped data (keep manually added ones if any)
    const deleted = await Scholarship.deleteMany({
      source: { $in: ["local_html", "demo", "buddy4study", "nsp_india", "aglasem", "vidyasaarathi", "scholarships_com", "fastweb", "collegeboard", "unigo", "seed"] }
    });
    console.log(`🗑️  Cleared ${deleted.deletedCount} old scholarships\n`);

    // Step 2: Scrape live sources
    console.log("🔍 Scraping live sources...");
    const [nsp, buddy, aglasem, vidya, sdotcom, collegeboard, unigo] = await Promise.all([
      scrapeNSP(),
      scrapeBuddy4Study(),
      scrapeAglaSem(),
      scrapeVidyasaarathi(),
      scrapeScholarshipsDotCom(),
      scrapeCollegeBoard(),
      scrapeUnigo(),
    ]);

    // Step 3: Always include seed data (reliable fallback)
    const seed = getSeedScholarships();
    console.log(`\n📌 Seed scholarships: ${seed.length} (always included)`);

    const all = dedup([...seed, ...nsp, ...buddy, ...aglasem, ...vidya, ...sdotcom, ...collegeboard, ...unigo]);
    console.log(`📦 Total unique after dedup: ${all.length}\n`);

    // Step 4: Insert
    const inserted = await Scholarship.insertMany(all, { ordered: false }).catch((err) => {
      if (err.code === 11000) {
        console.log("   ℹ️  Some duplicates skipped (unique index)");
        return { insertedCount: err.result?.nInserted ?? "?" };
      }
      throw err;
    });

    console.log(`✅ Done! Inserted ${inserted?.insertedCount ?? all.length} scholarships`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("❌ Fatal error:", err.message);
    await mongoose.connection.close();
    process.exit(1);
  }
}

scrape();