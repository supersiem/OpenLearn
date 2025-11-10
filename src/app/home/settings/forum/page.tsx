import ConstructionImg from "@/components/constructionImg";
import { useTranslations } from "next-intl"

export default function ForumSettings() {
    const t = useTranslations('instellingen')
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">{t("forum_settings")}</h1>
            <ConstructionImg />
        </div>
    )
}
