import { Router } from 'express';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { UserRoutes } from '../modules/User/user.route';
import { FaqRoutes } from '../modules/Faq/faq.route';
import { BlogRoutes } from '../modules/Blog/blog.route';
import { AudioRoutes } from '../modules/AudioCollections/audio.route';
import { DoctorRoutes } from '../modules/Doctors/doctor.route';

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
    path: '/faq',
    route: FaqRoutes,
  },
  {
    path: "/blogs",
    route: BlogRoutes
  },
  {
    path:"/audio",
    route:AudioRoutes
  },
  {
    path:"/doctor",
    route:DoctorRoutes
  }

  //AppSystem routes
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
