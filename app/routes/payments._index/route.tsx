import { useCallback, useEffect, useState } from "react";
import { DataTable } from "@/components/custom/data-table";
import { getAuthTokenFromCookie } from "@/lib/router-guard";
import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { ClientOnly } from "remix-utils/client-only";
import { Skeleton } from "@/components/ui/skeleton";
import { columns, OwnerColumns } from "./table-schema";
import { useDashboardStore } from "@/stores/dashboard-store";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

export const loader: LoaderFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie");
  const authToken = getAuthTokenFromCookie(cookieHeader);

  const paymentData: PaymentLoaderData = {
    payments: [],
    ENV: {
      BACKEND_URL: process.env.BACKEND_URL || "",
    },
  };

  try {
    const res = await fetch(
      `${process.env.BACKEND_URL}/api/users/payment-history`,
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
      paymentData.payments = data;
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch data");
  }

  return json(paymentData);
};

export default function Payments() {
  const user = useDashboardStore((state) => state.user);

  return (
    <section className="w-full mx-auto">
      {user?.tenant && <TenantComponent />}
      {user?.owner && <OwnerComponent />}
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

function TenantComponent() {
  const data = useLoaderData<typeof loader>();
  const { payments } = data;

  return (
    <>
      <h1 className="text-2xl font-semibold mb-4">Your Payment History</h1>
      <div>
        <ClientOnly fallback={<LoadingComponent />}>
          {() => <DataTable columns={columns} data={payments} />}
        </ClientOnly>
      </div>
    </>
  );
}

function OwnerComponent() {
  const user = useDashboardStore((state) => state.user);

  const data = useLoaderData<typeof loader>();
  const { ENV } = data;

  const [loading, setLoading] = useState<boolean>(false);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<Period | null>(null);
  const [payouts, setPayouts] = useState<Payout[]>([]);

  const fetchPayoutPeriods = useCallback(async () => {
    const cookies = document.cookie;
    const authToken = getAuthTokenFromCookie(cookies);

    try {
      const res = await fetch(`${ENV.BACKEND_URL}/api/Payout/Periods`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setPeriods(data.items);
      }
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch data");
    }
  }, [ENV.BACKEND_URL]);

  const fetchPayouts = useCallback(
    async (periodId: string) => {
      const cookies = document.cookie;
      const authToken = getAuthTokenFromCookie(cookies);

      setLoading(true);
      try {
        const res = await fetch(
          `${ENV.BACKEND_URL}/api/Payout/periods/${periodId}/owners/${user.owner.id}/payments`,
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
          setPayouts(data);
        }
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch payouts");
      } finally {
        setLoading(false);
      }
    },
    [ENV.BACKEND_URL, user.owner.id],
  );

  useEffect(() => {
    fetchPayoutPeriods();
  }, [fetchPayoutPeriods]);

  const handlePeriodSelect = (period: Period) => {
    setSelectedPeriod(period);
    fetchPayouts(period.id);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-1">
        <div className="flex items-center gap-4">
          <h1 className="font-semibold text-lg md:text-xl">Payouts</h1>
          <div className="ml-auto flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="tenant"
                  variant="outline"
                  className="w-[280px] justify-start text-left font-normal"
                  disabled={loading}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {selectedPeriod
                    ? `${formatDate(selectedPeriod.startDate)} - ${formatDate(selectedPeriod.endDate)}`
                    : "Select Period"}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 max-h-60 overflow-y-auto"
                align="end"
              >
                <div className="grid gap-2 p-2">
                  {periods.map((period) => (
                    <Button
                      key={period.id}
                      variant="ghost"
                      className="justify-start w-full"
                      onClick={() => handlePeriodSelect(period)}
                    >
                      {`${formatDate(period.startDate)} - ${formatDate(period.endDate)}`}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="grid gap-6">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <DataTable columns={OwnerColumns} data={payouts} />
          )}
        </div>
      </main>
    </>
  );
}
