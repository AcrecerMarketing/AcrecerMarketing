import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const F = (arr: string[]) => JSON.stringify(arr);

async function seedPlans() {
  const plans = [
    {
      slug: "starter-influencer",
      name: "Starter",
      tagline: "Para creadores que están arrancando su comunidad",
      price: 69,
      billingPeriod: "MONTHLY",
      audience: "INFLUENCER",
      featured: false,
      sortOrder: 1,
      features: F([
        "Crecimiento orgánico dirigido en Instagram",
        "Targeting básico por hashtags",
        "Reporte mensual de resultados",
        "Soporte por email",
      ]),
    },
    {
      slug: "growth-influencer",
      name: "Growth",
      tagline: "El plan más elegido por influencers en crecimiento activo",
      price: 129,
      billingPeriod: "MONTHLY",
      audience: "INFLUENCER",
      featured: true,
      sortOrder: 2,
      features: F([
        "Todo lo del plan Starter",
        "Growth manager dedicado",
        "Targeting avanzado: hashtags, ubicación y competidores",
        "Reportes semanales de crecimiento",
        "Optimización de perfil y bio",
      ]),
    },
    {
      slug: "pro-influencer",
      name: "Pro",
      tagline: "Máximo crecimiento para creadores full-time",
      price: 249,
      billingPeriod: "MONTHLY",
      audience: "INFLUENCER",
      featured: false,
      sortOrder: 3,
      features: F([
        "Todo lo del plan Growth",
        "Múltiples cuentas / plataformas",
        "Soporte prioritario 24/7",
        "Estrategia de contenido personalizada",
        "Informes a medida",
      ]),
    },
    {
      slug: "brand-launch",
      name: "Brand Launch",
      tagline: "Para marcas que inician campañas de influencers",
      price: 349,
      billingPeriod: "MONTHLY",
      audience: "BRAND",
      featured: false,
      sortOrder: 4,
      features: F([
        "Crecimiento orgánico de la cuenta de marca",
        "Match con micro-influencers afines",
        "1 campaña activa por mes",
        "Reporte mensual de performance",
      ]),
    },
    {
      slug: "brand-scale",
      name: "Brand Scale",
      tagline: "Gestión integral de campañas con influencers",
      price: 799,
      billingPeriod: "MONTHLY",
      audience: "BRAND",
      featured: true,
      sortOrder: 5,
      features: F([
        "Todo lo de Brand Launch",
        "Account manager dedicado",
        "Campañas ilimitadas",
        "Marketplace de influencers verificados",
        "Reportes en tiempo real por campaña",
      ]),
    },
    {
      slug: "brand-enterprise",
      name: "Enterprise",
      tagline: "Soluciones a medida para grandes marcas",
      price: 0,
      billingPeriod: "MONTHLY",
      audience: "BRAND",
      featured: false,
      sortOrder: 6,
      features: F([
        "Todo lo de Brand Scale",
        "Precio e integraciones personalizadas",
        "Equipo dedicado multi-marca",
        "SLA garantizado y soporte 24/7",
      ]),
    },
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { slug: plan.slug },
      update: plan,
      create: plan,
    });
  }
  return prisma.plan.findMany();
}

async function seedDemoClient(growthPlanId: string) {
  const passwordHash = await bcrypt.hash("demo1234", 10);

  const client = await prisma.user.upsert({
    where: { email: "demo@acrecermarketing.com" },
    update: {},
    create: {
      name: "Camila Rivas",
      email: "demo@acrecermarketing.com",
      passwordHash,
      role: "CLIENT",
      customerType: "INFLUENCER",
      onboarded: true,
    },
  });

  await prisma.subscription.deleteMany({ where: { userId: client.id } });
  await prisma.subscription.create({
    data: {
      userId: client.id,
      planId: growthPlanId,
      status: "ACTIVE",
      startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60),
      renewalDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15),
    },
  });

  let account = await prisma.socialAccount.findFirst({ where: { userId: client.id } });
  if (!account) {
    account = await prisma.socialAccount.create({
      data: {
        userId: client.id,
        platform: "instagram",
        handle: "@camila.creates",
        niche: "Lifestyle & Moda",
        followersStart: 8200,
        followersCurrent: 21750,
      },
    });
  }

  await prisma.targetingConfig.upsert({
    where: { accountId: account.id },
    update: {},
    create: {
      accountId: account.id,
      hashtags: "#modasostenible, #ootd, #lifestyleblogger, #modacolombia",
      locations: "Bogotá, Medellín, Ciudad de México, Madrid",
      competitorAccounts: "@estilo.andina, @modalatam, @lookdeldia",
      genderTarget: "female",
      ageMin: 18,
      ageMax: 34,
    },
  });

  const existingMetrics = await prisma.growthMetric.count({ where: { accountId: account.id } });
  if (existingMetrics === 0) {
    const days = 90;
    const startFollowers = account.followersStart;
    const endFollowers = account.followersCurrent;
    const metrics = [];
    for (let i = 0; i <= days; i++) {
      const date = new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000);
      const progress = i / days;
      const noise = Math.sin(i / 5) * 40 + (Math.random() - 0.5) * 60;
      const followers = Math.round(
        startFollowers + (endFollowers - startFollowers) * progress + noise
      );
      const newFollowers = Math.max(20, Math.round(120 + Math.sin(i / 4) * 50 + Math.random() * 60));
      metrics.push({
        accountId: account.id,
        date,
        followers,
        newFollowers,
        engagementRate: Number((3.2 + Math.sin(i / 7) * 0.8 + Math.random() * 0.5).toFixed(2)),
        profileVisits: Math.round(400 + Math.sin(i / 6) * 150 + Math.random() * 100),
        likes: Math.round(900 + Math.sin(i / 5) * 300 + Math.random() * 200),
        comments: Math.round(60 + Math.sin(i / 5) * 20 + Math.random() * 15),
      });
    }
    await prisma.growthMetric.createMany({ data: metrics });
  }

  const existingTicket = await prisma.supportMessage.findFirst({ where: { userId: client.id } });
  if (!existingTicket) {
    await prisma.supportMessage.create({
      data: {
        userId: client.id,
        subject: "Ajuste de hashtags objetivo",
        message: "Quisiera agregar #modacapsula a mi targeting, ¿es posible esta semana?",
        status: "closed",
      },
    });
  }
}

async function seedAdmin() {
  const passwordHash = await bcrypt.hash("admin1234", 10);
  await prisma.user.upsert({
    where: { email: "admin@acrecermarketing.com" },
    update: {},
    create: {
      name: "Equipo Acrecer",
      email: "admin@acrecermarketing.com",
      passwordHash,
      role: "ADMIN",
      customerType: "INFLUENCER",
      onboarded: true,
    },
  });
}

async function main() {
  const plans = await seedPlans();
  const growthPlan = plans.find((p) => p.slug === "growth-influencer")!;
  await seedDemoClient(growthPlan.id);
  await seedAdmin();
  console.log("Seed completado.");
  console.log("Cliente demo: demo@acrecermarketing.com / demo1234");
  console.log("Admin demo:   admin@acrecermarketing.com / admin1234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
