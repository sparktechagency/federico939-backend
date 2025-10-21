import { Router } from 'express';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { UserRoutes } from '../modules/User/user.route';
import { FaqRoutes } from '../modules/Faq/faq.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: 'faq',
    route: FaqRoutes,
  },

  //AppSystem routes
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
