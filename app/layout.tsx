import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import {Toaster} from '@/components/ui/sonner';
import {QueryClientProvider} from '@/lib/query-client/provider';
import {cn} from '@/lib/utils';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body
        className={cn('bg-background font-sans antialiased', inter.variable)}
      >
        <QueryClientProvider>{children}</QueryClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
