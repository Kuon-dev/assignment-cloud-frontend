import { useEffect, useState } from "react";
import { Outlet } from "@remix-run/react";
import { Layout, LayoutBody } from "@/components/custom/layout";
import DashboardSidebar, { LinkProps } from "@/components/dashboard/sidebar";
import {
  ownerSidebarLinks,
  tenantSidebarLinks,
} from "@/components/dashboard/constants";
import { useDashboardStore } from "@/stores/dashboard-store";

import { Settings } from "lucide-react";

export default function MaintenanceRequestLayout() {
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
    <>
      <DashboardSidebar
        sidebarLinks={sidebarLinks}
        settingsLink={settingsLink}
      />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Layout className="flex min-h-screen w-full flex-col relative">
          <LayoutBody>
            <main>
              <Outlet />
            </main>
          </LayoutBody>
        </Layout>
      </div>
    </>
  );
}
