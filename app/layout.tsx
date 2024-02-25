import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import {DeleteSurveyDialog} from '@/components/delete-survey';
import {Toaster} from '@/components/ui/sonner';
import {QueryClientProvider} from '@/lib/query-client/provider';
import {cn} from '@/lib/utils';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  let content = (
    <>
      <QueryClientProvider>
        <DeleteSurveyDialog>{children}</DeleteSurveyDialog>
      </QueryClientProvider>
      <Toaster />
    </>
  );

  if (process.env.NODE_ENV === 'production') {
    content = (
      <div className="flex h-screen items-center justify-center">
        <div className="flex max-w-sm flex-col gap-2">
          <h1 className="text-lg font-medium">Work in progress</h1>
          <p className="text-sm text-gray-500">
            This app is currently under construction. In the meantime, you can
            check out the code{' '}
            <a
              className="text-blue-500 underline underline-offset-2"
              href="https://github.com/ciandm/survey-designer"
            >
              here
            </a>{' '}
            and make changes locally and connect to your own database.
          </p>
        </div>
      </div>
    );
  }

  return (
    <html lang="en">
      <body
        className={cn('bg-background font-sans antialiased', inter.variable)}
      >
        {content}
      </body>
    </html>
  );
}
