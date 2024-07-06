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

export const adminSidebarLinks = [
  {
    to: "/dashboard",
    icon: <Home className="h-5 w-5" />,
    tooltip: "Dashboard",
  },
  {
    to: "/repos",
    icon: <Package className="h-5 w-5" />,
    tooltip: "Your code repos",
  },
  {
    to: "/purchases",
    icon: <Package className="h-5 w-5" />,
    tooltip: "Your purchased repos",
  },
  {
    to: "/orders",
    icon: <ShoppingCart className="h-5 w-5" />,
    tooltip: "Your orders",
  }, // seller only
  {
    to: "/tickets",
    icon: <LineChart className="h-5 w-5" />,
    tooltip: "Tickets",
  },
];

export const moderatorSidebarLinks = [
  {
    to: "/dashboard",
    icon: <Home className="h-5 w-5" />,
    tooltip: "Dashboard",
  },
  {
    to: "/repos",
    icon: <Package className="h-5 w-5" />,
    tooltip: "Your code repos",
  },
  {
    to: "/purchases",
    icon: <Package className="h-5 w-5" />,
    tooltip: "Your purchased repos",
  },
  {
    to: "/tickets",
    icon: <LineChart className="h-5 w-5" />,
    tooltip: "Tickets",
  },
];

export const sellerSidebarLinks = [
  {
    to: "/dashboard",
    icon: <Home className="h-5 w-5" />,
    tooltip: "Dashboard",
  },
  {
    to: "/repos",
    icon: <Package className="h-5 w-5" />,
    tooltip: "Your code repos",
  },
  {
    to: "/purchases",
    icon: <Package className="h-5 w-5" />,
    tooltip: "Your purchased repos",
  },
  {
    to: "/orders",
    icon: <ShoppingCart className="h-5 w-5" />,
    tooltip: "Your orders",
  },
];

export const buyerSidebarLinks = [
  {
    to: "/dashboard",
    icon: <Home className="h-5 w-5" />,
    tooltip: "Dashboard",
  },
  {
    to: "/repos",
    icon: <Package className="h-5 w-5" />,
    tooltip: "Your code repos",
  },
  {
    to: "/purchases",
    icon: <Package className="h-5 w-5" />,
    tooltip: "Your purchased repos",
  },
];

export const tenantSidebarLinks = [
  {
    to: "/dashboard",
    icon: <Home className="h-5 w-5" />,
    tooltip: "Dashboard",
  },
  {
    to: "/rentals",
    icon: <DollarSign className="h-5 w-5" />,
    tooltip: "Your rentals",
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
    to: "/maintenances",
    icon: <Wrench className="h-5 w-5" />,
    tooltip: "Your maintenance requests",
  },
];
