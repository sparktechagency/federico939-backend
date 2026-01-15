"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = require("../modules/Auth/auth.route");
const user_route_1 = require("../modules/User/user.route");
const faq_route_1 = require("../modules/Faq/faq.route");
const blog_route_1 = require("../modules/Blog/blog.route");
const audio_route_1 = require("../modules/AudioCollections/audio.route");
const doctor_route_1 = require("../modules/Doctors/doctor.route");
const blogBookmark_route_1 = require("../modules/BlogBookmark/blogBookmark.route");
const notification_route_1 = require("../modules/Notification/notification.route");
const sa_route_1 = require("../modules/SelfAss/sa.route");
const moodTracker_route_1 = require("../modules/MoodTracker/moodTracker.route");
const analytics_route_1 = require("../modules/Analytics/analytics.route");
const userPrompt_route_1 = require("../modules/UserPrompt/userPrompt.route");
const rule_route_1 = require("../modules/Rule/rule.route");
const pushNotification_route_1 = require("../modules/pushNotification/pushNotification.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/users',
        route: user_route_1.UserRoutes,
    },
    {
        path: '/auth',
        route: auth_route_1.AuthRoutes,
    },
    {
        path: '/faq',
        route: faq_route_1.FaqRoutes,
    },
    {
        path: '/blogs',
        route: blog_route_1.BlogRoutes,
    },
    {
        path: '/audio',
        route: audio_route_1.AudioRoutes,
    },
    {
        path: '/doctor',
        route: doctor_route_1.DoctorRoutes,
    },
    {
        path: '/bookmarks',
        route: blogBookmark_route_1.BlogBookmarkRoutes,
    },
    {
        path: '/notifications',
        route: notification_route_1.NotificationRoutes,
    },
    {
        path: '/self-assessment',
        route: sa_route_1.SelfAssRoutes,
    },
    {
        path: '/mood-trackers',
        route: moodTracker_route_1.MoodTrackerRoutes,
    },
    {
        path: '/analytics',
        route: analytics_route_1.AnalyticsRoutes,
    },
    {
        path: '/user-prompts',
        route: userPrompt_route_1.UserPromptRoutes,
    },
    {
        path: '/rules',
        route: rule_route_1.RuleRoutes,
    },
    {
        path: '/push-notifications',
        route: pushNotification_route_1.PushNotificationRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
