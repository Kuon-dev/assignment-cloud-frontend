import React from "react";
import ProfileComponent from "@/components/users/profile";
import { ClientOnly } from "remix-utils/client-only";
import { Button } from "@/components/custom/button";
import { useNavigate } from "@remix-run/react";

export default function UserIndex() {
  const navigate = useNavigate();

  return (
    <ClientOnly>
      {() => (
        <div className="container w-full p-0 flex-grow items-center">
          <ProfileComponent />
        </div>
      )}
    </ClientOnly>
  );
}
