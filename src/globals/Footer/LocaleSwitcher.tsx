'use client'

import React, { useState, useTransition } from 'react'
import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/routing'
import { useParams } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Globe, ChevronDown } from 'lucide-react'
import { TypedLocale } from 'payload'
import localization from '@/i18n/localization'
import { cn } from '@/utilities/ui'

export function FooterLocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const [, startTransition] = useTransition()
  const pathname = usePathname()
  const params = useParams()
  const [isOpen, setIsOpen] = useState(false)

  function onSelectChange(value: TypedLocale) {
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale: value },
      )
    })
    setIsOpen(false)
  }

  const currentLocale = localization.locales.find((loc) => loc.code === locale)

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-sm text-[#A4A9AA] hover:text-white hover:!bg-transparent focus:!bg-transparent active:!bg-transparent border-none focus:ring-0 focus:outline-none focus:ring-offset-0 [&[data-state=open]]:!bg-transparent [&[data-state=open]]:border-none px-0"
        >
          <Globe className="h-4 w-4 flex-shrink-0" />
          <span>{currentLocale?.label || locale}</span>
          <ChevronDown 
            className={cn(
              "h-4 w-4 flex-shrink-0 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-[150px] bg-white text-black rounded-lg p-2 space-y-1 z-50"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        {localization.locales
          .sort((a, b) => a.label.localeCompare(b.label))
          .map((loc) => (
            <DropdownMenuItem
              key={loc.code}
              onClick={() => onSelectChange(loc.code as TypedLocale)}
              className={cn(
                "cursor-pointer font-medium hover:bg-accent-foreground hover:text-white focus:hover:bg-accent-foreground focus:text-white",
                locale === loc.code && "bg-accent-foreground text-white"
              )}
            >
              {loc.label}
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
