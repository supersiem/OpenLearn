// CLEANUP NEEDED!!!
// de sidebar is lelijk en niet consistent met de rest van de app
"use client"

import { User, Settings, Bell, Shield, Palette } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
    useSidebar
} from "@/components/ui/sidebar"

import { useTranslations } from "next-intl"

export function SettingsSidebar() {
    const pathname = usePathname()
    const { state, isMobile } = useSidebar()

    // Dynamic width based on sidebar state
    const sidebarWidth = state === "expanded" ? "w-64" : "w-12"
    const t = useTranslations('instellingen')
    const items = [
        {
            title: t("account"),
            url: "/home/settings/account",
            icon: User,
        },
        {
            title: t("uiterlijk"),
            url: "/home/settings/appearance",
            icon: Palette,
        },
        {
            title: t("forum_settings"),
            url: "/home/settings/forum",
            icon: Settings,
        },
        {
            title: t("berichten"),
            url: "/home/settings/notifications",
            icon: Bell,
        },
        {
            title: t("privacy"),
            url: "/home/settings/privacy",
            icon: Shield,
        }
    ]
    return (
        <Sidebar
            className={`fixed top-16 h-[calc(100vh-4rem)] ${sidebarWidth} z-30 border-r border-border bg-neutral-800 transition-all duration-200`}
            collapsible="icon"
        >
            <SidebarContent>
                {/* Only show trigger on desktop */}
                {!isMobile && (
                    <div className="flex items-center justify-end p-2">
                        <SidebarTrigger
                            className="text-white hover:bg-neutral-700"
                        />
                    </div>
                )}
                <SidebarGroup>
                    <SidebarGroupLabel>{t("instellingen")}</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => {
                                const isActive = pathname === item.url

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                        >
                                            <Link href={item.url}>
                                                {item.icon && <item.icon size={18} />}
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}