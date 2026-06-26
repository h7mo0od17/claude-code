// Database seed: initial packages, admin account, and broker servers
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const db = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  // Create packages
  const packages = await Promise.all([
    db.package.upsert({
      where: { tier: "BRONZE" },
      update: {},
      create: {
        name: "BronzeFX",
        tier: "BRONZE",
        monthlyPrice: 49,
        minDeposit: 500,
        maxRiskPercent: 2,
        lotSizeMultiplier: 0.01,
        features: [
          "Automatic trade copying",
          "Real-time trade execution",
          "Performance dashboard",
          "Trade history & analytics",
          "Email notifications",
          "Email support",
        ],
      },
    }),
    db.package.upsert({
      where: { tier: "SILVER" },
      update: {},
      create: {
        name: "SilverFX",
        tier: "SILVER",
        monthlyPrice: 99,
        minDeposit: 3000,
        maxRiskPercent: 1.5,
        lotSizeMultiplier: 0.05,
        features: [
          "Everything in BronzeFX",
          "Priority trade execution",
          "Advanced analytics & charts",
          "Monthly performance report",
          "Priority email support",
          "Faster copy speed",
        ],
      },
    }),
    db.package.upsert({
      where: { tier: "GOLD" },
      update: {},
      create: {
        name: "GoldFX",
        tier: "GOLD",
        monthlyPrice: 199,
        minDeposit: 10000,
        maxRiskPercent: 1,
        lotSizeMultiplier: 0.1,
        features: [
          "Everything in SilverFX",
          "Dedicated account manager",
          "Custom risk settings",
          "VIP 24/7 support",
          "Exclusive trading signals",
          "Priority onboarding",
        ],
      },
    }),
  ])

  console.log(`✓ Created ${packages.length} packages`)

  // Create default broker
  const broker = await db.broker.upsert({
    where: { name: "mt4" },
    update: {},
    create: {
      name: "mt4",
      displayName: "MetaTrader",
      isDefault: true,
      isActive: true,
    },
  })

  // Create default broker servers
  const servers = [
    { name: "MetaQuotes-Demo", host: "demo.metaquotes.net", port: 443 },
    { name: "MetaQuotes-Live", host: "live.metaquotes.net", port: 443 },
    { name: "ICMarkets-Demo", host: "demo.icmarkets.com", port: 443 },
    { name: "ICMarkets-Live01", host: "live01.icmarkets.com", port: 443 },
    { name: "FP-Markets-Demo", host: "demo.fpmarkets.com", port: 443 },
    { name: "Pepperstone-Demo", host: "demo.pepperstone.com", port: 443 },
  ]

  for (const server of servers) {
    await db.brokerServer.upsert({
      where: { id: server.name },
      update: {},
      create: { ...server, brokerId: broker.id },
    }).catch(() =>
      db.brokerServer.create({ data: { ...server, brokerId: broker.id } })
    )
  }

  console.log("✓ Created broker servers")

  // Create super admin
  const adminPassword = await bcrypt.hash("AutoFX@Admin2024!", 12)
  const admin = await db.admin.upsert({
    where: { email: "admin@autofx.io" },
    update: {},
    create: {
      fullName: "Super Administrator",
      email: "admin@autofx.io",
      username: "superadmin",
      passwordHash: adminPassword,
      role: "SUPER_ADMIN",
      status: "ACTIVE",
    },
  })

  console.log(`✓ Created super admin: ${admin.email}`)

  // Create FAQ items
  const faqItems = [
    {
      question: "How do I get started?",
      answer: "Create an account, choose a package, complete payment, and connect your broker account.",
      category: "getting-started",
      order: 1,
    },
    {
      question: "What broker do I need?",
      answer: "AutoFX currently supports MetaTrader 4 and MetaTrader 5 accounts via our approved broker.",
      category: "getting-started",
      order: 2,
    },
    {
      question: "How fast are trades copied?",
      answer: "Trades are typically copied within milliseconds of the master account executing.",
      category: "copy-trading",
      order: 1,
    },
  ]

  for (const item of faqItems) {
    await db.faqItem.upsert({
      where: { id: item.question.slice(0, 20) },
      update: {},
      create: item,
    }).catch(() => db.faqItem.create({ data: item }))
  }

  console.log("✓ Created FAQ items")

  // System settings
  await db.systemSetting.upsert({
    where: { key: "grace_period_days" },
    update: {},
    create: { key: "grace_period_days", value: "7" },
  })

  console.log("✓ Database seeded successfully")
  console.log("\nAdmin credentials:")
  console.log("  Email: admin@autofx.io")
  console.log("  Password: AutoFX@Admin2024!")
  console.log("\n⚠️  Change the admin password after first login!")
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())
