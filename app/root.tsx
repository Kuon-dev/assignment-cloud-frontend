import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  json,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { cookieConsent } from "@/utils/cookies.server";
import stylesheet from "@/tailwind.css?url";
import type {
  LinksFunction,
  LoaderFunction,
  ActionFunction,
} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Toaster } from "@/components/ui/sonner";
import CookieBanner from "@/components/landing/cookie-banner";
import { useDashboardStore } from "./stores/dashboard-store";
import { useEffect } from "react";
import { toast } from "sonner";
import { getAuthTokenFromCookie } from "./lib/router-guard";
import { showErrorToast } from "./lib/handle-error";
// import { json, LoaderFunction, ActionFunction } from "@remix-run/node";
//

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

type Me = {
  user: Omit<User, "passwordHash">;
  profile: Profile;
};

export const loader: LoaderFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await cookieConsent.parse(cookieHeader)) || {};
  const authToken = getAuthTokenFromCookie(cookieHeader);

  let user: Me | null = null;
  try {
    user = await fetch(`${process.env.BACKEND_URL}/api/users/profile`, {
      headers: {
        Cookie: cookieHeader ?? "",
        Authorization: `Bearer ${authToken}` ?? "",
      },
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
    });
  } catch (error) {
    showErrorToast(error);
  }

  return json({
    showBanner: !cookie.accepted,
    userData: user as Me,
    ENV: {
      BACKEND_URL: process.env.BACKEND_URL,
      STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
    },
  });
};

declare global {
  interface Window {
    ENV: {
      BACKEND_URL: string;
      STRIPE_PUBLIC_KEY: string;
    };
  }
}

export const action: ActionFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await cookieConsent.parse(cookieHeader)) || {};

  const formData = await request.formData();
  // console.log('POST', formData.get("analytics"))
  if (formData.get("analytics")) {
    cookie.accepted = true;
    cookie.value = {
      essential: true,
      analytics: formData.get("analytics") === "true",
    };
  }

  return redirect("/", {
    headers: {
      "Set-Cookie": await cookieConsent.serialize(cookie),
    },
  });
};

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useLoaderData<typeof loader>();
  const setUser = useDashboardStore((state) => state.setUser);

  useEffect(() => {
    const userData = data.userData as Me;
    if (userData) {
      setUser(data.userData);
    }
  });
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="dark">
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data?.ENV)}`,
          }}
        ></script>
        <ScrollRestoration />
        {data.showBanner && <CookieBanner />}
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <>
      <Toaster />
      <Outlet />
    </>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  return (
    <html lang="en">
      <head>
        <title>Oops!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <h1>
          Error
          {isRouteErrorResponse(error)
            ? `${error.status} ${error.statusText}`
            : error instanceof Error
              ? error.message
              : "Unknown Error"}
        </h1>
        <Scripts />
      </body>
    </html>
  );
}
