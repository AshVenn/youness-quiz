// app/layout.tsx
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import ClientProviders from './ClientProviders';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import LayoutWrapper from '@/components/LayoutWrapper';

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

// Metadata in French for the SmartQ app
export const metadata = {
  metadataBase: new URL('https://smartq-app.vercel.app'),
  title: {
    default: 'SmartQ',
    template: '%s - SmartQ',
  },
  description: "Créez et répondez à des QCM personnalisés avec SmartQ. Connectez-vous pour suivre vos résultats et tentatives.",
  twitter: {
    handle: '@smartq_app',
    site: '@smartq_app',
    card: 'summary_large_image',
  },
  openGraph: {
    title: 'SmartQ - Générateur de QCM',
    description: "SmartQ est votre outil pour créer et répondre à des QCM intelligents. Gérez facilement vos tentatives et résultats en un seul endroit.",
    url: 'https://smartq-app.vercel.app',
    type: 'website',
    images: [
      {
        url: '/opengraph-image.png',
        alt: 'SmartQ - Générateur de QCM',
      },
    ],
  },
  icons: {
    icon: '/favicon/favicon.ico',
    shortcut: '/favicon/favicon.ico',
    apple: '/favicon/apple-touch-icon.png',
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <link rel='icon' href='/SmartQ.svg' type="image/svg+xml" />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientProviders>
          <TooltipProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
          </TooltipProvider>
          <Toaster />
        </ClientProviders>
      </body>
    </html>
  );
}
