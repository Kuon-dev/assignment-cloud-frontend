import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getAuthTokenFromCookie } from "@/lib/router-guard";
import { ClientOnly } from "remix-utils/client-only";
import FinancialReconciliationComponent from "@/components/users/financial-reconciliation";
import { useAdminStore } from "@/stores/admin-store";

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

  return (
    <ClientOnly>
      {() => (
        <section className="w-full mx-auto">
          <FinancialReconciliationComponent
            data={data}
            owner={userData.owner}
          />
        </section>
      )}
    </ClientOnly>
  );
}
