import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";

const schema = z.object({
  handle: z.string().min(2).max(60),
  niche: z.string().min(2).max(120),
  followersCurrent: z.coerce.number().int().min(0).max(100_000_000),
  hashtags: z.string().max(400).optional().default(""),
  locations: z.string().max(400).optional().default(""),
  planId: z.string().min(1),
});

export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Revisa los datos ingresados." }, { status: 400 });
  }

  const { handle, niche, followersCurrent, hashtags, locations, planId } = parsed.data;
  const userId = session.user.id;

  const plan = await prisma.plan.findUnique({ where: { id: planId } });
  if (!plan) {
    return NextResponse.json({ error: "Plan no encontrado." }, { status: 404 });
  }

  const account = await prisma.socialAccount.create({
    data: {
      userId,
      platform: "instagram",
      handle: handle.startsWith("@") ? handle : `@${handle}`,
      niche,
      followersStart: followersCurrent,
      followersCurrent,
    },
  });

  await prisma.targetingConfig.create({
    data: {
      accountId: account.id,
      hashtags,
      locations,
    },
  });

  await prisma.growthMetric.create({
    data: {
      accountId: account.id,
      date: new Date(),
      followers: followersCurrent,
      newFollowers: 0,
      engagementRate: 0,
      profileVisits: 0,
      likes: 0,
      comments: 0,
    },
  });

  await prisma.subscription.create({
    data: {
      userId,
      planId,
      status: "TRIALING",
      renewalDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
    },
  });

  await prisma.user.update({ where: { id: userId }, data: { onboarded: true } });

  return NextResponse.json({ ok: true });
}
