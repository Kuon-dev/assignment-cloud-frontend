import { json, LoaderFunction, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import React, { useEffect, useState } from "react";
import { getAuthTokenFromCookie } from "@/lib/router-guard";
import { Layout, LayoutBody } from "@/components/custom/layout";
import DashboardSidebar, { LinkProps } from "@/components/dashboard/sidebar";
import { adminSidebarLinks } from "@/components/dashboard/constants";
import { Settings } from "lucide-react";
import { ClientOnly } from "remix-utils/client-only";
import { cookieConsent } from "@/utils/cookies.server";
import { useAdminStore } from "@/stores/admin-store";

// Loader function to verify user role
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

  const user = await profileResponse.json();

  return json({ user });
};

// Users layout component
export default function UsersLayout() {
  const { user, authToken } = useLoaderData<typeof loader>();
  const [sidebarLinks, setSidebarLinks] = useState<LinkProps[]>([]);
  const [userData, setUserData] = useAdminStore((state) => [
    state.userData,
    state.setUserData,
  ]);

  useEffect(() => {
    setUserData({ user });
    setSidebarLinks(adminSidebarLinks);
  }, [user, setUserData]);

  const settingsLink: LinkProps = {
    to: "/settings/profile",
    icon: <Settings className="h-5 w-5" />,
    tooltip: "Settings",
  };

  return (
    <ClientOnly>
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
