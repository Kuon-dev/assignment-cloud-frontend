import { useEffect, useState } from "react";
import { Outlet } from "@remix-run/react";
import { Layout, LayoutBody } from "@/components/custom/layout";
import DashboardSidebar, { LinkProps } from "@/components/dashboard/sidebar";
import { tenantSidebarLinks } from "@/components/dashboard/constants";

import { Settings } from "lucide-react";

export default function RentalLayout() {
  const [sidebarLinks, setSidebarLinks] = useState<LinkProps[]>([]);

  useEffect(() => {
    setSidebarLinks(tenantSidebarLinks);
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
