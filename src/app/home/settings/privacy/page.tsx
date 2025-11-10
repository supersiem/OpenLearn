"use client"

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslations } from "next-intl"

export default function PrivacySettings() {
  const t = useTranslations('instellingen')
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{t("privacy")}</h1>

      <Card className="mb-6 bg-neutral-800 text-white border-neutral-700">
        <CardHeader>
          <CardTitle>{t('analystics')}</CardTitle>
          <CardDescription className="text-neutral-400">
            {t('analystics_description')}
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
