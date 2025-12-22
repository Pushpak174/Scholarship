const fs = require("fs");
const cheerio = require("cheerio");
const mongoose = require("mongoose");
const { Scholarship } = require("../App/model/scholarshipmodel");

require("dotenv").config({ path: "../.env" });

function parseAmount(raw) {
  if (!raw) return { amountValue: null, currency: null };

  let currency = null;
  let value = null;

  if (raw.includes("₹")) currency = "INR";
  else if (raw.includes("$")) currency = "USD";

  const num = raw.replace(/[^0-9]/g, "");
  if (num) value = Number(num);

  return { amountValue: value, currency };
}

function parseList(text) {
  if (!text) return [];
  return text
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

async function scrape() {
  try {
    await mongoose.connect(process.env.DBURL);
    console.log("✅ MongoDB connected");

    const html = fs.readFileSync("./demo_scholarships.html", "utf-8");
    const $ = cheerio.load(html);

    const scholarships = [];

    $(".scholarship").each((_, el) => {
      const title = $(el).find("h3").text().trim();
      if (!title) return;

      const rawAmount = $(el).find(".amount").text().trim();
      const deadlineText = $(el).find(".deadline").text().trim();
      const url = $(el).find("a").attr("href");

      const provider = $(el).find(".provider").text().trim();
      const categoriesText = $(el).find(".category").text().trim();
      const locationsText = $(el).find(".location").text().trim();
      const coursesText = $(el).find(".course").text().trim();

      const { amountValue, currency } = parseAmount(rawAmount);

      scholarships.push({
        title,
        provider: provider || "Demo Source",

        amount: rawAmount,
        amountValue,
        currency,

        eligibility: {
          categories: parseList(categoriesText),
          locations: parseList(locationsText),
          courses: parseList(coursesText),
        },

        deadline: deadlineText ? new Date(deadlineText) : null,
        url,
        source: "local_html",
        tags: ["demo", "scraped"],
      });
    });

    await Scholarship.insertMany(scholarships);
    console.log(`✅ Inserted ${scholarships.length} scholarships`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("❌ Scraping error:", err.message);
    process.exit(1);
  }
}

scrape();
