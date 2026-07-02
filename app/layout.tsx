import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Analytics } from '@vercel/analytics/react';
import Header from '@/components/header';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Pressemitteilungen',
  description: 'Suche und finde Pressemitteilungen',
  icons: {
    icon: '/assets/FinderIcon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          {children}
          <Analytics />
          <Toaster richColors expand={true} position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
