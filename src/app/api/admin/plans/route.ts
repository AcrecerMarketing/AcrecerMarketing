import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";

const schema = z.object({
  planId: z.string().min(1),
  price: z.coerce.number().min(0).max(100_000),
});

export async function PUT(req: Request) {
  const session = await getAuthSession();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const plan = await prisma.plan.update({
    where: { id: parsed.data.planId },
    data: { price: parsed.data.price },
  });

  return NextResponse.json({ ok: true, plan });
}
