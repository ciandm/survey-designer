import {NextRequest, NextResponse} from 'next/server';
import prisma from '@/prisma/client';

export async function GET(req: NextRequest, res: NextResponse) {
  const surveys = await prisma.survey.findMany({});

  return new Response(JSON.stringify(surveys));
}
