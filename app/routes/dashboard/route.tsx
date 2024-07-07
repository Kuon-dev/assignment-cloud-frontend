import { useEffect, useState } from "react";
import { Outlet } from "@remix-run/react";
import DashboardSidebar, { LinkProps } from "@/components/dashboard/sidebar";
import { Layout, LayoutBody } from "@/components/custom/layout";
import {
  tenantSidebarLinks,
  ownerSidebarLinks,
  adminSidebarLinks,
} from "@/components/dashboard/constants";
import { Settings } from "lucide-react";
// import VerifyEmailComponent from "@/components/dashboard/verify-email";
import { useDashboardStore } from "@/stores/dashboard-store";

export default function DashboardLayout() {
  const [sidebarLinks, setSidebarLinks] = useState<LinkProps[]>([]);
  const [user] = useDashboardStore((state) => [state.user]);
  useEffect(() => {
    // if (!user) return;
    // switch (user.role) {
    //   case "admin":
    //     setSidebarLinks(adminSidebarLinks);
    //     break;
    //   case "tenant":
    //     setSidebarLinks(moderatorSidebarLinks);
    //     break;
    //   case "owner":
    //     setSidebarLinks(sellerSidebarLinks);
    //     break;
    //   default:
    //     setSidebarLinks(buyerSidebarLinks);
    // }
    setSidebarLinks(tenantSidebarLinks);
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
            <main>
              <Outlet />
            </main>
          </LayoutBody>
        </Layout>
      </div>
    </div>
  );
}
