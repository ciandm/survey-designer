import { EyeIcon } from "lucide-react";
import { notFound } from "next/navigation";
import QuestionDesigner from "@/components/question-designer";
import QuestionOptionsPlayground from "@/components/question-options-playground";
import QuestionsContainer from "@/components/questions-container";
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
        <div className="flex w-full flex-col">
          {survey.questions.map((question, index) => (
            <QuestionsContainer questions={survey.questions} key={question.id}>
              <QuestionDesigner
                questionNumber={index + 1}
                question={question}
                isActive={index === 0}
              />
              <Button variant="ghost" className="mx-auto" size="sm">
                Add question
              </Button>
            </QuestionsContainer>
          ))}
        </div>
        <QuestionOptionsPlayground questions={survey.questions} />
      </main>
    </div>
  );
};

export default SurveyCreatorPage;
