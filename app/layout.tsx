import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Silka & Teresa in Korea',
  description: 'A clickable Seoul and Wonju itinerary for August–September 2026.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
