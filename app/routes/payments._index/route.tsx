import { DataTable } from "@/components/custom/data-table";
import { PaginationComponent } from "@/components/custom/data-table-pagination";
import { getAuthTokenFromCookie } from "@/lib/router-guard";
import { cookieConsent } from "@/utils/cookies.server";
import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { ClientOnly } from "remix-utils/client-only";
import { Skeleton } from "@/components/ui/skeleton";
import { columns } from "./table-schema";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import CheckoutForm from "@/components/payment/form/checkout-form";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const pageNumber = url.searchParams.get("pageNumber") || "1";
  const pageSize = url.searchParams.get("pageSize") || "10";

  const cookieHeader = request.headers.get("Cookie");
  const authToken = getAuthTokenFromCookie(cookieHeader);
  const userSession = await cookieConsent.parse(cookieHeader);
  if (!userSession || !userSession.token) {
    // return redirect("/login");
  }

  const paymentData: PaymentLoaderData = {
    payments: [],
    totalCount: 0,
    ENV: {
      BACKEND_URL: process.env.BACKEND_URL || "",
      STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY || "",
    },
  };

  try {
    const res = await fetch(
      `${process.env.BACKEND_URL}/api/Payments?page=${pageNumber}&size=${pageSize}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      },
    );

    if (res.ok) {
      const data = await res.json();

      paymentData.payments = data.payments;
      paymentData.totalCount = data.totalCount;
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch data");
  }

  return json(paymentData);
};

export default function Payments() {
  const data = useLoaderData<typeof loader>();
  const { payments, totalCount, ENV } = data;
  const [searchParams, setSearchParams] = useSearchParams();
  const [stripe, setStripe] = useState<Stripe | null>(null);

  useEffect(() => {
    const fetchStripe = async () => {
      const stripeInstance = await loadStripe(ENV.STRIPE_PUBLIC_KEY);
      setStripe(stripeInstance);
    };
    fetchStripe();
  }, [ENV.STRIPE_PUBLIC_KEY]);

  const handleNavigation = (page: number) => {
    setSearchParams({ pageNumber: page.toString() });
  };

  if (!stripe) {
    return <LoadingComponent />;
  }

  return (
    <section className="w-full mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Your Payment History</h1>
      <div>
        <ClientOnly fallback={<LoadingComponent />}>
          {() => (
            <>
              <DataTable columns={columns} data={payments} />
              <PaginationComponent
                currentPage={parseInt(searchParams.get("pageNumber") || "1")}
                totalPages={Math.ceil(
                  totalCount / parseInt(searchParams.get("pageSize") || "10"),
                )}
                onPageChange={handleNavigation}
              />
              <Elements stripe={stripe} options={{}}>
                <CheckoutForm />
              </Elements>
            </>
          )}
        </ClientOnly>
      </div>
    </section>
  );
}

function LoadingComponent() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <p className="text-gray-500 dark:text-gray-400">
          Please wait while we are preparing the content
        </p>
        <div className="flex items-center space-x-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
