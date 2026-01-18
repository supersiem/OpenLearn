import { prefix, route, type RouteConfig } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

export default [
    route('/api/auth/*', 'routes/api/auth.ts'),
    route('/api/trpc/*', 'routes/api/trpc.ts'),
    route('/', 'routes/_index.tsx'),
    route('/auth/login', 'routes/auth/login.tsx'),
    route('/app', 'routes/app/home.tsx'),
    ...prefix('/app/forum', [
        route('', 'routes/app/forum/list.tsx'),
        route('make', 'routes/app/forum/makePost.tsx'),
        route(':postId', 'routes/app/forum/viewpost.tsx'),
    ])
] satisfies RouteConfig;