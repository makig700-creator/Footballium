import type { Metadata } from 'next'
import { Inter, Geist } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: { default: 'ФК Функціонал', template: '%s | ФК Функціонал' },
  description: 'Найкраща платформа футбольних новин та управління. Результати матчів, турнірні таблиці, профілі команд та інструменти тренера.',
  keywords: ['футбол', 'новини футболу', 'матчі', 'турнірна таблиця', 'тренер', 'результати'],
  openGraph: {
    title: 'ФК Функціонал',
    description: 'Найкраща платформа футбольних новин та управління.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" className={cn("dark", "font-sans", geist.variable)}>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
        <Toaster theme="dark" richColors position="top-right" />
      </body>
    </html>
  )
}
