import { json, LoaderFunction, redirect } from "@remix-run/node";
import { DataTable } from "@/components/data-table/data-tabe";
import { cookieConsent } from "@/utils/cookies.server";
import { toast } from "sonner";
import { useLoaderData } from "@remix-run/react";
import { columns, statuses } from "./table-schema";
import { ClientOnly } from "remix-utils/client-only";

export const loader: LoaderFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie");
  const userSession = await cookieConsent.parse(cookieHeader);
  if (!userSession || !userSession.token) {
    toast.error("You need to be logged in to view this page");
    // return redirect("/login");
  }

  const applicationData: ApplicationLoaderData = {
    applications: [],
  };

  try {
    const res = await fetch(`${process.env.BACKEND_URL}/api/Applications`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${userSession.token}`,
      },
    });
    console.log(res);

    if (res.ok) {
      const data = await res.json();
      applicationData.applications = data.items.$values;
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch data");
  }

  return json({
    ...applicationData,
  });
};

const filters = [
  {
    columnId: "status",
    title: "Status",
    options: statuses,
  },
];

export default function Applications() {
  const data = useLoaderData<typeof loader>();
  console.log(data);

  const { applications } = data;

  return (
    <section className="w-full mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Applications</h1>

      <div>
        <ClientOnly>
          {() => (
            <DataTable
              data={applications ?? []}
              columns={columns}
              filters={filters}
            />
          )}
        </ClientOnly>
      </div>
    </section>
  );
}
