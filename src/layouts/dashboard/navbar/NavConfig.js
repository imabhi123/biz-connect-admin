import { PATH_DASHBOARD } from "../../../routes/paths";
import SvgIconStyle from "../../../components/SvgIconStyle";
// Import Material-UI icons
import { 
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Menu as MenuIcon,
  GroupAdd as GroupAddIcon,
  Collections as CollectionsIcon,
  LocalOffer as LocalOfferIcon,
  PersonAdd as PersonAddIcon,
  VideoLibrary as VideoLibraryIcon,
  Business as BusinessIcon,
  MiscellaneousServices as ServicesIcon,
  Event as EventIcon,
  People as PeopleIcon,
  Newspaper as NewsIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';

const getIcon = (name) => (
  <SvgIconStyle
    src={`/assets/icons/navbar/${name}.svg`}
    sx={{ width: 1, height: 1 }}
  />
);

const ICONS = {
  blog: getIcon("ic_blog"),
  cart: getIcon("ic_cart"),
  chat: getIcon("ic_chat"),
  mail: getIcon("ic_mail"),
  user: getIcon("ic_user"),
  kanban: getIcon("ic_kanban"),
  banking: getIcon("ic_banking"),
  booking: getIcon("ic_booking"),
  invoice: getIcon("ic_invoice"),
  calendar: getIcon("ic_calendar"),
  ecommerce: getIcon("ic_ecommerce"),
  analytics: getIcon("ic_analytics"),
  dashboard: getIcon("ic_dashboard"),
  menuItem: getIcon("ic_menu_item"),
};

const navConfig = [
  {
    subheader: "",
    items: [
      {
        title: "Profile",
        path: PATH_DASHBOARD.general.warehouse,
        icon: <PersonIcon />,
      },
      {
        title: "Users Management",
        path: PATH_DASHBOARD.general.userslist,
        icon: <GroupAddIcon />,
      },
      {
        title: "Clubs and Chapters",
        path: PATH_DASHBOARD.general.users,
        icon: <PeopleIcon />,
      },
      {
        title: "Banner Management",
        path: PATH_DASHBOARD.general.banner,
        icon: <CollectionsIcon />,
      },
      {
        title: "Offers",
        path: PATH_DASHBOARD.general.blogs,
        icon: <LocalOfferIcon />,
      },
      {
        title: "New Member Requests",
        path: PATH_DASHBOARD.general.approve_members,
        icon: <PersonAddIcon />,
      },
      {
        title: "Biz Reels",
        path: PATH_DASHBOARD.general.threatFeed,
        icon: <VideoLibraryIcon />,
      },
      {
        title: "Business Management",
        path: PATH_DASHBOARD.general.business,
        icon: <BusinessIcon />,
      },
      {
        title: "Services Management",
        path: PATH_DASHBOARD.general.services,
        icon: <ServicesIcon />,
      },
      {
        title: "Event Management",
        path: PATH_DASHBOARD.general.event,
        icon: <EventIcon />,
      },
      {
        title: "Members",
        path: PATH_DASHBOARD.general.malwareManagement,
        icon: <PeopleIcon />,
      },
      {
        title: "News",
        path: PATH_DASHBOARD.general.victimsManagement,
        icon: <NewsIcon />,
      },
      {
        title: "Notifications",
        path: PATH_DASHBOARD.general.notifications,
        icon: <NotificationsIcon />,
      },
    ],
  },
];

export default navConfig;