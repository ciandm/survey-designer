import React from 'react';
import Link from 'next/link';
import {
  DeleteSurveyDialog,
  DeleteSurveyDialogTrigger,
} from '@/components/delete-survey';
import {Button} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {surveySchema} from '@/lib/validations/survey';
import prisma from '@/prisma/client';

const Home = async () => {
  const surveys = await prisma.survey.findMany();

  return (
    <div className="container p-4">
      <h2 className="mb-6 mt-10 scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        Surveys
      </h2>
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {surveys.map((survey) => {
          const parsedSchema = surveySchema.safeParse(survey.schema);
          if (!parsedSchema.success) {
            return null;
          }
          const {data} = parsedSchema;

          return (
            <React.Fragment key={survey.id}>
              <Card>
                <CardHeader>
                  <CardTitle>{data.title}</CardTitle>
                  <CardDescription>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Aliquam
                  </CardDescription>
                </CardHeader>
                <CardContent>{data.elements.length} questions</CardContent>
                <CardFooter className="justify-between">
                  <DeleteSurveyDialogTrigger
                    surveyId={survey.id}
                    variant="secondary"
                  >
                    Delete
                  </DeleteSurveyDialogTrigger>
                  <Button variant="default" asChild>
                    <Link href={`/editor/${survey.id}/designer`}>View</Link>
                  </Button>
                </CardFooter>
              </Card>
            </React.Fragment>
          );
        })}
      </ul>
    </div>
  );
};

export default Home;

export const dynamic = 'force-dynamic';
