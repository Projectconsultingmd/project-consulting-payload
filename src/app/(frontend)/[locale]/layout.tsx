import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { Libre_Franklin, Poppins, Montserrat } from 'next/font/google'
import React from 'react'

const libreFranklin = Libre_Franklin({
  subsets: ['latin'],
  variable: '--font-libre-franklin',
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-montserrat',
  display: 'swap',
})

import { Footer } from '@/globals/Footer/Component'
import { Header } from '@/globals/Header/Component'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { draftMode } from 'next/headers'
import { TypedLocale } from 'payload'
import { getCachedGlobal } from '@/utilities/getGlobals'
import type { Header as HeaderType } from '@/payload-types'

import './globals.css'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { NextIntlClientProvider } from 'next-intl'
import { routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'
import localization from '@/i18n/localization'

type Args = {
  children: React.ReactNode
  params: Promise<{
    locale: TypedLocale
  }>
}

export default async function RootLayout({ children, params }: Args) {
  const { locale } = await params
  const currentLocale = localization.locales.find((loc) => loc.code === locale)
  const direction = (currentLocale as any)?.rtl ? 'rtl' : 'ltr'

  if (!routing.locales.includes(locale as any)) {
    notFound()
  }
  setRequestLocale(locale)

  const { isEnabled } = await draftMode()
  const messages = await getMessages()
  const header = (await getCachedGlobal('header', 1, locale)()) as HeaderType

  // Get tab icon URL if available
  let tabIconUrl: string | null = null
  let tabIconType: string | null = null

  if (
    header?.tabIcon &&
    typeof header.tabIcon === 'object' &&
    'url' in header.tabIcon &&
    header.tabIcon.url
  ) {
    tabIconUrl = `${process.env.NEXT_PUBLIC_SERVER_URL || ''}${header.tabIcon.url}`
    
    // Detect file type from URL
    const url = header.tabIcon.url.toLowerCase()
    if (url.endsWith('.svg')) {
      tabIconType = 'image/svg+xml'
    } else if (url.endsWith('.ico')) {
      tabIconType = 'image/x-icon'
    } else if (url.endsWith('.png')) {
      tabIconType = 'image/png'
    } else {
      tabIconType = 'image/png' // default
    }
  }

  return (
    <html
      className={cn(GeistSans.variable, GeistMono.variable, libreFranklin.variable, poppins.variable, montserrat.variable, 'overflow-x-hidden')}
      lang={locale}
      dir={direction}
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
        {tabIconUrl && (
          <>
            <link href={tabIconUrl} rel="icon" type={tabIconType || 'image/png'} />
            <link href={tabIconUrl} rel="shortcut icon" />
          </>
        )}
      </head>
      <body>
        <main>
        <Providers>
          <NextIntlClientProvider messages={messages}>
            {process.env.NODE_ENV === 'production' && <LivePreviewListener />}
            <Header locale={locale} />
            {children}
            <Footer locale={locale} />
          </NextIntlClientProvider>
        </Providers>
        </main>
      </body>
    </html>
  )
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}
