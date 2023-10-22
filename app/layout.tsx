import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import {Toaster} from '@/components/ui/toaster';
import {QueryClientProvider} from '@/lib/query-client/provider';
import {cn} from '@/lib/utils';
import StoreProvider from '@/store/provider';
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
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.variable,
        )}
      >
        <StoreProvider>
          <QueryClientProvider>{children}</QueryClientProvider>
        </StoreProvider>
        <Toaster />
      </body>
    </html>
  );
}
