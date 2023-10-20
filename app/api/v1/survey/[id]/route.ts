import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function DELETE(req: NextRequest, res: NextResponse) {
  const surveys = await prisma.survey.findMany({
    include: {
      questions: {
        include: {
          answers: true,
        },
      },
    },
  });

  return Response.json({ surveys });
}
