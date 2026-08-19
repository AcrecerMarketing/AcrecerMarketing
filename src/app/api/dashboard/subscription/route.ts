import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";

const schema = z.object({ planId: z.string().min(1) });

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

  const plan = await prisma.plan.findUnique({ where: { id: parsed.data.planId } });
  if (!plan) {
    return NextResponse.json({ error: "Plan no encontrado" }, { status: 404 });
  }

  const subscription = await prisma.subscription.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  if (subscription) {
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { planId: plan.id, status: "ACTIVE" },
    });
  } else {
    await prisma.subscription.create({
      data: { userId: session.user.id, planId: plan.id, status: "ACTIVE" },
    });
  }

  return NextResponse.json({ ok: true });
}
