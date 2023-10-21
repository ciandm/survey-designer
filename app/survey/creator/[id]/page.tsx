import React from "react";
import { EyeIcon } from "lucide-react";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import prisma from "@/prisma/client";

const SurveyCreatorPage = async ({ params }: { params: { id: string } }) => {
  const survey = await prisma.survey.findUnique({
    where: {
      id: params.id,
    },
    include: {
      questions: {
        include: {
          answers: true,
        },
      },
    },
  });

  if (!survey) {
    return notFound();
  }

  return (
    <>
      <header className="border-b">
        <div className="container flex items-center justify-between py-4">
          <div>
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              {survey.name}
            </h4>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost">
              <EyeIcon className="mr-2 h-5 w-5" />
              Preview
            </Button>
            <Button>Publish</Button>
          </div>
        </div>
      </header>
      <main></main>
    </>
  );
};

export default SurveyCreatorPage;
