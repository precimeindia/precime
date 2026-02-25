import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "Admin@123";
  const hash = await bcrypt.hash(password, 12);

  const admin = await prisma.adminUser.upsert({
    where: { username },
    update: { passwordHash: hash },
    create: { username, passwordHash: hash },
  });
  console.log(`✅ Admin user: ${admin.username}`);

  // Seed FAQs
  const faqs = [
    {
      question: "What is the Metal-to-Copper Ratio?",
      answer:
        "The metal-to-copper ratio tells you how many units of a precious metal are equivalent in value to one unit of copper. A ratio of 10,000 for gold means gold is 10,000 times more valuable than copper by weight.",
      order: 1,
    },
    {
      question: "How often are the ratios updated?",
      answer:
        "Ratios are updated daily by our team, reflecting market conditions and current spot prices. Updates are usually published before 10:00 AM IST.",
      order: 2,
    },
    {
      question: "Why is Copper the base reference (ratio = 1)?",
      answer:
        "Copper is used as the base reference metal because it is the most widely traded industrial metal and serves as a global economic barometer. All other precious metal ratios are expressed relative to copper.",
      order: 3,
    },
    {
      question: "Can I use these ratios for trading decisions?",
      answer:
        "These ratios are for informational and educational purposes only. They should not be used as the sole basis for trading or investment decisions. Always consult a qualified financial advisor.",
      order: 4,
    },
    {
      question: "How do I view historical ratio data?",
      answer:
        "Use the history selector on the main page to view ratios for the last 7 days, 30 days, or a custom date range (up to 90 days). Click 'View Details' on any date to see the full breakdown.",
      order: 5,
    },
  ];

  // Clear existing FAQs and insert fresh
  await prisma.fAQ.deleteMany();
  for (const faq of faqs) {
    await prisma.fAQ.create({ data: faq });
  }
  console.log(`✅ ${faqs.length} FAQs seeded`);

  // Seed Blog Links
  const blogLinks = [
    {
      title: "Understanding Precious Metal Ratios in 2025",
      url: "https://precime.com/blog/understanding-metal-ratios",
      order: 1,
    },
    {
      title: "Gold vs Copper: What the Ratio Tells Investors",
      url: "https://precime.com/blog/gold-copper-ratio-analysis",
      order: 2,
    },
    {
      title: "The Rise of Platinum Group Metals in Indian Markets",
      url: "https://precime.com/blog/platinum-group-metals-india",
      order: 3,
    },
  ];

  await prisma.blogLink.deleteMany();
  for (const link of blogLinks) {
    await prisma.blogLink.create({ data: link });
  }
  console.log(`✅ ${blogLinks.length} blog links seeded`);

  // Seed today's sample ratios
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const sampleRatios = {
    date: dateStr,
    Au: 8245.3214,
    Ag: 104.5678,
    Pt: 987.6543,
    Pd: 1123.4567,
    Rh: 4567.8901,
    Ir: 3456.7890,
    Os: 3890.1234,
    Ru: 789.0123,
    Hg: 42.3456,
    Cu: 1.0,
  };

  const existing = await prisma.metalRatio.findUnique({ where: { date: dateStr } });
  if (!existing) {
    const created = await prisma.metalRatio.create({ data: sampleRatios });
    await prisma.metalRatioLog.create({
      data: {
        metalRatioId: created.id,
        date: dateStr,
        note: "Initial seed data",
        oldValues: JSON.stringify({}),
        newValues: JSON.stringify(sampleRatios),
      },
    });
    console.log(`✅ Sample ratios seeded for ${dateStr}`);
  } else {
    console.log(`ℹ️  Ratios for ${dateStr} already exist, skipping`);
  }

  console.log("🎉 Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
