import {
  Home,
  LineChart,
  Package,
  ShoppingCart,
  DollarSign,
  ScanEye,
  Wrench,
  LayoutDashboard,
  AlignJustify,
} from "lucide-react";

export const tenantSidebarLinks = [
  {
    to: "/dashboard",
    icon: <Home className="h-5 w-5" />,
    tooltip: "Dashboard",
  },
  {
    to: "/payments",
    icon: <DollarSign className="h-5 w-5" />,
    tooltip: "Your payments",
  },
  {
    to: "/applications",
    icon: <ScanEye className="h-5 w-5" />,
    tooltip: "Your application reviews",
  },
  {
    to: "/maintenances",
    icon: <Wrench className="h-5 w-5" />,
    tooltip: "Your maintenance requests",
  },
];

export const ownerSidebarLinks = [
  {
    to: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    tooltip: "Dashboard",
  },
  {
    to: "/properties",
    icon: <Home className="h-5 w-5" />,
    tooltip: "Your properties",
  },
  {
    to: "/listings",
    icon: <AlignJustify className="h-5 w-5" />,
    tooltip: "Your listings",
  },
  {
    to: "/applications",
    icon: <ScanEye className="h-5 w-5" />,
    tooltip: "Your application reviews",
  },
  {
    to: "/maintenances",
    icon: <Wrench className="h-5 w-5" />,
    tooltip: "Your maintenance requests",
  },
];

export const adminSidebarLinks = [
  {
    to: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    tooltip: "Dashboard",
  },
  {
    to: "/properties",
    icon: <Home className="h-5 w-5" />,
    tooltip: "Your properties",
  },
  {
    to: "/listings",
    icon: <AlignJustify className="h-5 w-5" />,
    tooltip: "Your listings",
  },
  {
    to: "/maintenances",
    icon: <Wrench className="h-5 w-5" />,
    tooltip: "Your maintenance requests",
  },
];
