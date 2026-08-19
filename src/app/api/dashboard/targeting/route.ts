import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";

const schema = z.object({
  hashtags: z.string().max(500).default(""),
  locations: z.string().max(500).default(""),
  competitorAccounts: z.string().max(500).default(""),
  genderTarget: z.enum(["all", "male", "female"]).default("all"),
  ageMin: z.coerce.number().int().min(13).max(80),
  ageMax: z.coerce.number().int().min(13).max(80),
});

export async function PUT(req: Request) {
  const session = await getAuthSession();
  if (!session?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const account = await prisma.socialAccount.findFirst({
    where: { userId: session.user.id },
  });
  if (!account) {
    return NextResponse.json({ error: "Cuenta no encontrada" }, { status: 404 });
  }

  const data = parsed.data;
  const targeting = await prisma.targetingConfig.upsert({
    where: { accountId: account.id },
    update: data,
    create: { accountId: account.id, ...data },
  });

  return NextResponse.json({ ok: true, targeting });
}
