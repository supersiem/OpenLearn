import { route, type RouteConfig } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

export default [
    route('/api/auth/*', 'routes/api/auth.ts'),
    route('/api/trpc/*', 'routes/api/trpc.ts'),
    ...(await flatRoutes()),
] satisfies RouteConfig;