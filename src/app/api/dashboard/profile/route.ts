import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";

const schema = z.object({ name: z.string().min(2).max(120) });

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

  await prisma.user.update({ where: { id: session.user.id }, data: { name: parsed.data.name } });
  return NextResponse.json({ ok: true });
}
