import { Router } from 'express';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { UserRoutes } from '../modules/User/user.route';
import { FaqRoutes } from '../modules/Faq/faq.route';
import { BlogRoutes } from '../modules/Blog/blog.route';
import { AudioRoutes } from '../modules/AudioCollections/audio.route';
import { DoctorRoutes } from '../modules/Doctors/doctor.route';
import { BlogBookmarkRoutes } from '../modules/BlogBookmark/blogBookmark.route';
import { NotificationRoutes } from '../modules/Notification/notification.route';
import { SelfAssRoutes } from '../modules/SelfAss/sa.route';
import { MoodTrackerRoutes } from '../modules/MoodTracker/moodTracker.route';


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
    path: "/audio",
    route: AudioRoutes
  },
  {
    path: "/doctor",
    route: DoctorRoutes
  },
  {
    path: "/bookmarks",
    route: BlogBookmarkRoutes
  },
  {
    path: "/notifications",
    route: NotificationRoutes
  },
  {
    path: "/self-assessment",
    route: SelfAssRoutes
  },
  {
    path: "/mood-trackers",
    route: MoodTrackerRoutes
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
