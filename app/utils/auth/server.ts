import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { prisma } from '~/utils/prisma'
import { admin, genericOAuth, organization, username } from "better-auth/plugins"

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: !!process.env.SMTP_HOST,
    },
    advanced: {
        database: {
            generateId: () => {
                return crypto.randomUUID()
            }
        }
    },
    socialProviders: {
        // idk
    },
    plugins: [
        genericOAuth({
            config: [
                ...(process.env.HOSTED_BY_POLARNL_CLOUD === 'true') ? [{
                    providerId: "PolarNL-StaffAuth",
                    discoveryUrl: "https://sso.polarnl.org/application/o/polar-learn-medewerkers-inlog/.well-known/openid-configuration",
                    redirectURI: `${process.env.APP_BASE || 'http://localhost:5173'}/api/auth/callback/PolarNL-StaffAuth`,
                    clientId: process.env.POLARNL_STAFFAUTH_CLIENT_ID || "",
                    clientSecret: process.env.POLARNL_STAFFAUTH_CLIENT_SECRET || "",
                    scopes: ["openid", "email", "profile"],
                }] : []
            ],
        }),
        organization({
            allowUserToCreateOrganization: async (user) => {
                return user.role === 'platform_admin'
            }
        }),
        admin(),
        username()
    ],
    baseURL: process.env.APP_BASE || 'http://localhost:5173',
    database: prismaAdapter(prisma, {
        provider: 'postgresql'
    })
})