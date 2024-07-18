import { json, LoaderFunction } from "@remix-run/node";
import { cookieConsent } from "@/utils/cookies.server";
import { useLoaderData } from "@remix-run/react";
import { ClientOnly } from "remix-utils/client-only";
import { DataTable, TableColumn } from "@/components/custom/data-table";
import { ownerColumns, tenantColumns } from "./table-schema";
import { Skeleton } from "@/components/ui/skeleton";
import { getAuthTokenFromCookie } from "@/lib/router-guard";
import { showErrorToast } from "@/lib/handle-error";
import { useDashboardStore } from "@/stores/dashboard-store";
import { useCallback, useEffect, useState } from "react";
import { TableFilter } from "@/components/custom/data-table-filter";

export const loader: LoaderFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie");
  const authToken = getAuthTokenFromCookie(cookieHeader);
  const userSession = await cookieConsent.parse(cookieHeader);
  if (!userSession || !userSession.token) {
    // return redirect("/login");
  }

  const applicationData: ApplicationLoaderData = {
    applications: [],
    ENV: {
      BACKEND_URL: process.env.BACKEND_URL || "",
    },
  };

  try {
    const res = await fetch(
      `${process.env.BACKEND_URL}/api/users/applications`,
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
      applicationData.applications = data;
    } else if (res.status === 404) {
      applicationData.applications = [];
    } else {
      console.error(`Error ${res.status}: ${res.statusText}`);
    }
  } catch (error) {
    showErrorToast(error);
  }

  return json(applicationData);
};

export default function Applications() {
  const user = useDashboardStore((state) => state.user);
  const initialData = useLoaderData<ApplicationLoaderData>();
  const [applications, setApplications] = useState<Application[]>(
    initialData.applications,
  );

  const fetchApplications = useCallback(async () => {
    const cookieHeader = document.cookie;
    const authToken = getAuthTokenFromCookie(cookieHeader);

    try {
      const res = await fetch(
        `${initialData.ENV.BACKEND_URL}/api/users/applications`,
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
        setApplications(data);
      } else {
        console.error(`Error ${res.status}: ${res.statusText}`);
      }
    } catch (error) {
      showErrorToast(error);
    }
  }, [initialData.ENV.BACKEND_URL]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return (
    <>
      <section className="w-full mx-auto">
        {user?.owner && (
          <ApplicationsComponent
            applications={applications}
            columns={ownerColumns(fetchApplications)}
            title="Applications"
          />
        )}
        {user?.tenant && (
          <ApplicationsComponent
            applications={applications}
            columns={tenantColumns(fetchApplications)}
            title="Applications"
          />
        )}
      </section>
    </>
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

type ApplicationsComponentProps = {
  applications: Application[];
  columns: TableColumn<Application>[];
  title: string;
};

const filterFunction = (application: Application, filter: string): boolean => {
  switch (filter) {
    case "all":
      return true;
    case "pending":
      return parseInt(application.status) === 0;
    case "approved":
      return parseInt(application.status) === 1;
    case "rejected":
      return parseInt(application.status) === 2;
    default:
      return false;
  }
};

const ApplicationsComponent: React.FC<ApplicationsComponentProps> = ({
  applications,
  columns,
  title,
}) => {
  const [filteredApplications, setFilteredApplications] =
    useState<Application[]>(applications);

  return (
    <section className="w-full mx-auto">
      <h1 className="text-2xl font-semibold mb-4">{title}</h1>
      <div>
        <ClientOnly fallback={<LoadingComponent />}>
          {() => (
            <>
              <TableFilter<Application>
                data={applications}
                filterFunction={filterFunction}
                onFilter={setFilteredApplications}
                filterOptions={[
                  { value: "all", label: "All" },
                  { value: "pending", label: "Pending" },
                  { value: "approved", label: "Approved" },
                  { value: "rejected", label: "Rejected" },
                ]}
              />
              <DataTable columns={columns} data={filteredApplications} />
            </>
          )}
        </ClientOnly>
      </div>
    </section>
  );
};
