import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'
import { Send } from 'lucide-react'
import { FacebookIcon } from './icons/FacebookIcon'
import { TiktokIcon } from './icons/TiktokIcon'
import { InstagramIcon } from './icons/InstagramIcon'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

import type { Footer, Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { TypedLocale } from 'payload'
import { FooterLocaleSwitcher } from './LocaleSwitcher'
import { Logo } from '@/components/Logo/Logo'
import { FooterWrapper } from './FooterWrapper'

async function getPages(locale: TypedLocale): Promise<Page[]> {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 100,
    locale,
    overrideAccess: false,
    where: {
      slug: {
        not_equals: 'home',
      },
    },
    sort: 'createdAt',
  })

  return result.docs || []
}

const getCachedPages = (locale: TypedLocale) =>
  unstable_cache(
    async () => getPages(locale),
    [`footer-pages-${locale}`],
    {
      tags: ['pages', 'global_footer'],
      revalidate: 3600,
    }
  )

export async function Footer({ locale }: { locale: TypedLocale }) {
  const footer = (await getCachedGlobal('footer', 1, locale)()) as Footer
  const pages = await getCachedPages(locale)()

  const logo = footer?.logo
  const socialMedia = footer?.socialMedia
  const column1 = footer?.column1
  const column2 = footer?.column2
  const column3 = footer?.column3
  const contactUs = footer?.contactUs
  const copyright = footer?.copyright
  const contactForm = footer?.contactForm

  return (
    <footer className="bg-[#051229]">
      {/* Contact Form Section - Above Footer */}
      {contactForm && typeof contactForm === 'object' && contactForm !== null && (
        <FooterWrapper
          contactForm={contactForm as any}
          contactUsTitle={contactUs?.title || 'Contactați-ne!'}
          locale={locale}
        />
      )}

      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Logo + Social Media */}
          <div className="flex flex-col gap-10">
            {logo && <Logo resource={logo} size="2xl" />}
            {socialMedia && (
              <div className="flex gap-4 text-white lg:justify-center">
                {socialMedia.facebook && (
                  <a
                    href={socialMedia.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-70 transition-opacity cursor-pointer"
                    aria-label="Facebook"
                  >
                    <FacebookIcon className="w-5 h-5" />
                  </a>
                )}
                {socialMedia.tiktok && (
                  <a
                    href={socialMedia.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-70 transition-opacity cursor-pointer"
                    aria-label="TikTok"
                  >
                    <TiktokIcon className="w-5 h-5" />
                  </a>
                )}
                {socialMedia.instagram && (
                  <a
                    href={socialMedia.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-70 transition-opacity cursor-pointer"
                    aria-label="Instagram"
                  >
                    <InstagramIcon className="w-5 h-5" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Column 1: Meniu */}
          {column1 && (
            <div className="flex flex-col gap-5">
              {column1.title && (
                <h3 className="font-montserrat font-semibold text-base text-white">{column1.title}</h3>
              )}
              {pages && pages.length > 0 && (
                <nav className="flex flex-col gap-3">
                  {pages.map((page) => {
                    if (typeof page === 'object' && page !== null && page.slug) {
                      const pageTitle = page.title || 'Untitled'
                      const pageSlug = page.slug
                      const href = `/${locale}/${pageSlug}`

                      return (
                        <Link
                          key={page.id || pageSlug}
                          href={href}
                          className="font-montserrat text-[#909596] text-sm hover:text-white transition-colors cursor-pointer"
                        >
                          {pageTitle}
                        </Link>
                      )
                    }
                    return null
                  })}
                </nav>
              )}
              {(!pages || pages.length === 0) && column1.links && column1.links.length > 0 && (
                <nav className="flex flex-col gap-3">
                  {column1.links.map((item, i) => (
                    <CMSLink
                      key={i}
                      {...item.link}
                      className="font-montserrat text-[#909596] text-sm hover:text-white transition-colors cursor-pointer"
                    />
                  ))}
                </nav>
              )}
            </div>
          )}

          {/* Column 2: Contacte + Ne găsești */}
          <div className="flex flex-col gap-8">
            {column2 && (
              <div className="flex flex-col gap-5">
                {column2.title && (
                  <h3 className="font-montserrat font-semibold text-base text-white">{column2.title}</h3>
                )}
                <div className="flex flex-col gap-3">
                  {column2.phone && (
                    <Link
                      href={`tel:${column2.phone.replace(/\s+/g, '').replace(/[^\d+]/g, '')}`}
                      className="font-montserrat text-[#909596] text-sm hover:text-white transition-colors cursor-pointer"
                    >
                      {column2.phone}
                    </Link>
                  )}
                  {column2.email && (
                    <Link
                      href={`mailto:${column2.email}`}
                      className="font-montserrat text-[#909596] text-sm hover:text-white transition-colors cursor-pointer"
                    >
                      {column2.email}
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
          {column3 && (
              <div className="flex flex-col gap-5">
                {column3.title && (
                  <h3 className="font-montserrat font-semibold text-base text-white">{column3.title}</h3>
                )}
                <div className="flex flex-col gap-3">
                  {(column3 as any).street && (
                    <Link
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((column3 as any).street)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-montserrat text-[#909596] text-sm hover:text-white transition-colors cursor-pointer"
                    >
                      {(column3 as any).street}
                    </Link>
                  )}
                  {(column3 as any).phone && (
                    <Link
                      href={`tel:${(column3 as any).phone.replace(/\s+/g, '').replace(/[^\d+]/g, '')}`}
                      className="font-montserrat text-[#909596] text-sm hover:text-white transition-colors cursor-pointer"
                    >
                      {(column3 as any).phone}
                    </Link>
                  )}
                </div>
              </div>
            )}

          {/* Column 4: Contactează-ne */}
          {contactUs && (
            <div className="flex flex-col gap-7">
              {contactUs.title && (
                <h3 className="font-montserrat font-semibold text-2xl text-white">{contactUs.title}</h3>
              )}
              {contactUs.phone && (
                <Link
                  href={`tel:${contactUs.phone.replace(/\s+/g, '').replace(/[^\d+]/g, '')}`}
                  className="flex items-center border border-[#3a4a5e] rounded-lg overflow-hidden max-w-[280px] bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <span className="font-montserrat flex-1 px-4 py-3 text-white text-sm">
                    {contactUs.phone}
                  </span>
                  <span className="px-4 py-3 text-[#4A90D9]">
                    <Send className="w-5 h-5" />
                  </span>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>


      <div className="container mx-auto px-6 py-5 border-t border-[#A4A9AA]">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
          {/* Left: Copyright + Legal Links */}
          <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-10">
            {copyright?.copyrightText && (
              <p className="font-montserrat text-[#A4A9AA] text-sm">{copyright.copyrightText}</p>
            )}
            {copyright?.legalLinks && copyright.legalLinks.length > 0 && (
              <div className="flex flex-wrap gap-10">
                {copyright.legalLinks.map((item, i) => (
                  <CMSLink
                    key={i}
                    {...item.link}
                    className="font-montserrat text-[#A4A9AA] text-sm hover:text-white transition-colors cursor-pointer"
                  />
                ))}
              </div>
            )}
          </div>
          {/* Right: Language Switcher */}
          <FooterLocaleSwitcher />
        </div>
      </div>
    </footer>
  )
}
