import { route, type RouteConfig } from "@react-router/dev/routes";

export default [
    route("/", "routes/_index.tsx"),

    route('/api/auth/*', 'routes/api/auth.ts'),
    route('/api/trpc/*', 'routes/api/trpc.ts'),

    route('/auth/login', 'routes/auth/login.tsx'),
    route('/auth/signup', 'routes/auth/signup.tsx'),
    route('/user', 'routes/user.tsx'),
] satisfies RouteConfig;