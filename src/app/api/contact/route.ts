import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  company: z.string().max(120).optional(),
  message: z.string().min(10).max(2000),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const lead = await prisma.contactLead.create({ data: parsed.data });
  return NextResponse.json({ ok: true, id: lead.id });
}
