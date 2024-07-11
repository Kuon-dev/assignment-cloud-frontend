import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { getAuthTokenFromCookie } from "@/lib/router-guard";
import PerformanceAnalyticsComponent from "@/components/reporting/performance-analytic";
import ListingAnalyticsComponent from "@/components/reporting/listing-analytic";
import { ClientOnly } from "remix-utils/client-only";

// Loader function to fetch analytics data
export const loader: LoaderFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie");
  const authToken = getAuthTokenFromCookie(cookieHeader);

  if (!authToken) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  const response = await fetch(`${process.env.BACKEND_URL}/api/Admin/reports`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  const data = await response.json();

  return json({ data });
};

// Main component to render the analytics
const AnalyticsDashboard = () => {
  const navigate = useNavigate();
  const { data } = useLoaderData<typeof loader>();

  return (
    <ClientOnly>
      {() => (
        // <div className="container mx-auto p-4 flex-grow">
        //   <PerformanceAnalyticsComponent data={data.performanceAnalytics} />
        //   <ListingAnalyticsComponent data={data.listingAnalytics} />
        // </div>
        <div className="container mx-auto p-4 flex-grow">
          <div className="flex items-center mb-6">
            <h1 className="text-2xl font-semibold">Reporting</h1>
          </div>
          <div className="flex flex-wrap -mx-2">
            <div className="w-full md:w-1/2 px-2 mb-4">
              <PerformanceAnalyticsComponent data={data.performanceAnalytics} />
            </div>
            <div className="w-full md:w-1/2 px-2 mb-4">
              <ListingAnalyticsComponent data={data.listingAnalytics} />
            </div>
          </div>
        </div>
      )}
    </ClientOnly>
  );
};

export default AnalyticsDashboard;
