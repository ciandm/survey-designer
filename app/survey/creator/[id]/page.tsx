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
    <div className="h-screen">
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
      <main className="flex">
        <aside className="w-[320px] border-r p-4">
          Question suggestion selector goes here
        </aside>
        <div className="bg-primary-foreground container py-8">
          {survey.questions.map((question) => (
            <div key={question.id} className="mb-8">
              <h5 className="text-lg font-semibold">{question.text}</h5>
              <div className="mt-4">
                {question.answers.map((answer) => (
                  <div key={answer.id} className="flex items-center">
                    <input
                      type="radio"
                      id={answer.id}
                      name={question.id}
                      className="mr-2"
                    />
                    <label htmlFor={answer.id}>{answer.text}</label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <aside className="w-[400px] border-l p-4">
          Question options goes here
        </aside>
      </main>
    </div>
  );
};

export default SurveyCreatorPage;
