import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { getAuthTokenFromCookie } from "@/lib/router-guard";
import { ClientOnly } from "remix-utils/client-only";
import FinancialReconciliationComponent from "@/components/users/financial-reconciliation";
import { useAdminStore } from "@/stores/admin-store";
import { Button } from "@/components/ui/button";
import { showErrorToast } from "@/lib/handle-error";

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
    showErrorToast(error);
  }

  return json(leaseData);
};

export default function PayoutTenantLeases() {
  const data = useLoaderData<typeof loader>();
  const [payoutData, setPayoutData] = useAdminStore((state) => [
    state.payoutData,
    state.setPayoutData,
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
          <FinancialReconciliationComponent
            data={data}
            payoutData={payoutData}
          />
        </section>
      )}
    </ClientOnly>
  );
}
