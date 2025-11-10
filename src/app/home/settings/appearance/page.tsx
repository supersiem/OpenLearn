"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import { useTranslations } from "next-intl"

export default function AppearancePage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const t = useTranslations('instellingen')
  const algemene_woordenschat = useTranslations("algemene_woordenschat")

  useEffect(() => {
    setMounted(true)
  }, [])

  const saveThemeToServer = async (newTheme: string) => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/v1/settings/theme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ theme: newTheme }),
      })

      if (!response.ok) {
        throw new Error('Failed to save theme')
      }
    } catch (error) {
      console.error('Error saving theme:', error)
      // You could add a toast notification here
    } finally {
      setIsSaving(false)
    }
  }

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
    saveThemeToServer(newTheme)
  }

  if (!mounted) {
    return <div>{algemene_woordenschat("laden")}</div>
  }

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{t("uiterlijk")}</h1>
        <p className="text-muted-foreground">
          {t("uiterlijk_description")}
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">{t('theme')}</h2>
          <div className="grid grid-cols-2 gap-4 max-w-md">
            {/* Light Theme */}
            <div
              className={`cursor-pointer rounded-lg border-2 p-4 transition-colors ${theme === 'light'
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
                }`}
              onClick={() => handleThemeChange('light')}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="rounded-md border bg-background p-3">
                  <Sun className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium">{t("theme_HELP_MY_EYES")}</span>
              </div>
            </div>

            {/* Dark Theme */}
            <div
              className={`cursor-pointer rounded-lg border-2 p-4 transition-colors ${theme === 'dark'
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
                }`}
              onClick={() => handleThemeChange('dark')}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="rounded-md border bg-background p-3">
                  <Moon className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium">{t("theme_correct")}</span>
              </div>
            </div>
          </div>

          {isSaving && (
            <p className="mt-2 text-sm text-muted-foreground">
              {algemene_woordenschat("opslaan")}...
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
