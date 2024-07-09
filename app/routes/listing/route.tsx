import { Link, Outlet } from "@remix-run/react";
import { useDashboardStore } from "@/stores/dashboard-store";

import Navbar from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";
import { Button } from "@/components/ui/button";

export default function ListingLayout() {
  const user = useDashboardStore((state) => state.user);

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
