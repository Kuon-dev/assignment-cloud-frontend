import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "@remix-run/react";
import {
  adminSidebarLinks,
  ownerSidebarLinks,
  tenantSidebarLinks,
} from "@/components/dashboard/constants";
import { Settings } from "lucide-react";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Separator } from "@/components/ui/separator";
import { IconLogout, IconUser } from "@tabler/icons-react";
import SidebarNav from "@/components/dashboard/sidebar-nav";
import DashboardSidebar, { LinkProps } from "@/components/dashboard/sidebar";
import { Layout, LayoutBody } from "@/components/custom/layout";
import { useDashboardStore } from "@/stores/dashboard-store";
import { Button } from "@/components/ui/button";
import { getAuthTokenFromCookie } from "@/lib/router-guard";
import { toast } from "sonner";
import { ClientOnly } from "remix-utils/client-only";
import { showErrorToast } from "@/lib/handle-error";

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
      case !!user.admin:
        setSidebarLinks(adminSidebarLinks);
        break;
    }
  }, [user]);

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
            </main>
          </LayoutBody>
        </Layout>
      </div>
    </div>
  );
}

export function SettingsHeader() {
  const navigate = useNavigate();
  const cookies = document.cookie;
  const authToken = getAuthTokenFromCookie(cookies);
  const { setUser } = useDashboardStore();

  const handleLogout = async () => {
    try {
      const response = await fetch(
        `${window.ENV?.BACKEND_URL}/api/auth/logout`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          credentials: "include",
        },
      );
      if (response.ok) {
        sessionStorage.clear();
        document.cookie.split(";").forEach((cookie) => {
          const [name] = cookie.split("=");
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        });
        setUser(null);
        navigate("/");
      } else {
        toast.error("Logout failed");
      }
    } catch (error) {
      showErrorToast(error);
    }
  };

  return (
    <ClientOnly>
      {() => (
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
            <aside className="sticky top-0 lg:w-1/5 ">
              <SidebarNav items={sidebarNavItems} />
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="flex items-center justify-stretch py-2 pl-3 pr-0 mr-3 ml-1 w-full h-min"
              >
                <IconLogout size={18} className="mr-2" />
                Logout
              </Button>
            </aside>
            <div className="w-full p-1 pr-4 lg:max-w-2xl">
              <div className="pb-16">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      )}
    </ClientOnly>
  );
}

const sidebarNavItems = [
  {
    title: "Profile",
    icon: <IconUser size={18} />,
    href: "/settings/profile",
  },
];
