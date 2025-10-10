import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RSS Feed Reader',
  description: 'Read and filter news from multiple RSS feeds across different categories',
  icons: {
    icon: '/favicon.ico'
  }
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  );
}