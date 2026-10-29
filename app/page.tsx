import type { Metadata } from 'next'
import giftData from '@/lib/giftData'
import GiftClient from '@/components/GiftClient'

export const metadata: Metadata = {
  metadataBase: new URL('https://happyanniversaryhabiby.vercel.app'),
  title: 'Happy Anniversary Anas 🤍',
  description: 'A special anniversary surprise for Anas 🤍',
  openGraph: {
    title: 'Happy Anniversary Anas 🤍',
    description: 'A special anniversary surprise for Anas 🤍',
    url: 'https://happyanniversaryhabiby.vercel.app',
    siteName: 'Happy Anniversary Anas',
    type: 'website',
    images: [
      {
        url: 'https://happyanniversaryhabiby.vercel.app/images/og-cat.jpg',
        secureUrl: 'https://happyanniversaryhabiby.vercel.app/images/og-cat.jpg',
        width: 1200,
        height: 630,
        type: 'image/jpeg',
        alt: 'Happy Anniversary Anas 🤍',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Happy Anniversary Anas 🤍',
    description: 'A special anniversary surprise for Anas 🤍',
    images: ['https://happyanniversaryhabiby.vercel.app/images/og-cat.jpg'],
  },
}

export default function Home() {
  const data = giftData.anas || giftData.ahmed || giftData.amir
  return <GiftClient data={data} />
}