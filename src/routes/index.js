import { Suspense, lazy } from "react";
import { Navigate, useRoutes, useLocation, useParams } from "react-router-dom";
import DashboardLayout from "../layouts/dashboard";
import LogoOnlyLayout from "../layouts/LogoOnlyLayout";
// guards
import 'react-toastify/dist/ReactToastify.css';
import GuestGuard from "../guards/GuestGuard";
import AuthGuard from "../guards/AuthGuard";
import {
  PATH_AFTER_LOGIN,
  WAREHOUSE_MANAGER_ROLE,
  ADMIN_ROLE,
  FIELD_STAFF_ROLE,
} from "../config";
// components
import LoadingScreen from "../components/LoadingScreen";
import GeneralApp from "src/pages/dashboard/GeneralApp";
import UsersTable from "src/components/UserList";
import Coupons from "src/pages/Coupons";
import Blogs from "src/pages/Blogs";
import ThreatFeedManagement from "src/pages/ThreatFeedManagement";
import Plans from "src/pages/Plans";
import MalwareManagement from "src/components/warehouse/MalwareManagement";
import VictimsManagement from "src/components/warehouse/VictimsManagement";
import NewsGallery from "src/pages/NewsGallery";
import AllReelsPage from "src/pages/AllReelsPage";
import ClubsAndChaptersList from "src/components/ClubsAndChaptersList";
import BannerPage from "src/pages/BannerPage";
import UnapprovedCommunities from "src/pages/ApproveMembers";
import UsersManagement from "src/pages/UsersManagement";
import NotificationsPage from "src/pages/NotificationsPage";
import AdminBusinessDetails from "src/pages/UserBusinessPage";
import ServicesDashboard from "src/pages/ServicesPage";
import EventManagement from "src/pages/EventManagement";
// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();

  return (
    <Suspense
      fallback={<LoadingScreen isDashboard={pathname.includes("/dashboard")} />}
    >
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: "auth",
      children: [
        {
          path: "login",
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          ),
        },
      ],
    },

    // Dashboard Routes
    {
      path: "dashboard",
      element: (
        <AuthGuard>
          {/* <Warehouse /> */}
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        { path: "app", element: <GeneralApp /> },

        {
          path: "profile",
          element: (
            <AuthGuard >
              <Warehouse />
            </AuthGuard>
          ),
        },
        {
          path: "club-and-chapters",
          element: (
            <AuthGuard >
              <UsersTable />
            </AuthGuard>
          ),
        },
        {
          path: "notifications",
          element: (
            <AuthGuard >
              <NotificationsPage />
            </AuthGuard>
          ),
        },
        {
          path: "business-management",
          element: (
            <AuthGuard >
              <AdminBusinessDetails />
            </AuthGuard>
          ),
        },
        {
          path: "users-list",
          element: (
            <AuthGuard >
              <UsersManagement />
            </AuthGuard>
          ),
        }, {
          path: "approve-members",
          element: (
            <AuthGuard >
              <UnapprovedCommunities />
            </AuthGuard>
          ),
        }, {
          path: "Coupons",
          element: (
            <AuthGuard >
              <Coupons />
            </AuthGuard>
          ),
        },
        {
          path: "offers",
          element: (
            <AuthGuard >
              <Blogs />
            </AuthGuard>
          ),
        },
        {
          path: "biz-reels",
          element: (
            <AuthGuard >
              <ThreatFeedManagement />
            </AuthGuard>
          ),
        },
        {
          path: "Plans",
          element: (
            <AuthGuard >
              <Plans />
            </AuthGuard>
          ),
        },
        {
          path: "banner-management",
          element: (
            <AuthGuard >
              <BannerPage />
            </AuthGuard>
          ),
        },
        {
          path: "community-management",
          element: (
            <AuthGuard >
              <MalwareManagement />
            </AuthGuard>
          ),
        },
        {
          path: "services-management",
          element: (
            <AuthGuard >
              <ServicesDashboard />
            </AuthGuard>
          ),
        },
        {
          path: "event-management",
          element: (
            <AuthGuard >
              <EventManagement />
            </AuthGuard>
          ),
        },
        {
          path: "news-management",
          element: (
            <AuthGuard >
              <VictimsManagement />
            </AuthGuard>
          ),
        },
        {
          path: "news-gallery",
          element: (
            <AuthGuard >
              <NewsGallery />
            </AuthGuard>
          ),
        },
        {
          path: "all-reels",
          element: (
            <AuthGuard >
              <AllReelsPage />
            </AuthGuard>
          ),
        },
        {
          path: "clubs-and-chapters-list",
          element: (
            <AuthGuard >
              <ClubsAndChaptersList />
            </AuthGuard>
          ),
        },
        {
          path: "user",
          children: [
            {
              element: <Navigate to="/dashboard/user/profile" replace />,
              index: true,
            },
          ],
        },
      ],
    },

    // Main Routes
    {
      path: "*",
      element: <LogoOnlyLayout />,
      children: [
        { path: "500", element: <Page500 /> },
        { path: "404", element: <Page404 /> },
        { path: "403", element: <Page403 /> },
        { path: "*", element: <Navigate to="/404" replace /> },
      ],
    },

    { path: "/", element: <Navigate to="/dashboard/app" replace /> },
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}

// AUTHENTICATION
const Login = Loadable(lazy(() => import("../pages/auth/Login")));
const NewPassword = Loadable(lazy(() => import("../pages/auth/NewPassword")));
const Warehouse = Loadable(lazy(() => import("../pages/dashboard/Warehouse")));

const Page500 = Loadable(lazy(() => import("../pages/Page500")));
const Page403 = Loadable(lazy(() => import("../pages/Page403")));
const Page404 = Loadable(lazy(() => import("../pages/Page404")));
