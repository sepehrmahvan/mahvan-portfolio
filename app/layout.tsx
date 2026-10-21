import type { Metadata } from 'next';

import { kalameh, satoshi } from '@/lib/fonts';

import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Sepehr Mahvan | Full-Stack Product Engineer',
    template: '%s',
  },
  description:
    'Full-stack product engineer building web platforms with TypeScript, Next.js, and React.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      className={`${kalameh.variable} ${satoshi.variable} font-[family-name:var(--font-en)] h-full antialiased`}
    >
      <body className="min-h-full bg-zinc-50 text-zinc-950">{children}</body>
    </html>
  );
}
