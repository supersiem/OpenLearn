import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { prisma } from '~/utils/prisma'
import { genericOAuth } from "better-auth/plugins"

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
    },

    socialProviders: {
        // Add social providers here (e.g., Google, Facebook)
    },
    plugins: [
        genericOAuth({
            config: [
                {
                    providerId: "PolarNL",
                    discoveryUrl: "https://sso.polarnl.org/application/o/polar-learn-medewerkers-inlog/.well-known/openid-configuration",
                    redirectURI: `${process.env.BETTER_AUTH_URL || 'http://localhost:5173'}/api/auth/callback/PolarNL`,
                    clientId: process.env.CUSTOM_CLIENT_ID || "",
                    clientSecret: process.env.CUSTOM_CLIENT_SECRET || "",
                    scopes: ["openid", "email", "profile"],
                },
                {
                    providerId: "hackclub",
                    discoveryUrl: "https://auth.hackclub.com/.well-known/openid-configuration",
                    clientId: process.env.HACKCLUB_CLIENT_ID || "",
                    clientSecret: process.env.HACKCLUB_CLIENT_SECRET || "",
                    redirectURI: `${process.env.BETTER_AUTH_URL || 'http://localhost:5173'}/api/auth/callback/hackclub`,
                    scopes: ["openid", "profile", "email", "name"],
                }
            ],
        }),
    ],
    baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:5173',
    database: prismaAdapter(prisma, {
        provider: 'postgresql'
    })
})