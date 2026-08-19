import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";

const schema = z.object({
  subject: z.string().min(3).max(160),
  message: z.string().min(10).max(3000),
});

export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const ticket = await prisma.supportMessage.create({
    data: { userId: session.user.id, ...parsed.data },
  });

  return NextResponse.json({ ok: true, ticket });
}
