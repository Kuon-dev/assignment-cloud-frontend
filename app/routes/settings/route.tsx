import { useEffect, useState } from "react";
import { Outlet } from "@remix-run/react";
import {
  adminSidebarLinks,
  ownerSidebarLinks,
  tenantSidebarLinks,
} from "@/components/dashboard/constants";
import { Settings } from "lucide-react";
import VerifyEmailComponent from "@/components/dashboard/verify-email";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Separator } from "@/components/ui/separator";
import { IconTool, IconUser } from "@tabler/icons-react";
import SidebarNav from "@/components/dashboard/sidebar-nav";
import DashboardSidebar, { LinkProps } from "@/components/dashboard/sidebar";
import { Layout, LayoutBody } from "@/components/custom/layout";
import { useDashboardStore } from "@/stores/dashboard-store";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  if (request.url === "/settings") return redirect("/settings/profile");
  // else no redirect
  return {
    props: {},
  };
};

export default function DashboardLayout() {
  const user = useDashboardStore((state) => state.user);
  const [sidebarLinks, setSidebarLinks] = useState<LinkProps[]>([]);
  useEffect(() => {
    if (!user) return;
    switch (true) {
      case !!user.tenant:
        setSidebarLinks(tenantSidebarLinks);
        break;
      case !!user.owner:
        setSidebarLinks(ownerSidebarLinks);
        break;
    }
  }, []);

  const settingsLink: LinkProps = {
    to: "/settings/profile",
    icon: <Settings className="h-5 w-5" />,
    tooltip: "Settings",
  };

  return (
    <div>
      <DashboardSidebar
        sidebarLinks={sidebarLinks}
        settingsLink={settingsLink}
      />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Layout className="flex min-h-screen w-full flex-col relative">
          <LayoutBody>
            <main className="">
              <SettingsHeader />
              <VerifyEmailComponent />
            </main>
          </LayoutBody>
        </Layout>
      </div>
    </div>
  );
}

export function SettingsHeader() {
  return (
    <div>
      <div className="space-y-0.5">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account settings and set e-mail preferences.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-1 flex-col space-y-8 overflow-auto lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="sticky top-0 lg:w-1/5">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="w-full p-1 pr-4 lg:max-w-xl">
          <div className="pb-16">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

const sidebarNavItems = [
  {
    title: "Profile",
    icon: <IconUser size={18} />,
    href: "/settings/profile",
  },
  {
    title: "Account",
    icon: <IconTool size={18} />,
    href: "/settings/account",
  },
  // {
  //   title: "Appearance",
  //   icon: <IconPalette size={18} />,
  //   href: "/settings/appearance",
  // },
  // {
  //   title: "Notifications",
  //   icon: <IconNotification size={18} />,
  //   href: "/settings/notifications",
  // },
  // {
  //   title: "Display",
  //   icon: <IconBrowserCheck size={18} />,
  //   href: "/settings/display",
  // },
  // {
  //   title: "Error Example",
  //   icon: <IconExclamationCircle size={18} />,
  //   href: "/settings/error-example",
  // },
];
