import { Link, Outlet } from "@remix-run/react";
import { useDashboardStore } from "@/stores/dashboard-store";

import { Layout, LayoutBody } from "@/components/custom/layout";
import DashboardSidebar, { LinkProps } from "@/components/dashboard/sidebar";
import {
  ownerSidebarLinks,
  tenantSidebarLinks,
} from "@/components/dashboard/constants";
import Navbar from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

export default function ListingLayout() {
  const user = useDashboardStore((state) => state.user);

  return (
    <>
      {user ? (
        <>
          {user.owner && <OwnerComponent />}
          {user.tenant && <TenantComponent />}
        </>
      ) : (
        <GuestComponent />
      )}
    </>
  );
}

function GuestComponent() {
  return (
    <>
      <Navbar />
      <div className="w-full bg-black dark:bg-grid-white/[0.1] bg-grid-black/[0.2] pb-20 pt-32">
        <div className="mx-auto max-w-5xl">
          <div className="flex justify-between">
            <Button variant="link">
              <Link to="/">&larr; Back to Home</Link>
            </Button>
          </div>

          <Outlet />

          <Footer className="pt-10 mx-auto" />
        </div>
      </div>
    </>
  );
}

const settingsLink: LinkProps = {
  to: "/settings/profile",
  icon: <Settings className="h-5 w-5" />,
  tooltip: "Settings",
};

function OwnerComponent() {
  return (
    <>
      <DashboardSidebar
        sidebarLinks={ownerSidebarLinks}
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

function TenantComponent() {
  return (
    <>
      <DashboardSidebar
        sidebarLinks={tenantSidebarLinks}
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
