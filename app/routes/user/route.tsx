import { json, LoaderFunction, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import React, { useEffect, useState } from "react";
import { getAuthTokenFromCookie } from "@/lib/router-guard";
import { Layout, LayoutBody } from "@/components/custom/layout";
import DashboardSidebar, { LinkProps } from "@/components/dashboard/sidebar";
import {
  adminSidebarLinks,
  ownerSidebarLinks,
  tenantSidebarLinks,
} from "@/components/dashboard/constants";
import { Settings } from "lucide-react";
import { ClientOnly } from "remix-utils/client-only";
import { useAdminStore } from "@/stores/admin-store";

export const loader: LoaderFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie");
  const authToken = getAuthTokenFromCookie(cookieHeader);

  // Fetch user profile to check role
  const profileResponse = await fetch(
    `${process.env.BACKEND_URL}/api/users/profile`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    },
  );

  if (!profileResponse.ok) {
    return redirect("/login");
  }

  const result = await profileResponse.json();
  return json({ result });
};

export default function UsersLayout() {
  const data = useLoaderData<typeof loader>();
  const [sidebarLinks, setSidebarLinks] = useState<LinkProps[]>([]);
  const { userData, setUserData } = useAdminStore();

  useEffect(() => {
    if (data.result) {
      setUserData(data.result);
    }
  }, [data.result, setUserData]);

  useEffect(() => {
    if (userData) {
      if (userData.role === 0) {
        setSidebarLinks(tenantSidebarLinks);
      } else if (userData.role === 1) {
        setSidebarLinks(ownerSidebarLinks);
      } else if (userData.role === 2) {
        setSidebarLinks(adminSidebarLinks);
      }
    }
  }, [userData]);

  const settingsLink: LinkProps = {
    to: "/settings/profile",
    icon: <Settings className="h-5 w-5" />,
    tooltip: "Settings",
  };

  if (!data || !data.result) {
    console.log("No data or data.result. Rendering loading state.");
    return <div>Loading...</div>;
  }

  return (
    <ClientOnly fallback={<div>Loading...</div>}>
      {() => (
        <React.Fragment>
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
        </React.Fragment>
      )}
    </ClientOnly>
  );
}
