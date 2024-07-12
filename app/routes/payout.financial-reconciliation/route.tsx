import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { getAuthTokenFromCookie } from "@/lib/router-guard";
import { ClientOnly } from "remix-utils/client-only";
import FinancialReconciliationComponent from "@/components/users/financial-reconciliation";
import { useAdminStore } from "@/stores/admin-store";
import { Button } from "@/components/ui/button";

// Define the loader function
export const loader: LoaderFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie");
  const authToken = getAuthTokenFromCookie(cookieHeader);

  const leaseData = {
    leases: [],
    authToken: authToken,
  };

  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/Lease/activeWithTenantNames`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      },
    );

    if (response.ok) {
      const data = await response.json();
      leaseData.leases = data;
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch data");
  }

  return json(leaseData);
};

// Update the Users component
export default function Users() {
  const data = useLoaderData<typeof loader>();
  const [userData, setUserData] = useAdminStore((state) => [
    state.userData,
    state.setUserData,
  ]);
  const navigate = useNavigate();

  return (
    <ClientOnly>
      {() => (
        <section className="w-full mx-auto">
          <div className="flex items-center mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/payout/owner-list")}
            >
              <span className="mr-2">&lt;</span> Back
            </Button>
          </div>
          <FinancialReconciliationComponent data={data} payoutData={userData} />
        </section>
      )}
    </ClientOnly>
  );
}
