'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'
import { FormBlock } from '@/blocks/Form/Component'

type FooterWrapperProps = {
  contactForm?: FormType | string | null | any
  contactUsTitle?: string | null
  locale: string
}

export function FooterWrapper({ contactForm, contactUsTitle, locale }: FooterWrapperProps) {
  const pathname = usePathname()
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkPage = async () => {
      try {
        const isPostPage = pathname.includes('/posts/')
        
        if (isPostPage) {
          setShowForm(true)
          setLoading(false)
          return
        }

        const pathParts = pathname.split('/').filter(Boolean)
        const slug = pathParts[pathParts.length - 1] || 'home'

        const res = await fetch(`/api/pages?where[slug][equals]=${slug}&locale=${locale}&limit=1`)
        const data = await res.json()
        const page = data.docs?.[0]

        setShowForm(page?.showFooterContactForm || false)
      } catch (error) {
        console.error('Error checking page:', error)
        setShowForm(false)
      } finally {
        setLoading(false)
      }
    }

    checkPage()
  }, [pathname, locale])

  if (loading || !showForm || !contactForm || typeof contactForm === 'string') {
    return null
  }

  return (
    <div className="py-8 md:py-16 md:px-8">
      <div className="container mx-auto max-w-2xl">
        {/* Title */}
        {contactUsTitle && (
          <h2 className="font-montserrat text-3xl md:text-4xl font-bold text-white text-center mb-8">
            {contactUsTitle}
          </h2>
        )}
        
        {/* Form */}
        <div className="bg-primary rounded-lg p-6 md:p-8 text-white">
          <FormBlock
            form={contactForm as any}
            enableIntro={false}
          />
        </div>
      </div>
    </div>
  )
}
